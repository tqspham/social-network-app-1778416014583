"use client";

import { useState, useEffect } from 'react';
import CreatePostForm from './CreatePostForm';
import PostCard from './PostCard';

interface Post {
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
  likeCount: number;
  author: {
    user_id: string;
    username: string;
    profile_picture: string | null;
  };
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts/feed');
      if (!response.ok) throw new Error('Failed to fetch feed');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (err) {
      setError('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handlePostCreated = () => {
    fetchFeed();
  };

  const handlePostDeleted = () => {
    fetchFeed();
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
