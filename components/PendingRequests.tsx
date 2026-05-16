"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface PendingRequest {
  requestId: string;
  status: string;
  user: {
    user_id: string;
    username: string;
    profile_picture: string | null;
  };
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

export default function PendingRequests() {
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/connections');
      if (!response.ok) throw new Error('Failed to fetch requests');
      const data = await response.json();
      setRequests(data.pending || []);
    } catch (error) {
      console.error('Error fetching requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (requestId: string) => {
    try {
      const response = await fetch(`/api/connections/request/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'accepted' }),
      });
      if (response.ok) {
        fetchRequests();
      }
    } catch (error) {
      console.error('Error accepting request');
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const response = await fetch(`/api/connections/request/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' }),
      });
      if (response.ok) {
        fetchRequests();
      }
    } catch (error) {
      console.error('Error rejecting request');
    }
  };

  if (loading) {
    return <div className="text-center py-4 text-muted">Loading requests...</div>;
  }

  if (requests.length === 0) {
    return <div className="text-muted">No pending requests</div>;
  }

  return (
    <ul className="space-y-3">
      {requests.map((request) => {
        const avatarColor = getAvatarColor(request.user.user_id);
        return (
          <li key={request.requestId} className="bg-surface border-card p-4 rounded-lg">
            <div className="flex justify-between items-start gap-3">
              <div className="flex items-start gap-3 flex-1">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: avatarColor }}
                >
                  {request.user.username.charAt(0).toUpperCase()}
                </div>
                <Link href={`/profile/${request.user.user_id}`} className="text-primary hover:text-accent transition font-bold text-base">
                  {request.user.username}
                </Link>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(request.requestId)}
                  className="text-sm btn-primary"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(request.requestId)}
                  className="text-sm btn-outline"
                >
                  Reject
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
