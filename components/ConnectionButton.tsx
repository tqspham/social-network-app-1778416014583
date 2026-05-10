"use client";

import { useState } from 'react';
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

      setSent(true);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="mb-2 text-red-600 text-sm">{error}</div>}
      <button
        onClick={handleSendRequest}
        disabled={loading || sent}
        className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
      >
        <UserPlus size={16} />
        {sent ? 'Request Sent' : 'Send Connection Request'}
      </button>
    </div>
  );
}
