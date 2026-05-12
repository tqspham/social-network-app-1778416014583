"use client";

import Link from 'next/link';

interface User {
  user_id: string;
  username: string;
  bio: string;
  profile_picture: string | null;
}

interface SearchResultsProps {
  results: User[];
}

export default function SearchResults({ results }: SearchResultsProps) {
  return (
    <div className="space-y-4">
      {results.map((user) => (
        <div key={user.user_id} className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">{user.username}</h3>
              {user.bio && <p className="text-gray-600">{user.bio}</p>}
            </div>
            <Link
              href={`/profile/${user.user_id}`}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              View Profile
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}