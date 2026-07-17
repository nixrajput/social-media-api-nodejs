import { describe, expect, it } from 'vitest';
import { filterProfileForViewer, type Relationship } from './visibility';

const base = {
  displayName: 'A',
  bio: 'hi',
  avatarUrl: null,
  dob: '1990-01-01',
  gender: 'f',
  profession: 'eng',
  website: 'x.com',
  email: 'a@b.c',
};
const none: Relationship = {
  following: false,
  followedBy: false,
  followRequested: false,
  blocked: false,
  muted: false,
};

describe('filterProfileForViewer', () => {
  it('shows public fields to a stranger and hides followers/private ones', () => {
    const out = filterProfileForViewer(
      base,
      [
        { field: 'profession', level: 'public' },
        { field: 'dob', level: 'followers' },
        { field: 'email', level: 'private' },
      ],
      none,
      false,
    );
    expect(out.profession).toBe('eng');
    expect(out.dob).toBeUndefined();
    expect(out.email).toBeUndefined();
    expect(out.displayName).toBe('A');
  });

  it('shows followers-level fields to a follower', () => {
    const out = filterProfileForViewer(
      base,
      [{ field: 'dob', level: 'followers' }],
      { ...none, following: true },
      false,
    );
    expect(out.dob).toBe('1990-01-01');
  });

  it('shows everything to self regardless of levels', () => {
    const out = filterProfileForViewer(base, [{ field: 'email', level: 'private' }], none, true);
    expect(out.email).toBe('a@b.c');
  });

  it('defaults an unset field to public', () => {
    const out = filterProfileForViewer(base, [], none, false);
    expect(out.profession).toBe('eng');
  });
});
