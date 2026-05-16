import { getSessionUserId } from '@/app/lib/auth';
import Navbar from '@/components/Navbar';
import Feed from '@/components/Feed';
import LoginPrompt from '@/components/LoginPrompt';

export const metadata = {
  title: 'SocialNet | Connect & Share',
  description: 'A warm, human-centered social network for authentic connections',
};

export default async function Home() {
  const userId = await getSessionUserId();

  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        {userId ? <Feed /> : <LoginPrompt />}
      </main>
    </div>
  );
}
