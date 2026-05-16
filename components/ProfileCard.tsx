"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit2 } from 'lucide-react';
import EditProfileModal from './EditProfileModal';

interface User {
  user_id: string;
  email?: string;
  username: string;
  bio: string;
  profile_picture: string | null;
}

interface ProfileCardProps {
  userId: string;
  isOwn: boolean;
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

export default function ProfileCard({ userId, isOwn }: ProfileCardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const url = isOwn ? '/api/profile' : `/api/profile/${userId}`;
      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 404) {
          setError('User not found');
        } else {
          setError('Failed to load profile');
        }
        setUser(null);
        return;
      }

      const data = await response.json();

      if (!data.user_id || !data.username) {
        setError('User not found');
        setUser(null);
        return;
      }

      setUser({
        user_id: data.user_id,
        email: data.email,
        username: data.username,
        bio: data.bio,
        profile_picture: data.profile_picture,
      });
    } catch (err) {
      setError('Failed to load profile');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userId, isOwn]);

  const handleProfileUpdate = () => {
    setEditModalOpen(false);
    fetchProfile();
  };

  if (loading) {
    return <div className="text-center py-12 text-muted">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-danger mb-4 font-medium">{error}</p>
        <Link href="/search" className="text-primary hover:text-accent transition font-medium">
          Back to search
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-danger mb-4 font-medium">User not found</p>
        <Link href="/search" className="text-primary hover:text-accent transition font-medium">
          Back to search
        </Link>
      </div>
    );
  }

  const avatarColor = getAvatarColor(user.user_id);

  return (
    <div className="bg-surface border-card rounded-lg p-8">
      <div className="flex items-start gap-8">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
          style={{ backgroundColor: avatarColor }}
        >
          {user.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-display-sm text-primary">{user.username}</h1>
          {isOwn && user.email && (
            <p className="text-muted text-sm mt-1">{user.email}</p>
          )}
          {user.bio && (
            <p className="text-secondary mt-3 text-base leading-relaxed">{user.bio}</p>
          )}
        </div>
        {isOwn && (
          <button
            onClick={() => setEditModalOpen(true)}
            className="flex items-center gap-2 text-primary hover:text-accent transition text-sm font-medium px-3 py-2"
          >
            <Edit2 size={16} />
            Edit
          </button>
        )}
      </div>

      <EditProfileModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleProfileUpdate}
      />
    </div>
  );
}
