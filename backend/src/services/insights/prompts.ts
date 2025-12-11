// AI Prompt Templates for Project Insights Worker

import type { ProjectContext, DocumentMetadata, ProjectAssignmentResult } from '../../types/insights';

export class PromptTemplates {
  
  /**
   * Generate prompt for project assignment analysis
   */
  static projectAssignment(
    meetingData: DocumentMetadata, 
    allProjects: ProjectContext[]
  ): string {
    return `
MEETING ANALYSIS FOR PROJECT ASSIGNMENT

Meeting Details:
- Title: "${meetingData.title || 'Untitled Meeting'}"
- Participants: ${meetingData.participants || 'Not specified'}
- Date: ${meetingData.date || 'Not specified'}
- Category: ${meetingData.category || 'Not specified'}
- Duration: ${meetingData.duration_minutes || 'Unknown'} minutes
- Type: ${meetingData.type || 'Not specified'}

Content Analysis:
${meetingData.content?.substring(0, 3000) || 'No content available'}${meetingData.content && meetingData.content.length > 3000 ? '\n\n[Content truncated - this is a sample]' : ''}

${meetingData.outline ? `\nMeeting Outline:\n${meetingData.outline}` : ''}
${meetingData.bullet_points ? `\nBullet Points:\n${meetingData.bullet_points}` : ''}
${meetingData.action_items ? `\nAction Items:\n${meetingData.action_items}` : ''}

Available Projects:
${allProjects.map((p, index) => `
${index + 1}. PROJECT ID: ${p.id}
   Name: "${p.name}"
   Description: "${p.description || 'No description'}"
   Team Members: ${p.team_members?.join(', ') || 'Not specified'}
   Stakeholders: ${p.stakeholders?.join(', ') || 'Not specified'}
   Keywords: ${p.keywords?.join(', ') || 'Not specified'}
   Phase: ${p.phase || 'Not specified'}
   Category: ${p.category || 'Not specified'}
`).join('\n')}

ANALYSIS INSTRUCTIONS:
1. Carefully analyze the meeting content to identify which project(s) it relates to
2. Look for explicit project name mentions, team member names, specific topics, or keywords
3. Consider the meeting title and participants as strong indicators
4. Pay attention to context clues like project phases, deliverables, or client names

SPECIAL MEETING TYPES:
- Operations meetings: Often discuss multiple projects - identify each one separately
- Executive meetings: May have cross-project content - assign to relevant projects
- Team standups: Usually single-project focused but verify from content
- Client meetings: Match to projects based on client/stakeholder mentions

CONFIDENCE SCORING:
- 0.9-1.0: Explicit project name mentioned, clear team member overlap
- 0.7-0.8: Strong contextual evidence, matching keywords/topics
- 0.5-0.6: Moderate evidence, some matching indicators
- 0.3-0.4: Weak but plausible connection
- Below 0.3: Do not include (insufficient evidence)

OUTPUT FORMAT:
Respond with a JSON array containing only projects with confidence > 0.3:

[
  {
    "projectId": 123,
    "confidence": 0.85,
    "reasoning": "Meeting title explicitly mentions 'Project Alpha' and discusses team members John and Sarah who are assigned to this project. Content covers sprint planning and deliverables specific to this project.",
    "relevantContent": "Direct quotes or content sections that clearly relate to this specific project"
  }
]

IMPORTANT: 
- Be conservative but thorough
- Provide detailed reasoning for each assignment
- Include relevant quotes in relevantContent
- Only assign projects you're confident about
- For multi-project meetings, create separate entries for each project
`;
  }

