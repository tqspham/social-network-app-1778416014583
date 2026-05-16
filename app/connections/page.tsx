import { getSessionUserId } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ConnectionsList from '@/components/ConnectionsList';
import PendingRequests from '@/components/PendingRequests';

export const metadata = {
  title: 'Connections | SocialNet',
  description: 'Manage your SocialNet connections',
};

export default async function ConnectionsPage() {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-display text-primary mb-12">Connections</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-display-sm text-primary mb-6">Accepted Connections</h2>
              <ConnectionsList />
            </div>
            <div>
              <h2 className="text-display-sm text-primary mb-6">Pending Requests</h2>
              <PendingRequests />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
