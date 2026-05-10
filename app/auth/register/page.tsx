import { getSessionUserId } from '@/app/lib/auth';
import { redirect } from 'next/navigation';
import RegisterForm from '@/components/RegisterForm';

export default async function RegisterPage() {
  const userId = await getSessionUserId();
  if (userId) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
