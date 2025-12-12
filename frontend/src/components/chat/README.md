# Realtime Chat Implementation

This folder contains the realtime chat functionality implemented using Supabase Realtime Broadcast, following the guidelines from [Supabase UI Docs](https://supabase.com/ui/docs/nextjs/realtime-chat).

## Components

### 1. RealtimeChat Component (`/components/realtime-chat.tsx`)
The main chat component that provides:
- Real-time message broadcasting
- Message display with user identification
- Auto-scrolling chat interface
- Connection status handling

### 2. ChatMessageItem Component (`/components/chat/chat-message.tsx`)
Individual message display component with:
- User name and timestamp display
- Own vs other message styling
- Grouped messages from same user

### 3. Hooks

#### useRealtimeChat (`/hooks/use-realtime-chat.tsx`)
- Manages Supabase Realtime channel subscription
- Handles message broadcasting
- Maintains connection status

#### useChatScroll (`/hooks/use-chat-scroll.tsx`)
- Auto-scrolls chat to bottom on new messages
- Smooth scrolling behavior

## Usage Example

```tsx
import { RealtimeChat } from '@/components/realtime-chat'

export default function ChatPage() {
  return (
    <RealtimeChat 
      roomName="my-chat-room"     // Unique identifier for the chat room
      username="john_doe"          // Current user's display name
      onMessage={(messages) => {   // Optional: Handle messages (e.g., save to DB)
        console.log('New messages:', messages)
      }}
      messages={[]}               // Optional: Pre-load with historical messages
    />
  )
}
```

## Key Features

1. **Real-time Communication**: Uses Supabase Realtime Broadcast for instant message delivery
2. **Room-based Isolation**: Each `roomName` creates a separate chat channel
3. **No Persistence**: Messages are ephemeral by default (not stored in database)
4. **Flexible Storage**: Use `onMessage` callback to implement custom persistence
5. **Connection Status**: Visual indicators for connection state
6. **Optimistic Updates**: Messages appear instantly for the sender

## Team Chat Implementation

See `/app/(procore)/team-chat/page.tsx` for a complete example with:
- Multiple chat channels (tabs)
- Username customization
- Message callbacks for optional persistence
- Channel isolation demonstration

## Testing

Run the team chat tests:
```bash
npm test -- tests/team-chat.spec.ts
```

Or use the dedicated config:
```bash
npx playwright test --config=config/playwright/playwright.config.team-chat.ts
```

## Architecture Notes

- **Broadcast Only**: Messages are not stored by default
- **Low Latency**: Optimized for real-time communication
- **Scalable**: Handles many concurrent users per room
- **Flexible**: Can be paired with database storage via callbacks