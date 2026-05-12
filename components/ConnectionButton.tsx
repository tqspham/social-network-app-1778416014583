"use client";

import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';

interface ConnectionButtonProps {
  targetUserId: string;
  onSuccess: () => void;
}

export default function ConnectionButton({
  targetUserId,
  onSuccess,
}: ConnectionButtonProps) {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'accepted'>('none');

  useEffect(() => {
    checkConnectionStatus();
  }, [targetUserId]);

  const checkConnectionStatus = async () => {
    try {
      setCheckingStatus(true);
      const response = await fetch('/api/connections');
      if (!response.ok) {
        setCheckingStatus(false);
        return;
      }
      const data = await response.json();

      const acceptedConnection = data.accepted?.some(
        (user: { user_id: string }) => user.user_id === targetUserId
      );
      if (acceptedConnection) {
        setConnectionStatus('accepted');
        setCheckingStatus(false);
        return;
      }

      const pendingRequest = data.pending?.some(
        (req: { user: { user_id: string } }) => req.user.user_id === targetUserId
      );
      if (pendingRequest) {
        setConnectionStatus('pending');
        setCheckingStatus(false);
        return;
      }

      setConnectionStatus('none');
    } catch (err) {
      console.error('Error checking connection status');
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleSendRequest = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/connections/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetUserId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send request');
      }

      setConnectionStatus('pending');
      setSent(true);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return <div className="text-center py-2">Checking connection status...</div>;
  }

  if (connectionStatus === 'accepted') {
    return (
      <div className="flex items-center gap-2 bg-green-100 text-green-700 py-2 px-4 rounded-lg">
        <span className="text-sm">Connected</span>
      </div>
    );
  }

  return (
    <div>
      {error && <div className="mb-2 text-red-600 text-sm">{error}</div>}
      <button
        onClick={handleSendRequest}
        disabled={loading || connectionStatus === 'pending'}
        className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        <UserPlus size={16} />
        {connectionStatus === 'pending' ? 'Request Sent' : 'Send Connection Request'}
      </button>
    </div>
  );
}
