import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../../src/db/schema';

export type TestDb = NodePgDatabase<typeof schema>;

export function testDb(): { db: TestDb; close: () => Promise<void> } {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 2 });
  return { db: drizzle(pool, { schema }), close: () => pool.end() };
}
