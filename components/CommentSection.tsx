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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
            type="submit"
            disabled={submitting || !commentText.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            Post
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-sm text-gray-600">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-sm text-gray-600">No comments yet</div>
      ) : (
        <ul className="space-y-2">
          {comments.map((comment) => (
            <li key={comment.commentId} className="bg-gray-50 p-3 rounded text-sm">
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-blue-600">{comment.author.username}</span>
                {currentUserId === comment.authorId && (
                  <button
                    onClick={() => handleDeleteComment(comment.commentId)}
                    className="text-red-600 hover:bg-red-100 p-1 rounded transition"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <p className="text-gray-800 mb-1">{comment.content}</p>
              <p className="text-xs text-gray-500">{formatDate(comment.createdAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
