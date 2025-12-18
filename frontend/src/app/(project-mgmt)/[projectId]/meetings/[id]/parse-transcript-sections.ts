/**
 * Parses markdown-formatted meeting content into distinct sections
 *
 * Expected format:
 * # Meeting Title
 * **Date:** ...
 * **Duration:** ...
 *
 * ## Summary
 * - Bullet points
 *
 * ## Gist
 * Short description paragraph
 *
 * ## Keywords
 * keyword1, keyword2, keyword3
 *
 * ## Transcript
 * **0:**
 * Actual conversation...
 */

export interface ParsedTranscriptSections {
  summary: string | null
  gist: string | null
  keywords: string | null
  transcript: string | null
}

export function parseTranscriptSections(content: string): ParsedTranscriptSections {
  // Extract Summary section (everything between ## Summary and next ## heading)
  const summaryMatch = content.match(/## Summary\s*([\s\S]*?)(?=##|$)/i)
  const summary = summaryMatch?.[1]?.trim() || null

  // Extract Gist section (everything between ## Gist and next ## heading)
  const gistMatch = content.match(/## Gist\s*([\s\S]*?)(?=##|$)/i)
  const gist = gistMatch?.[1]?.trim() || null

  // Extract Keywords section (everything between ## Keywords and next ## heading)
  const keywordsMatch = content.match(/## Keywords\s*([\s\S]*?)(?=##|$)/i)
  const keywords = keywordsMatch?.[1]?.trim() || null

  // Extract Transcript section (everything after ## Transcript heading to end of document)
  const transcriptMatch = content.match(/## Transcript\s*([\s\S]*)/i)
  const transcript = transcriptMatch?.[1]?.trim() || null

  return {
    summary,
    gist,
    keywords,
    transcript
  }
}
