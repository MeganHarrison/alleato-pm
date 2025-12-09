'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';

export default function AuthTest() {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mockAuth, setMockAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for mock auth cookie
        const isMockAuth = document.cookie.includes('use-mock-auth=true');
        setMockAuth(isMockAuth);

        if (isMockAuth) {
          // Parse mock session from cookie
          const mockSessionMatch = document.cookie.match(/mock-auth-session=([^;]+)/);
          if (mockSessionMatch) {
            const mockSession = JSON.parse(decodeURIComponent(mockSessionMatch[1]));
            setSession(mockSession);
            setUser(mockSession.user);
          }
        } else {
          // Use real Supabase
          const supabase = createClient();
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (userError || sessionError) {
            setError(userError?.message || sessionError?.message || 'Unknown error');
          } else {
            setUser(user);
            setSession(session);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check authentication');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Status</CardTitle>
          <CardDescription>
            Current authentication state and user information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p>Loading authentication status...</p>
          ) : error ? (
            <div className="flex items-center gap-2 text-destructive">
              <XCircle className="h-4 w-4" />
              <span>Error: {error}</span>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                {user ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="font-medium">Authenticated</span>
                    {mockAuth && <Badge variant="secondary">Mock Auth</Badge>}
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span className="font-medium">Not Authenticated</span>
                  </>
                )}
              </div>

              {user && (
                <div className="space-y-3 border-t pt-4">
                  <h3 className="font-semibold">User Information</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">User ID:</span>
                      <code className="font-mono">{user.id}</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <code className="font-mono">{user.email}</code>
                    </div>
                    {user.user_metadata?.full_name && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span>{user.user_metadata.full_name}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <span>{user.role || 'authenticated'}</span>
                    </div>
                  </div>
                </div>
              )}

              {session && (
                <div className="space-y-3 border-t pt-4">
                  <h3 className="font-semibold">Session Information</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Access Token:</span>
                      <code className="font-mono text-xs">{session.access_token?.substring(0, 20)}...</code>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expires At:</span>
                      <span>{new Date(session.expires_at * 1000).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = '/dev/login-test'}
                >
                  Go to Dev Login
                </Button>
                {user && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      await fetch('/auth/logout', { method: 'POST' });
                      window.location.reload();
                    }}
                  >
                    Logout
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Test Links</CardTitle>
          <CardDescription>
            Test authentication on different pages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="link" size="sm" onClick={() => window.location.href = '/chat'}>
              Chat Page
            </Button>
            <Button variant="link" size="sm" onClick={() => window.location.href = '/chat-rag'}>
              RAG Chat Page
            </Button>
            <Button variant="link" size="sm" onClick={() => window.location.href = '/meetings'}>
              Meetings Page
            </Button>
            <Button variant="link" size="sm" onClick={() => window.location.href = '/protected'}>
              Protected Page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}