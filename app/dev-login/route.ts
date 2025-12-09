import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  // Only allow this in development mode
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This route is only available in development mode' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') || 'test@example.com';
  const password = searchParams.get('password') || 'testpassword123';
  const redirectTo = searchParams.get('redirect') || '/';

  try {
    const supabase = await createClient();
    
    // First, try to sign in with the provided credentials
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // If sign in fails, try to create the user first
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: 'Test User',
            avatar_url: 'https://avatar.vercel.sh/test',
          }
        }
      });

      if (signUpError) {
        return NextResponse.json(
          { error: 'Failed to create or sign in user', details: signUpError.message },
          { status: 400 }
        );
      }

      // Try signing in again after creating the user
      const { data: newSignInData, error: newSignInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (newSignInError) {
        return NextResponse.json(
          { error: 'Failed to sign in after creating user', details: newSignInError.message },
          { status: 400 }
        );
      }
    }

    // Redirect to the specified page or home
    return NextResponse.redirect(new URL(redirectTo, request.url));
  } catch (error) {
    return NextResponse.json(
      { error: 'An unexpected error occurred', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}