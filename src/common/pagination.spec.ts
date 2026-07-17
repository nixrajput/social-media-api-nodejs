import { describe, expect, it } from 'vitest';
import { buildPage, decodeCursor, encodeCursor, parseLimit } from './pagination';

describe('pagination', () => {
  it('round-trips a cursor', () => {
    const now = new Date('2026-01-01T00:00:00.000Z');
    const c = encodeCursor({ createdAt: now, id: 'abc' });
    const d = decodeCursor(c);
    expect(d?.id).toBe('abc');
    expect(d?.createdAt.toISOString()).toBe(now.toISOString());
  });

  it('clamps the limit to max and applies fallback', () => {
    expect(parseLimit('999', 50, 20)).toBe(50);
    expect(parseLimit(undefined, 50, 20)).toBe(20);
    expect(parseLimit('5', 50, 20)).toBe(5);
  });

  it('sets nextCursor only when an extra row was peeked', () => {
    const rows = [
      { id: '1', createdAt: new Date(1) },
      { id: '2', createdAt: new Date(2) },
      { id: '3', createdAt: new Date(3) },
    ];
    const page = buildPage(rows, 2, (r) => encodeCursor(r));
    expect(page.items).toHaveLength(2);
    expect(page.nextCursor).not.toBeNull();

    const short = buildPage(rows.slice(0, 1), 2, (r) => encodeCursor(r));
    expect(short.nextCursor).toBeNull();
  });
});
