"use client";

import { useState } from 'react';
import { Search } from 'lucide-react';
import SearchResults from './SearchResults';

interface User {
  user_id: string;
  username: string;
  bio: string;
  profile_picture: string | null;
}

export default function UserSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(`/api/search/users?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setResults(data.users || []);
    } catch (error) {
      console.error('Search error');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by username..."
            className="input-base pr-10"
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition"
          >
            <Search size={20} />
          </button>
        </div>
      </form>

      {loading && <div className="text-center py-8 text-muted">Searching...</div>}
      {searched && !loading && results.length === 0 && (
        <div className="text-center py-8 text-muted">No users found</div>
      )}
      {results.length > 0 && <SearchResults results={results} />}
    </div>
  );
}
