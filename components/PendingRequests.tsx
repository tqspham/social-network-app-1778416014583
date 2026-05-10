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
    return <div className="text-center py-4">Loading requests...</div>;
  }

  if (requests.length === 0) {
    return <div className="text-gray-600">No pending requests</div>;
  }

  return (
    <ul className="space-y-3">
      {requests.map((request) => (
        <li key={request.requestId} className="bg-white border border-gray-200 p-3 rounded-lg">
          <div className="flex justify-between items-start">
            <Link href={`/profile/${request.user.user_id}`} className="text-blue-600 hover:underline font-medium">
              {request.user.username}
            </Link>
            <div className="flex gap-2">
              <button
                onClick={() => handleAccept(request.requestId)}
                className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(request.requestId)}
                className="text-sm border border-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-100 transition"
              >
                Reject
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
