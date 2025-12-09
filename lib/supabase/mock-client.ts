import { cookies } from 'next/headers';
import { createClient as createRealClient } from './server';

export async function createClient() {
  const cookieStore = await cookies();
  const useMockAuth = cookieStore.get('use-mock-auth')?.value === 'true';
  const mockSessionCookie = cookieStore.get('mock-auth-session')?.value;

  // If not using mock auth, return the real client
  if (!useMockAuth || !mockSessionCookie) {
    return createRealClient();
  }

  // Parse the mock session
  const mockSession = JSON.parse(mockSessionCookie);

  // Create a mock Supabase client
  const mockClient = {
    auth: {
      getUser: async () => ({
        data: { user: mockSession.user },
        error: null,
      }),
      getSession: async () => ({
        data: { session: mockSession },
        error: null,
      }),
      signInWithPassword: async () => ({
        data: { user: mockSession.user, session: mockSession },
        error: null,
      }),
      signOut: async () => {
        const cookieStore = await cookies();
        cookieStore.delete('mock-auth-session');
        cookieStore.delete('use-mock-auth');
        return { error: null };
      },
      onAuthStateChange: (callback: Function) => {
        // Immediately call the callback with the current session
        callback('SIGNED_IN', mockSession);
        return {
          data: { subscription: { unsubscribe: () => {} } },
          error: null,
        };
      },
    },
    from: (table: string) => ({
      select: () => ({
        data: [],
        error: null,
      }),
      insert: () => ({
        data: null,
        error: null,
      }),
      update: () => ({
        data: null,
        error: null,
      }),
      delete: () => ({
        data: null,
        error: null,
      }),
    }),
  };

  // Return the real client but with overridden auth methods
  const realClient = await createRealClient();
  return {
    ...realClient,
    auth: mockClient.auth,
  };
}