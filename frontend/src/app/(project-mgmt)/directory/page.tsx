'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, User } from 'lucide-react';
import Link from 'next/link';

export default function DirectoryPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Directory</h1>
        <p className="text-muted-foreground mt-2">
          Manage companies, clients, and users across your organization
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/directory/companies">
          <Card className="cursor-pointer transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Companies</CardTitle>
              </div>
              <CardDescription>
                View and manage company information
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/directory/clients">
          <Card className="cursor-pointer transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Clients</CardTitle>
              </div>
              <CardDescription>
                Manage client relationships and contacts
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/directory/users">
          <Card className="cursor-pointer transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Users</CardTitle>
              </div>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
