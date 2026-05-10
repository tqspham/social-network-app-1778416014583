"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  user_id: string;
  username: string;
  bio: string;
  profile_picture: string | null;
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
    return <div className="text-center py-4">Loading connections...</div>;
  }

  if (users.length === 0) {
    return <div className="text-gray-600">No connections yet</div>;
  }

  return (
    <ul className="space-y-2">
      {users.map((user) => (
        <li key={user.user_id} className="bg-white border border-gray-200 p-3 rounded-lg">
          <Link href={`/profile/${user.user_id}`} className="text-blue-600 hover:underline font-medium">
            {user.username}
          </Link>
          {user.bio && <p className="text-gray-600 text-sm mt-1">{user.bio}</p>}
        </li>
      ))}
    </ul>
  );
}
