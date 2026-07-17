import { pgEnum, pgTable, text, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

export const visibilityLevelEnum = pgEnum('visibility_level', ['public', 'followers', 'private']);
export const VISIBLE_FIELDS = ['dob', 'gender', 'profession', 'website', 'email'] as const;
export type VisibleField = (typeof VISIBLE_FIELDS)[number];

export const fieldVisibility = pgTable(
  'field_visibility',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    field: text('field').notNull(),
    level: visibilityLevelEnum('level').notNull(),
  },
  (t) => [uniqueIndex('field_visibility_user_field_unique').on(t.userId, t.field)],
);
