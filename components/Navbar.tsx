"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      console.error('Logout failed');
    }
  };

  return (
    <nav className="border-b border-card bg-surface sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-display-sm text-primary font-bold">
            SocialNet
          </Link>

          <div className="hidden md:flex gap-8 items-center">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-muted hover:text-primary transition"
            >
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </button>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-6 flex flex-col gap-4 pb-6 border-t border-card pt-6">
            <Link
              href="/"
              className="text-primary hover:text-accent transition font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Feed
            </Link>
            <Link
              href="/profile"
              className="text-primary hover:text-accent transition font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              href="/connections"
              className="text-primary hover:text-accent transition font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Connections
            </Link>
            <Link
              href="/search"
              className="text-primary hover:text-accent transition font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Search
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-muted hover:text-accent transition text-left font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        )}
      </div>

      <footer className="hidden md:block border-t border-card bg-surface py-6 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex gap-8 justify-center text-sm">
            <Link href="/" className="text-primary hover:text-accent transition font-medium">
              Feed
            </Link>
            <Link href="/profile" className="text-primary hover:text-accent transition font-medium">
              Profile
            </Link>
            <Link href="/connections" className="text-primary hover:text-accent transition font-medium">
              Connections
            </Link>
            <Link href="/search" className="text-primary hover:text-accent transition font-medium">
              Search
            </Link>
          </div>
        </div>
      </footer>
    </nav>
  );
}
