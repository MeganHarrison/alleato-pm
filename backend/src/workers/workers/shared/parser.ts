/**
 * Markdown Parsing Utilities
 */

import type { ParsedMeeting, TranscriptLine } from "./types";

// -----------------------------------------------------------------------------
// Content Hash
// -----------------------------------------------------------------------------

export function hashContent(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

// -----------------------------------------------------------------------------
// Parse Fireflies Markdown
// -----------------------------------------------------------------------------

export function parseFirefliesMarkdown(content: string): ParsedMeeting {
  const lines = content.split("\n");

  const firefliesId = extractFirefliesId(content);
  const title = extractTitle(lines);
  const startedAt = extractDate(lines);
  const participants = extractParticipants(lines, content);
  const firefliesSummary = extractSummary(content);
  const firefliesActions = extractActions(content);
  const transcriptLines = extractTranscript(lines);

  // Extract additional metadata - try multiple field name variants
  const firefliesLink = extractMetadataField(content, "Fireflies Link")
    || extractFirefliesLinkFromUrl(content);
  const audioUrl = extractMarkdownLink(content, "Audio Recording")
    || extractMetadataField(content, "Audio Recording")
    || extractMetadataField(content, "Audio");
  const videoUrl = extractMarkdownLink(content, "Video Recording")
    || extractMetadataField(content, "Video Recording")
    || extractMetadataField(content, "Video");
  const durationMinutes = extractDurationMinutes(content);
  const keywords = extractKeywords(content);
  const bulletPoints = extractBulletPoints(content);

  return {
    firefliesId,
    title,
    startedAt,
    endedAt: null,
    participants,
    transcriptLines,
    rawContent: content,
    firefliesSummary,
    firefliesActions,
    firefliesLink,
    durationMinutes,
    audioUrl,
    videoUrl,
    keywords,
    bulletPoints,
  };
}

function extractMetadataField(
  content: string,
  fieldName: string
): string | undefined {
  const regex = new RegExp(`\\*\\*${fieldName}:\\*\\*\\s*(.+)`, "i");
  const match = content.match(regex);
  return match ? match[1].trim() : undefined;
}

function extractDurationMinutes(content: string): number | undefined {
  const match = content.match(/\*\*Duration:\*\*\s*(\d+)\s*minutes/i);
  return match ? parseInt(match[1], 10) : undefined;
}

function extractFirefliesLinkFromUrl(content: string): string | undefined {
  // Extract Fireflies URL from anywhere in the content
  const match = content.match(/(https?:\/\/[^\s]*fireflies\.ai\/view\/[a-zA-Z0-9_-]+)/);
  return match ? match[1] : undefined;
}

function extractMarkdownLink(content: string, linkText: string): string | undefined {
  // Match markdown link format: [Link Text](url)
  // The URL can contain special chars like ~ and encoded values
  const regex = new RegExp(`\\[${linkText}\\]\\(([^\\s)]+)\\)`, "i");
  const match = content.match(regex);
  if (match) return match[1];

  // Also try with - in "## Media Links" section format: - [Link Text](url)
  const listRegex = new RegExp(`-\\s*\\[${linkText}\\]\\(([^\\s)]+)\\)`, "i");
  const listMatch = content.match(listRegex);
  return listMatch ? listMatch[1] : undefined;
}

function extractKeywords(content: string): string[] {
  // Try "## Keywords" section (line after the header)
  const sectionMatch = content.match(/##\s*Keywords\s*\n+([^\n#]+)/i);
  if (sectionMatch) {
    return sectionMatch[1].split(/[,;]/).map(k => k.trim()).filter(k => k);
  }
  // Fallback: Try "**Keywords:**" field
  const fieldMatch = content.match(/\*\*Keywords:\*\*\s*(.+)/i);
  if (fieldMatch) {
    return fieldMatch[1].split(/[,;]/).map(k => k.trim()).filter(k => k);
  }
  return [];
}

function extractBulletPoints(content: string): string[] {
  const bullets: string[] = [];

  // Try "## Summary Bullets" section
  const sectionMatch = content.match(/##\s*Summary Bullets\s*\n([\s\S]*?)(?=\n##|$)/i);
  if (sectionMatch) {
    for (const line of sectionMatch[1].split("\n")) {
      // Match lines starting with emoji or bullet, capture the bold title if present
      const bulletMatch = line.match(/^[ðŸ\-\*•]\s*\*\*([^*]+)\*\*/);
      if (bulletMatch) {
        bullets.push(bulletMatch[1].trim());
      }
    }
    if (bullets.length > 0) return bullets;
  }

  // Fallback: Try "**Summary Bullets:**" field format
  const fieldMatch = content.match(/\*\*Summary Bullets:\*\*\s*\n([\s\S]*?)(?=\n\*\*|\n##|$)/i);
  if (fieldMatch) {
    for (const line of fieldMatch[1].split("\n")) {
      const bulletMatch = line.match(/^[-*]\s*(.+)/);
      if (bulletMatch) {
        bullets.push(bulletMatch[1].trim());
      }
    }
  }
  return bullets;
}

function extractFirefliesId(content: string): string {
  // Try "**ID:**" field (common format) - look for long alphanumeric IDs
  const idFieldMatch = content.match(/\*\*ID:\*\*\s*([A-Z0-9]{20,})/i);
  if (idFieldMatch) return idFieldMatch[1];

  // Try "**Fireflies ID:**" field
  const firefliesIdMatch = content.match(/\*\*Fireflies ID:\*\*\s*([A-Z0-9]{20,})/i);
  if (firefliesIdMatch) return firefliesIdMatch[1];

  // Try extracting from filename pattern in the content (e.g., _01KBAXRX)
  const filenameMatch = content.match(/_([A-Z0-9]{8,})(?:\.md)?/i);
  if (filenameMatch) {
    // If it's a short ID (8-12 chars), look for the full ID nearby
    const shortId = filenameMatch[1];
    const fullIdPattern = new RegExp(`${shortId}[A-Z0-9]*`, 'i');
    const fullIdMatch = content.match(fullIdPattern);
    if (fullIdMatch && fullIdMatch[0].length >= 20) {
      return fullIdMatch[0];
    }
  }

  // Then try extracting from Fireflies URL
  const urlMatch = content.match(/fireflies\.ai\/view\/([a-zA-Z0-9_-]+)/);
  if (urlMatch) return urlMatch[1];

  // IMPORTANT: Don't fallback to hash - throw error instead to prevent duplicates
  throw new Error(`Could not extract valid Fireflies ID from content. Content snippet: ${content.substring(0, 500)}`);
}

function extractTitle(lines: string[]): string {
  for (const line of lines.slice(0, 10)) {
    if (line.startsWith("# ")) {
      return line.slice(2).trim();
    }
  }
  return "Untitled Meeting";
}

function extractDate(lines: string[]): string | null {
  for (const line of lines.slice(0, 20)) {
    // MM/DD/YYYY format
    let match = line.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
    if (match) {
      const [m, d, y] = match[1].split("/");
      return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
    }
    // YYYY-MM-DD format
    match = line.match(/(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1];
  }
  return null;
}

function extractParticipants(lines: string[], content: string): string[] {
  const participants = new Set<string>();

  // From attendees/participants section
  let inAttendees = false;
  for (const line of lines) {
    if (/attendees|participants/i.test(line)) {
      inAttendees = true;
      continue;
    }
    if (inAttendees) {
      if (line.startsWith("#") || line.startsWith("---")) {
        inAttendees = false;
        continue;
      }
      const match = line.match(/^[-*]\s*(.+)/);
      if (match) {
        participants.add(match[1].trim());
      }
    }
  }

  // From transcript speakers
  const speakerPattern = /\[\d{2}:\d{2}\]\s*\*\*([^*]+)\*\*:/g;
  let match;
  while ((match = speakerPattern.exec(content)) !== null) {
    participants.add(match[1].trim());
  }

  // From bold speaker format without timestamps
  const boldSpeakerPattern = /^\*\*([^*]+)\*\*:/gm;
  while ((match = boldSpeakerPattern.exec(content)) !== null) {
    participants.add(match[1].trim());
  }

  return Array.from(participants);
}

function extractSummary(content: string): string {
  const match = content.match(/##\s*Summary\s*\n(.*?)(?=\n##|\Z)/is);
  return match ? match[1].trim() : "";
}

function extractActions(content: string): { text: string }[] {
  const actions: { text: string }[] = [];
  const match = content.match(/##\s*Action Items?\s*\n(.*?)(?=\n##|\Z)/is);
  if (match) {
    for (const line of match[1].split("\n")) {
      const actionMatch = line.match(/^[-*]\s*(.+)/);
      if (actionMatch) {
        actions.push({ text: actionMatch[1].trim() });
      }
    }
  }
  return actions;
}

function extractTranscript(lines: string[]): TranscriptLine[] {
  const transcript: TranscriptLine[] = [];

  // Pattern with timestamp: [MM:SS] **Speaker**: text
  const timestampPattern = /^\[(\d{2}:\d{2})\]\s*\*\*([^*]+)\*\*:\s*(.+)/;

  // Pattern without timestamp: **Speaker**: text followed by lines
  let currentSpeaker = "";
  let inTranscript = false;

  for (const line of lines) {
    // Check if we're in transcript section
    if (line.toLowerCase().includes("## transcript")) {
      inTranscript = true;
      continue;
    }

    if (!inTranscript) continue;

    // End of transcript section
    if (line.startsWith("##") && !line.toLowerCase().includes("transcript")) {
      break;
    }

    const trimmed = line.trim();
    if (!trimmed) continue;

    // Try timestamp pattern first
    const timestampMatch = trimmed.match(timestampPattern);
    if (timestampMatch) {
      transcript.push({
        timestamp: timestampMatch[1],
        speaker: timestampMatch[2].trim(),
        text: timestampMatch[3].trim(),
        index: transcript.length,
      });
      continue;
    }

    // Try bold speaker pattern
    const speakerMatch = trimmed.match(/^\*\*([^*]+)\*\*:?\s*(.*)/);
    if (speakerMatch) {
      currentSpeaker = speakerMatch[1].trim();
      const text = speakerMatch[2].trim();
      if (text) {
        transcript.push({
          timestamp: "",
          speaker: currentSpeaker,
          text,
          index: transcript.length,
        });
      }
      continue;
    }

    // Regular text line - append to current speaker if we have one
    if (currentSpeaker && trimmed) {
      transcript.push({
        timestamp: "",
        speaker: currentSpeaker,
        text: trimmed,
        index: transcript.length,
      });
    }
  }

  return transcript;
}

// -----------------------------------------------------------------------------
// Format transcript for LLM
// -----------------------------------------------------------------------------

export function formatTranscriptForLLM(lines: TranscriptLine[]): string {
  return lines
    .map(
      (l, i) =>
        `[${i}] ${l.timestamp ? `[${l.timestamp}] ` : ""}${l.speaker}: ${l.text}`
    )
    .join("\n");
}
