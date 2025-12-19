'use client'

import { useState } from 'react'
import { ChatLayout } from '@/components/chat/chat-layout'

export default function TeamChatPage() {
  const [username, setUsername] = useState('User_' + Math.random().toString(36).substring(7))

  return (
    <ChatLayout username={username} onUsernameChange={setUsername} />
  )
}
