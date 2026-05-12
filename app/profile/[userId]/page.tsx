import { getSessionUserId } from '@/app/lib/auth';
import Navbar from '@/components/Navbar';
import ProfileCard from '@/components/ProfileCard';
import ConnectionButton from '@/components/ConnectionButton';
import { redirect } from 'next/navigation';

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params;
  const currentUserId = await getSessionUserId();

  if (!currentUserId) {
    redirect('/auth/login');
  }

  const isOwn = currentUserId === userId;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <ProfileCard userId={userId} isOwn={isOwn} />
          {!isOwn && (
            <div className="mt-4">
              <ConnectionButton targetUserId={userId} onSuccess={() => {}} />
            </div>
          )}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Posts</h2>
            <PostList userId={userId} />
          </div>
        </div>
      </main>
    </div>
  );
}

import PostList from '@/components/PostList';