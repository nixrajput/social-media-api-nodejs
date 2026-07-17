import { integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';
import { users } from './users';

export const uploadKindEnum = pgEnum('upload_kind', [
  'post-image',
  'post-video',
  'avatar',
  'chat-blob',
]);
export const uploadStatusEnum = pgEnum('upload_status', ['pending', 'ready']);

export const uploads = pgTable('uploads', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  kind: uploadKindEnum('kind').notNull(),
  key: text('key').notNull(),
  sha256: text('sha256').notNull(),
  contentLength: integer('content_length').notNull(),
  status: uploadStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
