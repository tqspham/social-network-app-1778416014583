import { getSessionUserId } from '@/app/lib/auth';
import Navbar from '@/components/Navbar';
import Feed from '@/components/Feed';
import LoginPrompt from '@/components/LoginPrompt';

export default async function Home() {
  const userId = await getSessionUserId();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {userId ? <Feed /> : <LoginPrompt />}
      </main>
    </div>
  );
}
