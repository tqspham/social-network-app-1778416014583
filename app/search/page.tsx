import { getSessionUserId } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import UserSearch from '@/components/UserSearch';

export const metadata = {
  title: 'Search Users | SocialNet',
  description: 'Find and connect with users on SocialNet',
};

export default async function SearchPage() {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-display text-primary mb-8">Search Users</h1>
          <UserSearch />
        </div>
      </main>
    </div>
  );
}
