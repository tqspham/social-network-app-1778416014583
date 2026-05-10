import { getSessionUserId } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import UserSearch from '@/components/UserSearch';
import SearchResults from '@/components/SearchResults';

export default async function SearchPage() {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Search Users</h1>
          <UserSearch />
        </div>
      </main>
    </div>
  );
}
