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
          throw new Error('Failed to fetch profile');
        }
        setUser(null);
        return;
      }
      const data = await response.json();
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
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Link href="/search" className="text-blue-600 hover:underline">
          Back to search
        </Link>
      </div>
    );
  }

  if (!user) {
    return <div className="text-center py-8 text-red-600">Profile not found</div>;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center text-2xl font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.username}</h1>
            {isOwn && user.email && <p className="text-gray-600 text-sm">{user.email}</p>}
            <p className="text-gray-600 mt-2">{user.bio}</p>
          </div>
        </div>
        {isOwn && (
          <button
            onClick={() => setEditModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            <Edit2 size={16} />
            Edit Profile
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
