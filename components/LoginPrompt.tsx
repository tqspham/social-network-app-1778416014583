import Link from 'next/link';

export default function LoginPrompt() {
  return (
    <div className="max-w-md mx-auto text-center py-12 bg-white rounded-lg border border-gray-200 p-8">
      <h2 className="text-2xl font-bold mb-4">Welcome to SocialNet</h2>
      <p className="text-gray-600 mb-6">Connect with others and share your thoughts</p>
      <div className="flex gap-4 flex-col">
        <Link
          href="/auth/login"
          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          Sign In
        </Link>
        <Link
          href="/auth/register"
          className="border border-blue-600 text-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}
