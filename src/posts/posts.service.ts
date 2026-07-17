import { Inject, Injectable } from '@nestjs/common';
import { and, count, eq, inArray } from 'drizzle-orm';
import { ApiException } from '../common/exception.filter';
import { DB, type Db } from '../db/db.module';
import { bookmarks, comments, postLikes, postMedia, posts, users } from '../db/schema';
import { MediaService } from '../media/media.service';
import { ListsService } from '../users/lists.service';
import { RelationshipService } from '../users/relationship.service';
import { toUserLite } from '../users/user-lite';
import { canViewPost } from './audience';
import type { CreatePostDto } from './dto';

// Free tier now; plan 7 makes this entitlement-aware (24 h for paid).
const EDIT_WINDOW_MS = 15 * 60 * 1000;

type PostRow = typeof posts.$inferSelect;

@Injectable()
export class PostsService {
  constructor(
    @Inject(DB) private readonly db: Db,
    private readonly media: MediaService,
    private readonly rel: RelationshipService,
    private readonly lists: ListsService,
  ) {}

  async create(authorId: string, dto: CreatePostDto) {
    const attached = [];
    for (const m of dto.media) {
      const up = await this.media.assertReady(m.uploadId, authorId, ['post-image', 'post-video']);
      attached.push({ up, m });
    }
    if (dto.audience === 'list') {
      if (!dto.listId || (await this.lists.ownerOf(dto.listId)) !== authorId) {
        throw new ApiException('VALIDATION', 'Invalid list', 400);
      }
    }
    const [post] = await this.db
      .insert(posts)
      .values({
        authorId,
        caption: dto.caption ?? null,
        audience: dto.audience,
        listId: dto.audience === 'list' ? dto.listId : null,
        aiLabel: dto.aiLabel ?? false,
      })
      .returning();
    await this.db.insert(postMedia).values(
      attached.map(({ up, m }, i) => ({
        postId: post!.id,
        key: up.key,
        type: m.type,
        width: m.width,
        height: m.height,
        position: i,
      })),
    );
    return (await this.hydrate([post!], authorId))[0];
  }

  async get(viewerId: string, id: string) {
    const post = await this.load(id);
    await this.assertViewable(viewerId, post);
    return (await this.hydrate([post], viewerId))[0];
  }

  async edit(authorId: string, id: string, caption: string) {
    const post = await this.assertOwner(authorId, id);
    if (Date.now() - post.createdAt.getTime() > EDIT_WINDOW_MS) {
      throw new ApiException('VALIDATION', 'Edit window closed', 400);
    }
    const [updated] = await this.db
      .update(posts)
      .set({ caption, editedAt: new Date() })
      .where(eq(posts.id, id))
      .returning();
    return (await this.hydrate([updated!], authorId))[0];
  }

  async delete(authorId: string, id: string): Promise<void> {
    await this.assertOwner(authorId, id);
    await this.db.update(posts).set({ status: 'removed' }).where(eq(posts.id, id));
  }

  async setArchived(authorId: string, id: string, archived: boolean): Promise<void> {
    await this.assertOwner(authorId, id);
    await this.db
      .update(posts)
      .set({ status: archived ? 'archived' : 'active' })
      .where(eq(posts.id, id));
  }

  private async load(id: string): Promise<PostRow> {
    const [post] = await this.db.select().from(posts).where(eq(posts.id, id)).limit(1);
    if (!post) throw new ApiException('NOT_FOUND', 'Post not found', 404);
    return post;
  }

  private async assertOwner(authorId: string, id: string): Promise<PostRow> {
    const post = await this.load(id);
    if (post.authorId !== authorId) throw new ApiException('NOT_FOUND', 'Post not found', 404);
    return post;
  }

  private async assertViewable(viewerId: string, post: PostRow): Promise<void> {
    const rel =
      post.authorId === viewerId
        ? { following: false, blockedEitherWay: false }
        : {
            following: (await this.rel.between(viewerId, post.authorId)).following,
            blockedEitherWay: await this.rel.isBlockedEitherWay(viewerId, post.authorId),
          };
    const isListMember = post.listId ? await this.lists.isMember(post.listId, viewerId) : false;
    if (!canViewPost(viewerId, post, rel, isListMember)) {
      throw new ApiException('NOT_FOUND', 'Post not found', 404);
    }
  }

  // Shapes rows into contract `post` objects. Visibility is enforced by callers
  // (get/feed) via canViewPost before hydration; this only assembles data.
  async hydrate(rows: PostRow[], viewerId: string) {
    if (rows.length === 0) return [];
    const authorIds = [...new Set(rows.map((r) => r.authorId))];
    const postIds = rows.map((r) => r.id);

    const [authorRows, mediaRows, likeCounts, commentCounts, myLikes, myBookmarks] =
      await Promise.all([
        this.db.select().from(users).where(inArray(users.id, authorIds)),
        this.db.select().from(postMedia).where(inArray(postMedia.postId, postIds)),
        this.db
          .select({ postId: postLikes.postId, c: count() })
          .from(postLikes)
          .where(inArray(postLikes.postId, postIds))
          .groupBy(postLikes.postId),
        this.db
          .select({ postId: comments.postId, c: count() })
          .from(comments)
          .where(and(inArray(comments.postId, postIds), eq(comments.status, 'active')))
          .groupBy(comments.postId),
        this.db
          .select({ postId: postLikes.postId })
          .from(postLikes)
          .where(and(inArray(postLikes.postId, postIds), eq(postLikes.userId, viewerId))),
        this.db
          .select({ postId: bookmarks.postId })
          .from(bookmarks)
          .where(and(inArray(bookmarks.postId, postIds), eq(bookmarks.userId, viewerId))),
      ]);

    const authorById = new Map(authorRows.map((u) => [u.id, u]));
    const mediaByPost = new Map<string, typeof mediaRows>();
    for (const m of mediaRows) {
      const arr = mediaByPost.get(m.postId) ?? [];
      arr.push(m);
      mediaByPost.set(m.postId, arr);
    }
    const likeCountBy = new Map(likeCounts.map((r) => [r.postId, r.c]));
    const commentCountBy = new Map(commentCounts.map((r) => [r.postId, r.c]));
    const likedSet = new Set(myLikes.map((r) => r.postId));
    const bookmarkedSet = new Set(myBookmarks.map((r) => r.postId));

    return rows.map((post) => {
      const author = authorById.get(post.authorId)!;
      const media = (mediaByPost.get(post.id) ?? [])
        .sort((a, b) => a.position - b.position)
        .map((m) => ({
          url: this.media.publicUrl(m.key),
          thumbUrl: this.media.publicUrl(`${m.key}_thumb.webp`),
          type: m.type,
          width: m.width,
          height: m.height,
        }));
      return {
        id: post.id,
        author: toUserLite(author),
        caption: post.caption,
        media,
        audience: post.audience,
        aiLabel: post.aiLabel,
        likeCount: likeCountBy.get(post.id) ?? 0,
        commentCount: commentCountBy.get(post.id) ?? 0,
        likedByMe: likedSet.has(post.id),
        bookmarkedByMe: bookmarkedSet.has(post.id),
        editedAt: post.editedAt ? post.editedAt.toISOString() : null,
        createdAt: post.createdAt.toISOString(),
      };
    });
  }
}
