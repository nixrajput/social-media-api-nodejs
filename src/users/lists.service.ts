import { Inject, Injectable } from '@nestjs/common';
import { and, eq, sql } from 'drizzle-orm';
import { ApiException } from '../common/exception.filter';
import { DB, type Db } from '../db/db.module';
import { closeFriendListMembers, closeFriendLists } from '../db/schema';

@Injectable()
export class ListsService {
  constructor(@Inject(DB) private readonly db: Db) {}

  async list(ownerId: string) {
    const rows = await this.db
      .select({
        id: closeFriendLists.id,
        name: closeFriendLists.name,
        memberCount: sql<number>`count(${closeFriendListMembers.userId})::int`,
      })
      .from(closeFriendLists)
      .leftJoin(closeFriendListMembers, eq(closeFriendListMembers.listId, closeFriendLists.id))
      .where(eq(closeFriendLists.ownerId, ownerId))
      .groupBy(closeFriendLists.id);
    return { items: rows };
  }

  async create(ownerId: string, name: string) {
    const [row] = await this.db.insert(closeFriendLists).values({ ownerId, name }).returning();
    return { id: row!.id, name: row!.name };
  }

  private async assertOwner(ownerId: string, listId: string): Promise<void> {
    const [row] = await this.db
      .select()
      .from(closeFriendLists)
      .where(eq(closeFriendLists.id, listId))
      .limit(1);
    if (!row || row.ownerId !== ownerId) throw new ApiException('NOT_FOUND', 'List not found', 404);
  }

  async rename(ownerId: string, listId: string, name: string) {
    await this.assertOwner(ownerId, listId);
    await this.db.update(closeFriendLists).set({ name }).where(eq(closeFriendLists.id, listId));
    return { id: listId, name };
  }

  async remove(ownerId: string, listId: string): Promise<void> {
    await this.assertOwner(ownerId, listId);
    await this.db.delete(closeFriendLists).where(eq(closeFriendLists.id, listId));
  }

  async addMember(ownerId: string, listId: string, userId: string): Promise<void> {
    await this.assertOwner(ownerId, listId);
    await this.db.insert(closeFriendListMembers).values({ listId, userId }).onConflictDoNothing();
  }

  async removeMember(ownerId: string, listId: string, userId: string): Promise<void> {
    await this.assertOwner(ownerId, listId);
    await this.db
      .delete(closeFriendListMembers)
      .where(
        and(eq(closeFriendListMembers.listId, listId), eq(closeFriendListMembers.userId, userId)),
      );
  }

  async isMember(listId: string, userId: string): Promise<boolean> {
    const rows = await this.db
      .select()
      .from(closeFriendListMembers)
      .where(
        and(eq(closeFriendListMembers.listId, listId), eq(closeFriendListMembers.userId, userId)),
      )
      .limit(1);
    return rows.length > 0;
  }

  async ownerOf(listId: string): Promise<string | null> {
    const [row] = await this.db
      .select()
      .from(closeFriendLists)
      .where(eq(closeFriendLists.id, listId))
      .limit(1);
    return row?.ownerId ?? null;
  }
}
