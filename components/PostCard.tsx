"use client";

import { useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { getSessionUserId } from '@/app/lib/auth';
import CommentSection from './CommentSection';

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

interface PostCardProps {
  post: Post;
  onDelete: () => void;
  onLikeToggle: () => void;
}

export default function PostCard({ post, onDelete, onLikeToggle }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showComments, setShowComments] = useState(false);

  const handleLikeToggle = async () => {
    setLoading(true);
    try {
      const method = liked ? 'DELETE' : 'POST';
      const response = await fetch(`/api/posts/${post.postId}/like`, { method });
      if (!response.ok) throw new Error('Failed to toggle like');
      const data = await response.json();
      setLiked(data.liked);
      setLikeCount(data.likeCount);
      onLikeToggle();
    } catch (error) {
      console.error('Error toggling like');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      const response = await fetch(`/api/posts/${post.postId}/delete`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete post');
      onDelete();
    } catch (error) {
      console.error('Error deleting post');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-blue-600">{post.author.username}</p>
          <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
        </div>
        {currentUserId === post.authorId && (
          <button
            onClick={handleDelete}
            className="text-red-600 hover:bg-red-50 p-2 rounded transition"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <p className="text-gray-800 mb-4">{post.content}</p>

      <div className="flex items-center gap-4 pt-3 border-t border-gray-200">
        <button
          onClick={handleLikeToggle}
          disabled={loading}
          className={`flex items-center gap-1 transition ${
            liked ? 'text-red-600' : 'text-gray-600 hover:text-red-600'
          }`}
        >
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          <span className="text-sm">{likeCount}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="text-gray-600 hover:text-blue-600 text-sm transition"
        >
          Comments
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <CommentSection postId={post.postId} onCommentAdded={() => {}} />
        </div>
      )}
    </div>
  );
}
