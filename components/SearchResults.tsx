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

function getAvatarColor(userId: string): string {
  const colors = [
    '#2A5F4A',
    '#D4A574',
    '#E07856',
    '#4A8F5E',
    '#C89A4B',
  ];
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export default function SearchResults({ results }: SearchResultsProps) {
  return (
    <div className="space-y-4">
      {results.map((user) => {
        const avatarColor = getAvatarColor(user.user_id);
        return (
          <div key={user.user_id} className="bg-surface border-card p-6 rounded-lg">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: avatarColor }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-primary text-lg">{user.username}</h3>
                  {user.bio && <p className="text-muted text-sm mt-1">{user.bio}</p>}
                </div>
              </div>
              <Link
                href={`/profile/${user.user_id}`}
                className="btn-secondary text-sm flex-shrink-0"
              >
                View Profile
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
