import { customType } from 'drizzle-orm/pg-core';

// Requires the citext extension (created in drizzle/0000_extensions.sql).
export const citext = customType<{ data: string }>({ dataType: () => 'citext' });
