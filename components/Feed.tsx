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
    return <div className="text-center py-12 text-muted">Loading feed...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-danger font-medium">{error}</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <CreatePostForm onPostCreated={handlePostCreated} />
      <div className="mt-8">
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-lg border-card">
            <p className="text-muted text-lg">No posts yet. Connect with others to see their posts!</p>
          </div>
        ) : (
          <div className="space-y-6">
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
