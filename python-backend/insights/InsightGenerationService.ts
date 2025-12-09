async generateInsights(
    meetingData: DocumentMetadata,
    projectAssignment: ProjectAssignment
  ): Promise<InsightData[]> {
    
    const prompt = `
  GENERATE PROJECT INSIGHTS
  
  Meeting: "${meetingData.title}"
  Project Focus: "${projectAssignment.reasoning}"
  Relevant Content: "${projectAssignment.relevantContent}"
  
  Full Content Analysis:
  ${meetingData.content}
  
  TASK: Extract specific, actionable insights for this project from the meeting content.
  
  Focus on:
  1. ACTION ITEMS - Specific tasks mentioned
  2. DECISIONS - Choices made or needed
  3. RISKS - Problems or concerns raised
  4. MILESTONES - Important dates or achievements
  5. BLOCKERS - Impediments mentioned
  6. DEPENDENCIES - Cross-team or external dependencies
  7. BUDGET_UPDATE - Cost changes or financial discussions
  8. TIMELINE_CHANGE - Schedule impacts
  
  For each insight:
  - Extract exact quotes that support it
  - Identify any numbers, dates, or metrics
  - Assess business impact
  - Determine severity (low/medium/high/critical)
  - Note stakeholders affected
  - Identify urgency indicators
  
  Output as JSON array:
  [
    {
      "type": "action_item",
      "severity": "medium",
      "title": "Short descriptive title",
      "description": "Detailed description of the insight",
      "confidence": 0.9,
      "exactQuotes": ["Direct quote from meeting"],
      "numericalData": [{"value": 50000, "unit": "USD", "context": "budget increase"}],
      "urgencyIndicators": ["deadline mentioned", "escalation required"],
      "businessImpact": "Impact on project/business",
      "financialImpact": 50000,
      "timelineImpactDays": 14,
      "stakeholdersAffected": ["Team Lead", "Client"]
    }
  ]
  
  Be specific and actionable. Only include insights with confidence > 0.7.
  `;
  
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 3000
    });
  
    try {
      return JSON.parse(response.choices[0]?.message?.content || '[]');
    } catch (error) {
      console.error('Failed to parse insights response:', error);
      return [];
    }
  }