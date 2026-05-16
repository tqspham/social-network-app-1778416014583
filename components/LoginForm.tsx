"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed');
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-lg border-card">
      <div className="mb-6">
        <label className="block text-sm font-medium text-primary mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="input-base"
        />
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-primary mb-2">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="input-base"
        />
      </div>

      {error && <div className="mb-4 text-danger text-sm font-medium">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed mb-6"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>

      <p className="text-center text-sm text-muted">
        Don't have an account?{' '}
        <Link href="/auth/register" className="text-primary hover:text-accent transition font-medium">
          Create one
        </Link>
      </p>
    </form>
  );
}
