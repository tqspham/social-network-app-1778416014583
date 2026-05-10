import { useState, useEffect } from 'react';

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

interface UseFeedPostsReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useFeedPosts(): UseFeedPostsReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldPoll, setShouldPoll] = useState(false);

  const fetchFeed = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts/feed');
      if (!response.ok) throw new Error('Failed to fetch feed');
      const data = await response.json();
      setPosts(data.posts || []);
      setError(null);
    } catch (err) {
      setError('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  useEffect(() => {
    if (!shouldPoll) return;

    const timer = setTimeout(() => {
      fetchFeed();
      setShouldPoll(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [shouldPoll]);

  const refresh = () => {
    setShouldPoll(true);
  };

  return { posts, loading, error, refresh };
}
