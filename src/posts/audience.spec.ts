import { describe, expect, it } from 'vitest';
import { canViewPost } from './audience';

const base = { authorId: 'author', audience: 'public' as const, status: 'active' as const };
const rel = (following: boolean, blocked = false) => ({ following, blockedEitherWay: blocked });

describe('canViewPost', () => {
  it('author sees own non-removed post', () => {
    expect(canViewPost('author', { ...base, status: 'archived' }, rel(false), false)).toBe(true);
  });
  it('public post visible to a stranger', () => {
    expect(canViewPost('v', base, rel(false), false)).toBe(true);
  });
  it('followers post hidden from non-follower, shown to follower', () => {
    expect(canViewPost('v', { ...base, audience: 'followers' }, rel(false), false)).toBe(false);
    expect(canViewPost('v', { ...base, audience: 'followers' }, rel(true), false)).toBe(true);
  });
  it('list post only visible to a list member', () => {
    expect(canViewPost('v', { ...base, audience: 'list' }, rel(true), false)).toBe(false);
    expect(canViewPost('v', { ...base, audience: 'list' }, rel(true), true)).toBe(true);
  });
  it('blocked either way never sees the post', () => {
    expect(canViewPost('v', base, rel(true, true), true)).toBe(false);
  });
});
