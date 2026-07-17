import { Inject, Injectable } from '@nestjs/common';
import { and, eq, or } from 'drizzle-orm';
import { DB, type Db } from '../db/db.module';
import { blocks, follows, mutes } from '../db/schema';
import type { Relationship } from './visibility';

@Injectable()
export class RelationshipService {
  constructor(@Inject(DB) private readonly db: Db) {}

  async between(viewerId: string, targetId: string): Promise<Relationship> {
    if (viewerId === targetId) {
      return {
        following: false,
        followedBy: false,
        followRequested: false,
        blocked: false,
        muted: false,
      };
    }
    const [outgoing, incoming, block, mute] = await Promise.all([
      this.db
        .select()
        .from(follows)
        .where(and(eq(follows.followerId, viewerId), eq(follows.followeeId, targetId)))
        .limit(1),
      this.db
        .select()
        .from(follows)
        .where(and(eq(follows.followerId, targetId), eq(follows.followeeId, viewerId)))
        .limit(1),
      this.db
        .select()
        .from(blocks)
        .where(and(eq(blocks.blockerId, viewerId), eq(blocks.blockedId, targetId)))
        .limit(1),
      this.db
        .select()
        .from(mutes)
        .where(and(eq(mutes.muterId, viewerId), eq(mutes.mutedId, targetId)))
        .limit(1),
    ]);
    const out = outgoing[0];
    const inc = incoming[0];
    return {
      following: out?.status === 'accepted',
      followRequested: out?.status === 'pending',
      followedBy: inc?.status === 'accepted',
      blocked: block.length > 0,
      muted: mute.length > 0,
    };
  }

  async isBlockedEitherWay(a: string, b: string): Promise<boolean> {
    const rows = await this.db
      .select()
      .from(blocks)
      .where(
        or(
          and(eq(blocks.blockerId, a), eq(blocks.blockedId, b)),
          and(eq(blocks.blockerId, b), eq(blocks.blockedId, a)),
        ),
      )
      .limit(1);
    return rows.length > 0;
  }
}
