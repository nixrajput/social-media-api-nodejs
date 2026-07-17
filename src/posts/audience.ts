export interface AudienceCheckInput {
  authorId: string;
  audience: 'public' | 'followers' | 'list';
  status: 'active' | 'archived' | 'removed';
}

// Single source of truth for post visibility. Every read path calls this.
export function canViewPost(
  viewerId: string,
  post: AudienceCheckInput,
  rel: { following: boolean; blockedEitherWay: boolean },
  isListMember: boolean,
): boolean {
  if (post.authorId === viewerId) return post.status !== 'removed';
  if (post.status !== 'active') return false;
  if (rel.blockedEitherWay) return false;
  switch (post.audience) {
    case 'public':
      return true;
    case 'followers':
      return rel.following;
    case 'list':
      return isListMember;
    default:
      return false;
  }
}
