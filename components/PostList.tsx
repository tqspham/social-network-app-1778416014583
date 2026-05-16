"use client";

import { useUserPosts } from '@/app/hooks/useUserPosts';
import PostCard from './PostCard';

interface PostListProps {
  userId: string;
}

export default function PostList({ userId }: PostListProps) {
  const { posts, loading, error, refresh } = useUserPosts(userId);

  if (loading) {
    return <div className="text-center py-8 text-muted">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-danger font-medium">{error}</div>;
  }

  if (posts.length === 0) {
    return <div className="text-muted text-center py-12">No posts yet</div>;
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard
          key={post.postId}
          post={post}
          onDelete={() => refresh()}
          onLikeToggle={() => {}}
        />
      ))}
    </div>
  );
}
