"use client";

import { useUserPosts } from '@/app/hooks/useUserPosts';
import PostCard from './PostCard';

interface PostListProps {
  userId: string;
}

export default function PostList({ userId }: PostListProps) {
  const { posts, loading, error, refresh } = useUserPosts(userId);

  if (loading) {
    return <div className="text-center py-8">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  if (posts.length === 0) {
    return <div className="text-gray-600 text-center py-8">No posts yet</div>;
  }

  return (
    <div className="space-y-4">
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
