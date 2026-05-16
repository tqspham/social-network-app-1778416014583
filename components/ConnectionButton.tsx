"use client";

import { useState, useEffect } from 'react';
import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConnectionButtonProps {
  targetUserId: string;
}

export default function ConnectionButton({
  targetUserId,
}: ConnectionButtonProps) {
  const [loading, setLoading] = useState(false);
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

      await checkConnectionStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  if (checkingStatus) {
    return <div className="text-center py-2 text-muted text-sm">Checking...</div>;
  }

  if (connectionStatus === 'accepted') {
    return (
      <div className="flex items-center gap-2 bg-success bg-opacity-10 text-success py-2 px-4 rounded-lg font-medium text-sm">
        Connected
      </div>
    );
  }

  return (
    <div>
      {error && <div className="mb-2 text-danger text-sm font-medium">{error}</div>}
      <motion.button
        onClick={handleSendRequest}
        disabled={loading || connectionStatus === 'pending'}
        whileHover={!loading && connectionStatus !== 'pending' ? { scale: 1.02 } : {}}
        whileTap={!loading && connectionStatus !== 'pending' ? { scale: 0.98 } : {}}
        className="w-full flex items-center justify-center gap-2 btn-secondary disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <UserPlus size={16} />
        {connectionStatus === 'pending' ? 'Request Sent' : 'Send Connection Request'}
      </motion.button>
    </div>
  );
}
