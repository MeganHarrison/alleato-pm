'use client';

import { AppShell } from '@/components/layout';

export default function TeamChatPage() {
  return (
    <AppShell
      companyName="Alleato Group"
      projectName="Team Chat"
      currentTool="Team Chat"
      userInitials="BC"
    >
      <div className="flex flex-col h-full bg-gray-50 p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">Team Chat</h1>
        <p className="text-gray-600">Team chat functionality coming soon...</p>
      </div>
    </AppShell>
  );
}