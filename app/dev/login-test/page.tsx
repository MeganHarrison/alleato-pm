'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

export default function DevLoginTest() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('testpassword123');
  const [name, setName] = useState('Test User');
  const [redirectTo, setRedirectTo] = useState('/');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  const handleSupabaseLogin = () => {
    const params = new URLSearchParams({
      email,
      password,
      redirect: redirectTo,
    });
    window.location.href = `/dev-login?${params.toString()}`;
  };

  const handleMockLogin = () => {
    const params = new URLSearchParams({
      email,
      name,
      redirect: redirectTo,
    });
    window.location.href = `/mock-login?${params.toString()}`;
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/auth/logout', { method: 'POST' });
      if (response.ok) {
        setStatus({ type: 'success', message: 'Logged out successfully' });
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setStatus({ type: 'error', message: 'Failed to logout' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Error during logout' });
    }
  };

  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="container mx-auto py-10">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            This page is only available in development mode.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Development Login Test</CardTitle>
          <CardDescription>
            Use these tools to quickly log in during development and bypass authentication issues.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status.type && (
            <Alert variant={status.type === 'error' ? 'destructive' : 'default'}>
              {status.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="redirectTo">Redirect To (after login)</Label>
            <Input
              id="redirectTo"
              value={redirectTo}
              onChange={(e) => setRedirectTo(e.target.value)}
              placeholder="/"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Supabase Login</CardTitle>
            <CardDescription>
              Attempts to create a real Supabase session. Use this if Supabase is working.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="testpassword123"
              />
            </div>
            <Button onClick={handleSupabaseLogin} className="w-full">
              Login with Supabase
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mock Login</CardTitle>
            <CardDescription>
              Creates a mock session without hitting Supabase. Use this if Supabase is down.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Test User"
              />
            </div>
            <Button onClick={handleMockLogin} className="w-full" variant="secondary">
              Login with Mock Auth
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRedirectTo('/chat');
                setTimeout(handleMockLogin, 100);
              }}
            >
              Mock Login → Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRedirectTo('/chat-rag');
                setTimeout(handleMockLogin, 100);
              }}
            >
              Mock Login → RAG Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setRedirectTo('/meetings');
                setTimeout(handleMockLogin, 100);
              }}
            >
              Mock Login → Meetings
            </Button>
          </div>
          <div className="pt-3 border-t">
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Usage Instructions</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm max-w-none">
          <ol className="space-y-2">
            <li>
              <strong>Direct URLs:</strong>
              <ul>
                <li><code>/dev-login?email=test@example.com&password=test123&redirect=/chat</code></li>
                <li><code>/mock-login?email=test@example.com&name=John+Doe&redirect=/meetings</code></li>
              </ul>
            </li>
            <li>
              <strong>Mock Login</strong> is recommended when Supabase is having issues. It creates a fake session that most components will accept.
            </li>
            <li>
              <strong>Supabase Login</strong> creates a real user and session in Supabase. Use this for testing real authentication flows.
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}