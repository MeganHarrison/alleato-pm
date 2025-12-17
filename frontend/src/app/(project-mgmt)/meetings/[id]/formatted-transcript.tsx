'use client'

import { Card, CardContent } from '@/components/ui/card'
import { User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface FormattedTranscriptProps {
  content: string
}

interface TranscriptEntry {
  speaker: string
  text: string
  timestamp?: string
}

/**
 * Formats a transcript into readable paragraphs with speaker labels
 * Handles various transcript formats including:
 * - Speaker: Text
 * - [Timestamp] Speaker: Text
 * - **Speaker:** Text (markdown format)
 */
export function FormattedTranscript({ content }: FormattedTranscriptProps) {
  const renderMarkdown = (value: string) => (
    <div className="prose prose-sm max-w-none text-gray-700">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          p: ({ node, ...props }) => (
            <p {...props} className="leading-relaxed text-gray-700 last:mb-0" />
          ),
          ul: ({ node, ...props }) => (
            <ul
              {...props}
              className="list-disc pl-6 text-gray-700 space-y-1 last:mb-0"
            />
          ),
          ol: ({ node, ...props }) => (
            <ol
              {...props}
              className="list-decimal pl-6 text-gray-700 space-y-1 last:mb-0"
            />
          ),
          li: ({ node, ...props }) => (
            <li {...props} className="leading-relaxed text-gray-700" />
          ),
          strong: ({ node, ...props }) => (
            <strong {...props} className="text-gray-900" />
          ),
        }}
      >
        {value}
      </ReactMarkdown>
    </div>
  )

  // Parse the transcript content into structured entries
  const parseTranscript = (text: string): TranscriptEntry[] => {
    const entries: TranscriptEntry[] = []

    // Split by lines and process each line
    const lines = text.split('\n').filter(line => line.trim())

    let currentSpeaker = ''
    let currentText = ''

    for (const line of lines) {
      // Check for various speaker formats
      // Format 1: "Speaker: Text" or "Speaker Name: Text"
      const speakerMatch1 = line.match(/^([A-Za-z\s]+):\s*(.+)/)

      // Format 2: "**Speaker:** Text" (markdown bold)
      const speakerMatch2 = line.match(/^\*\*([^*]+)\*\*:\s*(.+)/)

      // Format 3: "[00:00:00] Speaker: Text" (with timestamp)
      const speakerMatch3 = line.match(/^\[(\d{2}:\d{2}:\d{2})\]\s*([A-Za-z\s]+):\s*(.+)/)

      if (speakerMatch3) {
        // Save previous entry if exists
        if (currentSpeaker && currentText) {
          entries.push({ speaker: currentSpeaker, text: currentText.trim() })
        }
        currentSpeaker = speakerMatch3[2].trim()
        currentText = speakerMatch3[3]
      } else if (speakerMatch2) {
        // Save previous entry if exists
        if (currentSpeaker && currentText) {
          entries.push({ speaker: currentSpeaker, text: currentText.trim() })
        }
        currentSpeaker = speakerMatch2[1].trim()
        currentText = speakerMatch2[2]
      } else if (speakerMatch1 && speakerMatch1[1].length < 50) {
        // Only consider it a speaker if the name is reasonably short
        // Save previous entry if exists
        if (currentSpeaker && currentText) {
          entries.push({ speaker: currentSpeaker, text: currentText.trim() })
        }
        currentSpeaker = speakerMatch1[1].trim()
        currentText = speakerMatch1[2]
      } else if (currentSpeaker) {
        // Continuation of previous speaker's text
        currentText += ' ' + line
      } else {
        // No speaker detected yet, treat as general text
        if (!currentSpeaker) {
          currentSpeaker = 'Speaker'
        }
        currentText += (currentText ? ' ' : '') + line
      }
    }

    // Add the last entry
    if (currentSpeaker && currentText) {
      entries.push({ speaker: currentSpeaker, text: currentText.trim() })
    }

    return entries
  }

  const entries = parseTranscript(content)

  // If no structured entries found, fall back to paragraph formatting
  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          {renderMarkdown(content)}
        </CardContent>
      </Card>
    )
  }

  // Render structured transcript with speakers
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {entries.map((entry, index) => (
            <div key={index} className="flex gap-4">
              {/* Speaker Avatar/Icon */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
              </div>

              {/* Speaker Content */}
              <div className="flex-1 space-y-1">
                <div className="font-semibold text-sm text-gray-900">
                  {entry.speaker}
                </div>
                {renderMarkdown(entry.text)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
