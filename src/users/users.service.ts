import { Inject, Injectable } from '@nestjs/common';
import { and, eq, ilike, ne, notInArray, or } from 'drizzle-orm';
import { toSelfUser } from '../auth/auth.service';
import { ApiException } from '../common/exception.filter';
import { DB, type Db } from '../db/db.module';
import { blocks, fieldVisibility, profiles, users } from '../db/schema';
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
}
