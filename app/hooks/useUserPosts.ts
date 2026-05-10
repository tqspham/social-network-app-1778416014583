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

interface UseUserPostsReturn {
  posts: Post[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useUserPosts(userId: string): UseUserPostsReturn {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shouldPoll, setShouldPoll] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data.posts || []);
      setError(null);
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  useEffect(() => {
    if (!shouldPoll) return;

    const timer = setTimeout(() => {
      fetchPosts();
      setShouldPoll(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [shouldPoll]);

  const refresh = () => {
    setShouldPoll(true);
  };

  return { posts, loading, error, refresh };
}
