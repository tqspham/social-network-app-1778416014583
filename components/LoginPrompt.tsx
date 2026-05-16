import Link from 'next/link';

export default function LoginPrompt() {
  return (
    <div className="max-w-md mx-auto text-center py-16 bg-surface rounded-lg border-card p-12">
      <h2 className="text-display text-primary mb-4">Welcome to SocialNet</h2>
      <p className="text-muted mb-8 text-base">Connect with others and share your thoughts</p>
      <div className="flex gap-4 flex-col">
        <Link
          href="/auth/login"
          className="btn-primary"
        >
          Sign In
        </Link>
        <Link
          href="/auth/register"
          className="btn-outline"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}
