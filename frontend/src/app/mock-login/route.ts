import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  // Only allow this in development mode
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json(
      { error: 'This route is only available in development mode' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const redirectTo = searchParams.get('redirect') || '/';

  // Create a mock user object
  const mockUser = {
    id: 'mock-user-123',
    email: searchParams.get('email') || 'test@example.com',
    user_metadata: {
      full_name: searchParams.get('name') || 'Test User',
      avatar_url: 'https://avatar.vercel.sh/test',
    },
    app_metadata: {},
    aud: 'authenticated',
    role: 'authenticated',
    created_at: new Date().toISOString(),
  };

  // Create a mock session
  const mockSession = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    token_type: 'bearer',
    user: mockUser,
  };

  // Set a cookie to persist the mock session
  const cookieStore = await cookies();
  cookieStore.set('mock-auth-session', JSON.stringify(mockSession), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  // Also set a flag that we're using mock auth
  cookieStore.set('use-mock-auth', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });

  // Redirect to the specified page
  const redirectUrl = new URL(redirectTo, request.url);
  return NextResponse.redirect(redirectUrl);
}