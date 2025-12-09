import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Check if we're using mock auth
    const cookieStore = await cookies();
    const useMockAuth = cookieStore.get('use-mock-auth')?.value === 'true';

    if (useMockAuth) {
      // Clear mock auth cookies
      cookieStore.delete('mock-auth-session');
      cookieStore.delete('use-mock-auth');
    } else {
      // Use real Supabase logout
      const supabase = await createClient();
      await supabase.auth.signOut();
    }

    return NextResponse.redirect(new URL('/auth/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
}