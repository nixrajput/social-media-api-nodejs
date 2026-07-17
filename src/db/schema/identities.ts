import { pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';
import { users } from './users';

// Federated login links. One row per (provider, account) pointing at a user.
// A user may have several (google now; apple/meta/github later) and may also
// keep a password. passwordHash on users is nullable for OAuth-only accounts.
export const identities = pgTable(
  'identities',
  {
    id: uuid('id')
      .primaryKey()
      .$defaultFn(() => uuidv7()),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    provider: text('provider').notNull(),
    providerAccountId: text('provider_account_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex('identities_provider_account_unique').on(t.provider, t.providerAccountId)],
);
