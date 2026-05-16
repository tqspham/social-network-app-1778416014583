"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  user_id: string;
  username: string;
  bio: string;
  profile_picture: string | null;
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

export default function ConnectionsList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await fetch('/api/connections');
        if (!response.ok) throw new Error('Failed to fetch connections');
        const data = await response.json();
        setUsers(data.accepted || []);
      } catch (error) {
        console.error('Error fetching connections');
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  if (loading) {
    return <div className="text-center py-4 text-muted">Loading connections...</div>;
  }

  if (users.length === 0) {
    return <div className="text-muted">No connections yet</div>;
  }

  return (
    <ul className="space-y-3">
      {users.map((user) => {
        const avatarColor = getAvatarColor(user.user_id);
        return (
          <li key={user.user_id} className="bg-surface border-card p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                style={{ backgroundColor: avatarColor }}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <Link href={`/profile/${user.user_id}`} className="text-primary hover:text-accent transition font-bold text-base">
                  {user.username}
                </Link>
                {user.bio && <p className="text-muted text-sm mt-1">{user.bio}</p>}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
