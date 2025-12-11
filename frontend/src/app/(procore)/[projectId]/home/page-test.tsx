'use client';

import * as React from 'react';
import { use } from 'react';
import { AppShell } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PageProps {
  params: Promise<{ projectId: string }>;
}

export default function ProjectHomePageTest({ params }: PageProps) {
  const { projectId } = use(params);
  
  return (
    <AppShell
      companyName="Alleato Group"
      projectName="Test Project"
      currentTool="Home"
      userInitials="BC"
    >
      <div className="flex flex-col min-h-[calc(100vh-48px)] bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Project Home - Test Version</h1>
          <p>Project ID: {projectId}</p>
        </div>
        
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p>If you can see this, the basic page structure is working.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}