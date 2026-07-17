export interface Page<T> {
  items: T[];
  nextCursor: string | null;
}

export function encodeCursor(row: { createdAt: Date; id: string }): string {
  return Buffer.from(`${row.createdAt.toISOString()}|${row.id}`).toString('base64url');
}

export function decodeCursor(cursor?: string): { createdAt: Date; id: string } | null {
  if (!cursor) return null;
  try {
    const [iso, id] = Buffer.from(cursor, 'base64url').toString('utf8').split('|');
    if (!iso || !id) return null;
    return { createdAt: new Date(iso), id };
  } catch {
    return null;
  }
}

export function parseLimit(raw?: string, max = 50, fallback = 20): number {
  const n = raw ? Number.parseInt(raw, 10) : fallback;
  if (Number.isNaN(n) || n <= 0) return fallback;
  return Math.min(n, max);
}

// Query `limit + 1` rows, pass them here: the extra row signals more pages.
export function buildPage<T extends { id: string; createdAt: Date }>(
  rows: T[],
  limit: number,
  toCursor: (row: T) => string,
): Page<T> {
  const items = rows.slice(0, limit);
  const hasMore = rows.length > limit;
  const last = items[items.length - 1];
  return { items, nextCursor: hasMore && last ? toCursor(last) : null };
}
