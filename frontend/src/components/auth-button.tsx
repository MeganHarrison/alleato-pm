'use client';

import { LogoutButton } from '@/components/logout-button';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function AuthButton() {
  const router = useRouter();

  // TODO: Get user from Supabase auth
  const user = null; // Placeholder

  return user ? (
    <div className="flex items-center gap-4">
      <span className="text-sm">Hey, {user}!</span>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant="ghost">
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/auth/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}