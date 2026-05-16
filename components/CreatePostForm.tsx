"use client";

import { useState } from 'react';
import { Send } from 'lucide-react';

interface CreatePostFormProps {
  onPostCreated: () => void;
}

export default function CreatePostForm({ onPostCreated }: CreatePostFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error('Failed to create post');
      
      setContent('');
      setSuccess(true);
      onPostCreated();
      
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface border-card rounded-lg p-6 mb-8">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your thoughts..."
        rows={4}
        className="w-full px-4 py-3 border-card rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none bg-page"
      />
      {error && <div className="mt-3 text-danger text-sm font-medium">{error}</div>}
      {success && <div className="mt-3 text-success text-sm font-medium">Post created!</div>}
      <div className="mt-4 flex justify-end">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="flex items-center gap-2 btn-secondary disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <Send size={16} />
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
}
