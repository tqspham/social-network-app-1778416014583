import { getSessionUserId } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import RegisterForm from '@/components/RegisterForm';

export const metadata = {
  title: 'Create Account | SocialNet',
  description: 'Create a new SocialNet account',
};

export default async function RegisterPage() {
  const userId = await getSessionUserId();
  if (userId) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-page flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-display-lg text-primary text-center mb-8">Create Account</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
