import { getSessionUserId } from '@/app/lib/auth';
import Navbar from '@/components/Navbar';
import ProfileCard from '@/components/ProfileCard';
import PostList from '@/components/PostList';
import ConnectionButton from '@/components/ConnectionButton';
import { supabase } from '@/lib/supabase';

interface ProfilePageProps {
  params: { userId: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = params;
  const currentUserId = await getSessionUserId();

  const { data: user, error } = await supabase
    .from('social_network_app_1778416014583_users')
    .select('user_id')
    .eq('user_id', userId)
    .single();

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-600">User not found</p>
        </main>
      </div>
    );
  }

  const isOwn = currentUserId === userId;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <ProfileCard userId={userId} isOwn={isOwn} />
          {!isOwn && currentUserId && (
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
