import { Inject, Injectable } from '@nestjs/common';
import { and, desc, eq, ilike, lt, ne, notInArray, or, type Column } from 'drizzle-orm';
import { toSelfUser } from '../auth/auth.service';
import { ApiException } from '../common/exception.filter';
import { buildPage, decodeCursor, encodeCursor, parseLimit } from '../common/pagination';
import { DB, type Db } from '../db/db.module';
import { blocks, fieldVisibility, follows, mutes, profiles, users } from '../db/schema';
import { RelationshipService } from './relationship.service';
import { toUserLite, type UserLite } from './user-lite';
import { filterProfileForViewer, type PublicProfile } from './visibility';
import type { PatchMeDto } from './dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DB) private readonly db: Db,
    private readonly rel: RelationshipService,
  ) {}

  private async ensureProfile(userId: string): Promise<typeof profiles.$inferSelect> {
    const [existing] = await this.db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);
    if (existing) return existing;
    const [created] = await this.db.insert(profiles).values({ userId }).returning();
    return created!;
  }

  async getMe(userId: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, userId)).limit(1);
    const profile = await this.ensureProfile(userId);
    return { user: toSelfUser(user!), profile };
  }

  async patchMe(userId: string, dto: PatchMeDto) {
    await this.ensureProfile(userId);
    const { isPrivate, ...profileFields } = dto;
    if (Object.keys(profileFields).length > 0) {
      await this.db
        .update(profiles)
        .set({ ...profileFields, updatedAt: new Date() })
        .where(eq(profiles.userId, userId));
    }
    if (typeof isPrivate === 'boolean') {
      await this.db.update(users).set({ isPrivate }).where(eq(users.id, userId));
    }
    return this.getMe(userId);
  }

  async setVisibility(userId: string, field: string, level: 'public' | 'followers' | 'private') {
    await this.db
      .insert(fieldVisibility)
      .values({ userId, field, level })
      .onConflictDoUpdate({
        target: [fieldVisibility.userId, fieldVisibility.field],
        set: { level },
      });
    const rows = await this.db
      .select()
      .from(fieldVisibility)
      .where(eq(fieldVisibility.userId, userId));
    return { visibility: rows.map((r) => ({ field: r.field, level: r.level })) };
  }

  async getByUsername(
    viewerId: string,
    username: string,
  ): Promise<{ user: UserLite; profile: PublicProfile; relationship: unknown }> {
    const [user] = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    if (!user || user.accountStatus === 'banned') {
      throw new ApiException('NOT_FOUND', 'User not found', 404);
    }
    if (await this.rel.isBlockedEitherWay(viewerId, user.id)) {
      throw new ApiException('NOT_FOUND', 'User not found', 404);
    }
    const profile = await this.ensureProfile(user.id);
    const visRows = await this.db
      .select()
      .from(fieldVisibility)
      .where(eq(fieldVisibility.userId, user.id));
    const relationship = await this.rel.between(viewerId, user.id);
    const filtered = filterProfileForViewer(
      {
        displayName: profile.displayName,
        bio: profile.bio,
        avatarUrl: user.avatarUrl,
        dob: profile.dob,
        gender: profile.gender,
        profession: profile.profession,
        website: profile.website,
        email: user.email,
      },
      visRows.map((r) => ({ field: r.field, level: r.level })),
      relationship,
      viewerId === user.id,
    );
    return { user: toUserLite(user), profile: filtered, relationship };
  }

  async search(viewerId: string, q: string) {
    if (q.trim().length < 2) return { items: [] };
    const blocked = await this.db
      .select({ id: blocks.blockedId })
      .from(blocks)
      .where(eq(blocks.blockerId, viewerId));
    const blockedIds = blocked.map((b) => b.id);
    const pattern = `%${q}%`;
    const rows = await this.db
      .select()
      .from(users)
      .where(
        and(
          or(ilike(users.username, pattern), ilike(users.displayName, pattern)),
          ne(users.id, viewerId),
          eq(users.accountStatus, 'active'),
          blockedIds.length > 0 ? notInArray(users.id, blockedIds) : undefined,
        ),
      )
      .limit(20);
    return { items: rows.map(toUserLite) };
  }

  async follow(
    followerId: string,
    followeeId: string,
  ): Promise<{ status: 'accepted' | 'pending' }> {
    if (followerId === followeeId) {
      throw new ApiException('VALIDATION', 'Cannot follow yourself', 400);
    }
    const [target] = await this.db.select().from(users).where(eq(users.id, followeeId)).limit(1);
    if (!target || target.accountStatus !== 'active') {
      throw new ApiException('NOT_FOUND', 'User not found', 404);
    }
    if (await this.rel.isBlockedEitherWay(followerId, followeeId)) {
      throw new ApiException('NOT_FOUND', 'User not found', 404);
    }
    const status = target.isPrivate ? 'pending' : 'accepted';
    await this.db.insert(follows).values({ followerId, followeeId, status }).onConflictDoNothing();
    return { status };
  }

  async unfollow(followerId: string, followeeId: string): Promise<void> {
    await this.db
      .delete(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followeeId, followeeId)));
  }

  async followRequests(userId: string, cursor?: string, limitRaw?: string) {
    const limit = parseLimit(limitRaw);
    const c = decodeCursor(cursor);
    const rows = await this.db
      .select({ user: users, createdAt: follows.createdAt, followerId: follows.followerId })
      .from(follows)
      .innerJoin(users, eq(users.id, follows.followerId))
      .where(
        and(
          eq(follows.followeeId, userId),
          eq(follows.status, 'pending'),
          c ? lt(follows.createdAt, c.createdAt) : undefined,
        ),
      )
      .orderBy(desc(follows.createdAt))
      .limit(limit + 1);
    const mapped = rows.map((r) => ({
      id: `${r.followerId}:${userId}`,
      createdAt: r.createdAt,
      user: toUserLite(r.user),
    }));
    const page = buildPage(mapped, limit, (r) =>
      encodeCursor({ createdAt: r.createdAt, id: r.id }),
    );
    return {
      items: page.items.map((p) => ({
        id: p.id,
        user: p.user,
        createdAt: p.createdAt.toISOString(),
      })),
      nextCursor: page.nextCursor,
    };
  }

  async respondToRequest(userId: string, requestId: string, accept: boolean): Promise<void> {
    const [followerId, followeeId] = requestId.split(':');
    if (!followerId || followeeId !== userId) {
      throw new ApiException('FORBIDDEN', 'Not your request', 403);
    }
    const where = and(
      eq(follows.followerId, followerId),
      eq(follows.followeeId, userId),
      eq(follows.status, 'pending'),
    );
    if (accept) {
      await this.db.update(follows).set({ status: 'accepted' }).where(where);
    } else {
      await this.db.delete(follows).where(where);
    }
  }

  async listFollowers(targetId: string, cursor?: string, limitRaw?: string) {
    return this.graphList(follows.followeeId, follows.followerId, targetId, cursor, limitRaw);
  }

  async listFollowing(targetId: string, cursor?: string, limitRaw?: string) {
    return this.graphList(follows.followerId, follows.followeeId, targetId, cursor, limitRaw);
  }

  // ponytail: simple createdAt keyset; ties on identical timestamps could skip a
  // row across pages. Fine at v1 scale; add (createdAt,id) composite if it bites.
  private async graphList(
    matchCol: Column,
    pickCol: Column,
    targetId: string,
    cursor?: string,
    limitRaw?: string,
  ) {
    const limit = parseLimit(limitRaw);
    const c = decodeCursor(cursor);
    const rows = await this.db
      .select({ user: users, createdAt: follows.createdAt })
      .from(follows)
      .innerJoin(users, eq(users.id, pickCol))
      .where(
        and(
          eq(matchCol, targetId),
          eq(follows.status, 'accepted'),
          c ? lt(follows.createdAt, c.createdAt) : undefined,
        ),
      )
      .orderBy(desc(follows.createdAt))
      .limit(limit + 1);
    const mapped = rows.map((r) => ({ ...toUserLite(r.user), createdAt: r.createdAt }));
    const page = buildPage(mapped, limit, (r) =>
      encodeCursor({ createdAt: r.createdAt, id: r.id }),
    );
    return {
      items: page.items.map(({ createdAt: _c, ...lite }) => lite),
      nextCursor: page.nextCursor,
    };
  }

  async block(blockerId: string, blockedId: string): Promise<void> {
    if (blockerId === blockedId) {
      throw new ApiException('VALIDATION', 'Cannot block yourself', 400);
    }
    await this.db.insert(blocks).values({ blockerId, blockedId }).onConflictDoNothing();
    // Blocking severs the follow relationship both ways (accepted and pending).
    await this.db
      .delete(follows)
      .where(
        or(
          and(eq(follows.followerId, blockerId), eq(follows.followeeId, blockedId)),
          and(eq(follows.followerId, blockedId), eq(follows.followeeId, blockerId)),
        ),
      );
  }

  async unblock(blockerId: string, blockedId: string): Promise<void> {
    await this.db
      .delete(blocks)
      .where(and(eq(blocks.blockerId, blockerId), eq(blocks.blockedId, blockedId)));
  }

  async listBlocked(userId: string, cursor?: string, limitRaw?: string) {
    const limit = parseLimit(limitRaw);
    const c = decodeCursor(cursor);
    const rows = await this.db
      .select({ user: users, createdAt: blocks.createdAt })
      .from(blocks)
      .innerJoin(users, eq(users.id, blocks.blockedId))
      .where(and(eq(blocks.blockerId, userId), c ? lt(blocks.createdAt, c.createdAt) : undefined))
      .orderBy(desc(blocks.createdAt))
      .limit(limit + 1);
    const mapped = rows.map((r) => ({ ...toUserLite(r.user), createdAt: r.createdAt }));
    const page = buildPage(mapped, limit, (r) =>
      encodeCursor({ createdAt: r.createdAt, id: r.id }),
    );
    return {
      items: page.items.map(({ createdAt: _c, ...lite }) => lite),
      nextCursor: page.nextCursor,
    };
  }

  async mute(muterId: string, mutedId: string): Promise<void> {
    if (muterId === mutedId) {
      throw new ApiException('VALIDATION', 'Cannot mute yourself', 400);
    }
    await this.db.insert(mutes).values({ muterId, mutedId }).onConflictDoNothing();
  }

  async unmute(muterId: string, mutedId: string): Promise<void> {
    await this.db.delete(mutes).where(and(eq(mutes.muterId, muterId), eq(mutes.mutedId, mutedId)));
  }
}
