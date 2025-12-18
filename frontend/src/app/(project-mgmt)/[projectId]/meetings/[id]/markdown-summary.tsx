'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownSummaryProps {
  content: string
}

/**
 * Renders the summary section markdown with custom styling
 * Used for bullet-point summaries from meeting transcripts
 */
export function MarkdownSummary({ content }: MarkdownSummaryProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <p className="text-sm text-neutral-700 leading-relaxed mb-4 last:mb-0">
            {children}
          </p>
        ),
        ul: ({ children }) => (
          <ul className="space-y-3">
            {children}
          </ul>
        ),
        li: ({ children }) => (
          <li className="flex items-start gap-3 text-sm text-neutral-700 leading-relaxed">
            <span className="text-brand mt-0.5">•</span>
            <span>{children}</span>
          </li>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-neutral-900">
            {children}
          </strong>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
