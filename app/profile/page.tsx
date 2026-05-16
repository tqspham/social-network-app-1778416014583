import { getSessionUserId } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import Navbar from '@/components/Navbar';
import ProfileCard from '@/components/ProfileCard';

export const metadata = {
  title: 'My Profile | SocialNet',
  description: 'View and edit your SocialNet profile',
};

export default async function ProfilePage() {
  const userId = await getSessionUserId();
  if (!userId) {
    redirect('/auth/login');
  }

  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <ProfileCard userId={userId} isOwn={true} />
        </div>
      </main>
    </div>
  );
}
