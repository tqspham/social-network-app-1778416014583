import { getSessionUserId } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ConnectionsList from '@/components/ConnectionsList';
import PendingRequests from '@/components/PendingRequests';

export default async function ConnectionsPage() {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Connections</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Accepted Connections</h2>
              <ConnectionsList />
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
              <PendingRequests />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
