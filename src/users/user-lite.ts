import type { users } from '../db/schema';

export interface UserLite {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  isVerified: boolean;
  badge: 'blue' | 'gold' | 'grey' | null;
}

export function toUserLite(u: typeof users.$inferSelect): UserLite {
  return {
    id: u.id,
    username: u.username,
    displayName: u.displayName,
    avatarUrl: u.avatarUrl,
    isVerified: false,
    badge: null,
  };
}
