"use client"

import { Menu, Hash, Search, Users, MoreVertical, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatHeader } from "./chat-header"
import { MessageList } from "./message-list"
import { Composer } from "./composer"
import { useRealtimeChat } from "@/hooks/use-realtime-chat"
import { useMemo } from "react"

interface ChatMainProps {
  channelId: string
  username: string
  onUsernameChange?: (username: string) => void
  onToggleSidebar: () => void
  onToggleRightPanel: () => void
  onMessageSelect?: (messageId: string) => void
}

const channelInfo: Record<string, { name: string; topic: string }> = {
  general: {
    name: "general",
    topic: "Company-wide announcements and work-related matters",
  },
  "project-updates": {
    name: "project-updates",
    topic: "Share updates and progress on active projects",
  },
  support: {
    name: "support",
    topic: "Get help and support from the team",
  },
}

export function ChatMain({
  channelId,
  username,
  onUsernameChange,
  onToggleSidebar,
  onToggleRightPanel,
  onMessageSelect,
}: ChatMainProps) {
  const roomName = `${channelId}-channel`
  const { messages, sendMessage, isConnected } = useRealtimeChat(roomName, username)

  const channel = channelInfo[channelId] || { name: channelId, topic: "" }

  const handleSend = (content: string) => {
    sendMessage(content)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <ChatHeader
        channelName={channel.name}
        topic={channel.topic}
        memberCount={0}
        onToggleSidebar={onToggleSidebar}
        onToggleRightPanel={onToggleRightPanel}
        isConnected={isConnected}
      />

      {/* Messages */}
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          currentUsername={username}
          onMessageSelect={onMessageSelect}
        />
      </div>

      {/* Composer */}
      <Composer
        onSend={handleSend}
        channelName={channel.name}
        disabled={!isConnected}
      />
    </div>
  )
}
