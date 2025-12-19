"use client"

import { useEffect, useRef, useMemo } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageGroup } from "./message-group"
import { DateDivider } from "./date-divider"
import { format, isToday, isYesterday, isSameDay, parseISO } from "date-fns"

interface Message {
  id: string
  content: string
  user: { name: string }
  createdAt: string
}

interface MessageListProps {
  messages: Message[]
  currentUsername: string
  onMessageSelect?: (messageId: string) => void
}

interface GroupedMessage extends Message {
  isFirstInGroup?: boolean
  showDate?: boolean
  dateLabel?: string
}

export function MessageList({ messages, currentUsername, onMessageSelect }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const prevMessageCount = useRef(messages.length)

  // Group messages and add date dividers
  const groupedMessages = useMemo(() => {
    if (messages.length === 0) return []

    const grouped: GroupedMessage[] = []
    let currentDate: Date | null = null
    let previousUser: string | null = null
    let previousTime: Date | null = null

    messages.forEach((message, index) => {
      const messageDate = parseISO(message.createdAt)
      const messageTime = messageDate.getTime()

      // Check if we need a date divider
      if (!currentDate || !isSameDay(currentDate, messageDate)) {
        currentDate = messageDate
        let dateLabel: string

        if (isToday(messageDate)) {
          dateLabel = "Today"
        } else if (isYesterday(messageDate)) {
          dateLabel = "Yesterday"
        } else {
          dateLabel = format(messageDate, "MMMM d, yyyy")
        }

        grouped.push({
          ...message,
          showDate: true,
          dateLabel,
          isFirstInGroup: true,
        })
        previousUser = message.user.name
        previousTime = messageDate
      } else {
        // Check if message should start a new group
        // Group if same user and within 5 minutes
        const timeDiff = previousTime ? (messageTime - previousTime.getTime()) / 1000 / 60 : Infinity
        const isNewGroup = previousUser !== message.user.name || timeDiff > 5

        grouped.push({
          ...message,
          isFirstInGroup: isNewGroup,
        })

        if (isNewGroup) {
          previousUser = message.user.name
        }
        previousTime = messageDate
      }
    })

    return grouped
  }, [messages])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (messages.length > prevMessageCount.current && scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight
      }
    }
    prevMessageCount.current = messages.length
  }, [messages.length])

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-[hsl(var(--chat-muted))] text-sm">
            No messages yet — start the conversation.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea ref={scrollRef} className="h-full">
      <div className="px-4 py-4 space-y-2">
        {groupedMessages.map((message, index) => (
          <div key={message.id}>
            {message.showDate && (
              <DateDivider label={message.dateLabel || ""} />
            )}
            <MessageGroup
              message={message}
              isFirstInGroup={message.isFirstInGroup || false}
              isOwnMessage={message.user.name === currentUsername}
              onSelect={() => onMessageSelect?.(message.id)}
            />
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
