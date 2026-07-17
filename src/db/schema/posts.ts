import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';
import { users } from './users';

export const postAudienceEnum = pgEnum('post_audience', ['public', 'followers', 'list']);
export const postStatusEnum = pgEnum('post_status', ['active', 'archived', 'removed']);
export const mediaTypeEnum = pgEnum('media_type', ['image', 'video']);

export const posts = pgTable('posts', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  authorId: uuid('author_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  caption: text('caption'),
  audience: postAudienceEnum('audience').notNull().default('public'),
  listId: uuid('list_id'),
  aiLabel: boolean('ai_label').notNull().default(false),
  editedAt: timestamp('edited_at', { withTimezone: true }),
  status: postStatusEnum('status').notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const postMedia = pgTable('post_media', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  postId: uuid('post_id')
    .notNull()
    .references(() => posts.id, { onDelete: 'cascade' }),
  key: text('key').notNull(),
  type: mediaTypeEnum('type').notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  position: integer('position').notNull().default(0),
});
