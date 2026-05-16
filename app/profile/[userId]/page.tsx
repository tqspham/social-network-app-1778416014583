import { getSessionUserId } from '@/app/lib/auth';
import Navbar from '@/components/Navbar';
import ProfileCard from '@/components/ProfileCard';
import ConnectionButton from '@/components/ConnectionButton';
import PostList from '@/components/PostList';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export const metadata = {
  title: 'Profile | SocialNet',
  description: 'View user profile on SocialNet',
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params;
  const currentUserId = await getSessionUserId();

  if (!currentUserId) {
    redirect('/auth/login');
  }

  const isOwn = currentUserId === userId;

  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <ProfileCard userId={userId} isOwn={isOwn} />
          {!isOwn && (
            <div className="mt-6">
              <ConnectionButton targetUserId={userId} />
            </div>
          )}
          <div className="mt-12">
            <h2 className="text-display-sm text-primary mb-6">Posts</h2>
            <PostList userId={userId} />
          </div>
        </div>
      </main>
    </div>
  );
}
