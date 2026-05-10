"use client";

import { useState, useEffect } from 'react';
import PostCard from './PostCard';

interface Author {
  user_id: string;
  username: string;
  profile_picture: string | null;
}

interface Post {
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
  likeCount: number;
  author: Author;
}

interface PostListProps {
  userId: string;
}

export default function PostList({ userId }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error fetching posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  if (loading) {
    return <div className="text-center py-8">Loading posts...</div>;
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
          onDelete={fetchPosts}
          onLikeToggle={() => {}}
        />
      ))}
    </div>
  );
}
