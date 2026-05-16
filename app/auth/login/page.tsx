import { getSessionUserId } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import LoginForm from '@/components/LoginForm';

export const metadata = {
  title: 'Sign In | SocialNet',
  description: 'Sign in to your SocialNet account',
};

export default async function LoginPage() {
  const userId = await getSessionUserId();
  if (userId) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-page flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-display-lg text-primary text-center mb-8">Sign In</h1>
        <LoginForm />
      </div>
    </div>
  );
}
