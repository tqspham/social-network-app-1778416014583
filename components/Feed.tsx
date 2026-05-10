"use client";

import { useFeedPosts } from '@/app/hooks/useFeedPosts';
import CreatePostForm from './CreatePostForm';
import PostCard from './PostCard';

export default function Feed() {
  const { posts, loading, error, refresh } = useFeedPosts();

  const handlePostCreated = () => {
    refresh();
  };

  const handlePostDeleted = () => {
    refresh();
  };

  if (loading) {
    return <div className="text-center py-8">Loading feed...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <CreatePostForm onPostCreated={handlePostCreated} />
      <div className="mt-8">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <p className="text-gray-600 text-lg">No posts yet. Connect with others to see their posts!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.postId}
                post={post}
                onDelete={handlePostDeleted}
                onLikeToggle={() => {}}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
