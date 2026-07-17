import { VISIBLE_FIELDS } from '../db/schema';

export interface Relationship {
  following: boolean;
  followedBy: boolean;
  followRequested: boolean;
  blocked: boolean;
  muted: boolean;
}

export interface RawProfile {
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  dob: string | null;
  gender: string | null;
  profession: string | null;
  website: string | null;
  email: string;
}

export interface PublicProfile {
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  dob?: string;
  gender?: string;
  profession?: string;
  website?: string;
  email?: string;
}

type Level = 'public' | 'followers' | 'private';

function allowed(level: Level, rel: Relationship): boolean {
  if (level === 'public') return true;
  if (level === 'followers') return rel.following;
  return false; // private: only self, handled by isSelf
}

export function filterProfileForViewer(
  profile: RawProfile,
  visibilityRows: { field: string; level: Level }[],
  relationship: Relationship,
  isSelf: boolean,
): PublicProfile {
  const levels = new Map<string, Level>(visibilityRows.map((r) => [r.field, r.level]));
  const out: PublicProfile = {
    displayName: profile.displayName,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
  };
  for (const field of VISIBLE_FIELDS) {
    const level = levels.get(field) ?? 'public';
    if (isSelf || allowed(level, relationship)) {
      const value = profile[field];
      if (value != null) out[field] = value;
    }
  }
  return out;
}
