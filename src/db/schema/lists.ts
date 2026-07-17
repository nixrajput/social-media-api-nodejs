import { pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';
import { users } from './users';

export const closeFriendLists = pgTable('close_friend_lists', {
  id: uuid('id')
    .primaryKey()
    .$defaultFn(() => uuidv7()),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const closeFriendListMembers = pgTable(
  'close_friend_list_members',
  {
    listId: uuid('list_id')
      .notNull()
      .references(() => closeFriendLists.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.listId, t.userId] })],
);
