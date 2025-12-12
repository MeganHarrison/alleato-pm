'use client'

import { RealtimeChat } from '@/components/realtime-chat'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState, useCallback } from 'react'
import type { ChatMessage } from '@/hooks/use-realtime-chat'

export default function TeamChatPage() {
  const [username, setUsername] = useState('User_' + Math.random().toString(36).substring(7))
  const [generalMessages, setGeneralMessages] = useState<ChatMessage[]>([])
  const [projectMessages, setProjectMessages] = useState<ChatMessage[]>([])
  const [supportMessages, setSupportMessages] = useState<ChatMessage[]>([])

  // Callbacks to handle message storage (optional - for persistence)
  const handleGeneralMessage = useCallback((messages: ChatMessage[]) => {
    setGeneralMessages(messages)
    // Here you could save messages to a database or localStorage
    console.log('General channel messages:', messages)
  }, [])

  const handleProjectMessage = useCallback((messages: ChatMessage[]) => {
    setProjectMessages(messages)
    console.log('Project channel messages:', messages)
  }, [])

  const handleSupportMessage = useCallback((messages: ChatMessage[]) => {
    setSupportMessages(messages)
    console.log('Support channel messages:', messages)
  }, [])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Team Chat</CardTitle>
          <CardDescription>
            Real-time communication with your team across different channels
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="px-6 pb-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>You are chatting as:</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="px-2 py-1 border rounded text-foreground"
                placeholder="Enter your username"
              />
            </div>
          </div>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
              <TabsTrigger 
                value="general" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                #general
              </TabsTrigger>
              <TabsTrigger 
                value="project" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                #project-updates
              </TabsTrigger>
              <TabsTrigger 
                value="support" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                #support
              </TabsTrigger>
            </TabsList>

            <div className="h-[500px]">
              <TabsContent value="general" className="h-full m-0">
                <RealtimeChat
                  roomName="general-channel"
                  username={username}
                  onMessage={handleGeneralMessage}
                  messages={generalMessages}
                />
              </TabsContent>

              <TabsContent value="project" className="h-full m-0">
                <RealtimeChat
                  roomName="project-updates-channel"
                  username={username}
                  onMessage={handleProjectMessage}
                  messages={projectMessages}
                />
              </TabsContent>

              <TabsContent value="support" className="h-full m-0">
                <RealtimeChat
                  roomName="support-channel"
                  username={username}
                  onMessage={handleSupportMessage}
                  messages={supportMessages}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-6 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">About Realtime Chat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              This chat uses Supabase Realtime Broadcast for low-latency communication.
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Messages are delivered in real-time to all connected users</li>
              <li>Each channel (room) is isolated from others</li>
              <li>Messages are not automatically stored - use onMessage callback for persistence</li>
              <li>Perfect for ephemeral communication or when paired with a database</li>
            </ul>
            <p className="pt-2">
              Try opening this page in multiple browser tabs to see real-time synchronization!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}