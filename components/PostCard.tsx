"use client";

import { useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
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

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return date.toLocaleDateString();
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-surface border-card rounded-lg p-6 mb-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="font-bold text-primary hover:text-accent transition text-lg">
            {post.author.username}
          </p>
          <p className="text-meta text-muted text-xs mt-1">{formatTimeAgo(post.createdAt)}</p>
        </div>
        {currentUserId === post.authorId && (
          <button
            onClick={handleDelete}
            className="text-danger hover:bg-red-50 p-2 rounded transition"
            title="Delete post"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <p className="text-body text-text mb-6 leading-relaxed">{post.content}</p>

      <div className="flex items-center gap-6 pt-4 border-t border-card">
        <motion.button
          onClick={handleLikeToggle}
          disabled={loading}
          whileTap={liked ? { scale: 0.95 } : { scale: 1.05 }}
          className={`flex items-center gap-2 transition ${
            liked ? 'text-danger' : 'text-muted hover:text-danger'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          <span className="text-sm">{likeCount}</span>
        </motion.button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="text-muted hover:text-primary text-sm transition font-medium"
        >
          Comments
        </button>
      </div>

      {showComments && (
        <div className="mt-6 pt-6 border-t border-card">
          <CommentSection postId={post.postId} onCommentAdded={() => {}} />
        </div>
      )}
    </motion.div>
  );
}
