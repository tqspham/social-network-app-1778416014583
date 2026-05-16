"use client";

import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

interface Author {
  user_id: string;
  username: string;
  profile_picture: string | null;
}

interface Comment {
  commentId: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
  author: Author;
}

interface CommentSectionProps {
  postId: string;
  onCommentAdded: () => void;
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
  return date.toLocaleDateString();
}

export default function CommentSection({ postId, onCommentAdded }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/comments/post/${postId}`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      const data = await response.json();
      setComments(data.comments || []);
    } catch (error) {
      console.error('Error fetching comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/comments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, content: commentText }),
      });
      if (!response.ok) throw new Error('Failed to create comment');
      setCommentText('');
      fetchComments();
      onCommentAdded();
    } catch (error) {
      console.error('Error creating comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;
    try {
      const response = await fetch(`/api/comments/${commentId}/delete`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete comment');
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border-card rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-page"
          />
          <button
            type="submit"
            disabled={submitting || !commentText.trim()}
            className="btn-secondary text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Post
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-sm text-muted">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-sm text-muted">No comments yet</div>
      ) : (
        <ul className="space-y-3">
          {comments.map((comment) => (
            <li key={comment.commentId} className="bg-page p-3 rounded border-card text-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-primary text-sm">{comment.author.username}</span>
                {currentUserId === comment.authorId && (
                  <button
                    onClick={() => handleDeleteComment(comment.commentId)}
                    className="text-danger hover:bg-red-50 p-1 rounded transition"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <p className="text-text mb-2">{comment.content}</p>
              <p className="text-meta text-muted text-xs">{formatTimeAgo(comment.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