  /**
   * Generate prompt for insight extraction
   */
  static insightGeneration(
    meetingData: DocumentMetadata,
    projectAssignment: ProjectAssignmentResult,
    projectContext?: ProjectContext
  ): string {
    return `
EXTRACT PROJECT-SPECIFIC INSIGHTS

Meeting Context:
- Title: "${meetingData.title}"
- Date: ${meetingData.date}
- Participants: ${meetingData.participants}
- Duration: ${meetingData.duration_minutes} minutes

Project Focus:
- Project ID: ${projectAssignment.projectId}
- Project: ${projectContext?.name || 'Unknown'}
- Assignment Confidence: ${projectAssignment.confidence}
- Reasoning: ${projectAssignment.reasoning}

Relevant Content for This Project:
${projectAssignment.relevantContent}

Full Meeting Content:
${meetingData.content}

${meetingData.action_items ? `\nExplicit Action Items:\n${meetingData.action_items}` : ''}

EXTRACTION TASK:
Analyze the meeting content and extract specific, actionable insights related to this project only.

INSIGHT TYPES TO IDENTIFY:

1. ACTION_ITEM: Specific tasks, assignments, or to-dos mentioned
   - Look for: "need to", "should", "will", "action item", "follow up"
   - Include: Who, what, when (if mentioned)

2. DECISION: Choices made or approvals given
   - Look for: "decided", "approved", "agreed", "chosen", "selected"
   - Include: What was decided and rationale if mentioned

3. RISK: Problems, concerns, or potential issues raised
   - Look for: "risk", "concern", "problem", "issue", "worried", "challenge"
   - Include: Impact assessment if discussed

4. MILESTONE: Important dates, achievements, or deliverables
   - Look for: "deadline", "launch", "delivery", "completion", dates
   - Include: Timeline and success criteria

5. BLOCKER: Impediments or obstacles preventing progress  
   - Look for: "blocked", "stuck", "waiting for", "dependency", "bottleneck"
   - Include: What's needed to unblock

6. DEPENDENCY: Cross-team or external requirements
   - Look for: "depends on", "waiting for", "need from", "requires"
   - Include: Who/what is needed

7. BUDGET_UPDATE: Financial discussions, cost changes
   - Look for: Dollar amounts, "budget", "cost", "spend", "ROI"
   - Include: Specific numbers and context

8. TIMELINE_CHANGE: Schedule impacts or date changes
   - Look for: "delay", "ahead", "behind", "reschedule", date changes
   - Include: Impact in days/weeks

EXTRACTION REQUIREMENTS:
- Extract exact quotes that support each insight
- Identify any specific numbers, dates, or metrics mentioned
- Assess business impact if discussed
- Determine severity based on language and context used
- Note stakeholders mentioned or affected
- Look for urgency indicators ("urgent", "ASAP", "critical", deadlines)

SEVERITY ASSESSMENT:
- CRITICAL: Major blockers, significant financial impact, urgent deadlines
- HIGH: Important decisions, substantial risks, key milestones
- MEDIUM: Standard action items, moderate concerns, routine updates
- LOW: Minor tasks, informational items, low-impact changes

OUTPUT FORMAT:
Respond with a JSON array of insights. Only include insights with confidence > 0.7:

[
  {
    "type": "action_item",
    "severity": "medium", 
    "title": "Update project timeline documentation",
    "description": "Sarah needs to update the project timeline to reflect the 2-week delay in the backend integration phase due to API dependency issues.",
    "confidence": 0.9,
    "exactQuotes": ["Sarah mentioned 'I need to update our timeline docs to show the 2-week delay'", "The backend integration is delayed because of API issues"],
    "numericalData": [{"value": 14, "unit": "days", "context": "delay in backend integration", "type": "days"}],
    "urgencyIndicators": ["deadline impact", "blocks other work"],
    "businessImpact": "Delays overall project delivery and affects downstream team schedules",
    "timelineImpactDays": 14,
    "stakeholdersAffected": ["Development Team", "QA Team", "Project Manager"],
    "assignee": "Sarah"
  }
]

Be specific, actionable, and precise. Focus only on content clearly related to this specific project.
`;
  }

  /**
   * Generate prompt for insight validation and refinement
   */
  static validateInsights(insights: any[], meetingContent: string): string {
    return `
VALIDATE AND REFINE EXTRACTED INSIGHTS

Original Meeting Content:
${meetingContent.substring(0, 2000)}...

Extracted Insights:
${JSON.stringify(insights, null, 2)}

VALIDATION TASK:
Review each insight and ensure:

1. ACCURACY: Is the insight accurately derived from the meeting content?
2. SPECIFICITY: Is it specific and actionable enough?
3. RELEVANCE: Is it relevant to project management?
4. COMPLETENESS: Are key details captured (who, what, when)?
5. QUOTES: Are the exact quotes accurate and supportive?

REFINEMENT INSTRUCTIONS:
- Remove insights that are too vague or not actionable
- Enhance insights with missing details if available in content
- Correct any inaccuracies in quotes or details
- Merge similar insights if appropriate
- Add missing stakeholders or timeline information

OUTPUT:
Return the validated and refined insights in the same JSON format, keeping only high-quality, actionable insights.
`;
  }

  /**
   * Generate prompt for project context understanding
   */
  static projectContextAnalysis(projects: ProjectContext[]): string {
    return `
ANALYZE PROJECT PORTFOLIO CONTEXT

Projects Overview:
${projects.map(p => `
- ${p.name} (ID: ${p.id})
  Phase: ${p.phase}
  Team: ${p.team_members?.join(', ')}
  Keywords: ${p.keywords?.join(', ')}
`).join('\n')}

ANALYSIS TASK:
Identify patterns, relationships, and context that will help with meeting analysis:

1. Team member overlaps between projects
2. Common keywords and themes
3. Project dependencies or relationships
4. Phase-based groupings
5. Potential naming conventions or aliases

This context will be used to improve project assignment accuracy.
`;
  }
}

// Helper functions for prompt customization
export const PromptHelpers = {
  /**
   * Truncate content while preserving important sections
   */
  truncateContent(content: string, maxLength: number = 3000): string {
    if (content.length <= maxLength) return content;
    
    // Try to break at a sentence boundary
    const truncated = content.substring(0, maxLength);
    const lastSentence = truncated.lastIndexOf('.');
    
    if (lastSentence > maxLength * 0.8) {
      return truncated.substring(0, lastSentence + 1) + '\n\n[Content truncated]';
    }
    
    return truncated + '...\n\n[Content truncated]';
  },

  /**
   * Format participant list for better prompt readability
   */
  formatParticipants(participants: string | string[] | null): string {
    if (!participants) return 'Not specified';
    
    if (Array.isArray(participants)) {
      return participants.join(', ');
    }
    
    // Handle comma-separated string
    if (typeof participants === 'string') {
      return participants.split(',').map(p => p.trim()).join(', ');
    }
    
    return 'Not specified';
  },

  /**
   * Extract key phrases from content for better project matching
   */
  extractKeyPhrases(content: string, limit: number = 10): string[] {
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
    
    const words = content.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.has(word));
    
    const frequency: Record<string, number> = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([word]) => word);
  }
};