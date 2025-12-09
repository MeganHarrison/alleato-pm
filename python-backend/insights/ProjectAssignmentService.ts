async assignProjects(
    meetingData: DocumentMetadata, 
    allProjects: ProjectContext[]
  ): Promise<ProjectAssignment[]> {
    
    const prompt = `
  MEETING ANALYSIS FOR PROJECT ASSIGNMENT
  
  Meeting Details:
  - Title: "${meetingData.title}"
  - Participants: ${meetingData.participants}
  - Date: ${meetingData.date}
  - Category: ${meetingData.category}
  - Duration: ${meetingData.duration_minutes} minutes
  
  Content Sample:
  ${meetingData.content?.substring(0, 2000)}...
  
  Available Projects:
  ${allProjects.map(p => `
  - ID: ${p.id}
  - Name: "${p.name}"
  - Description: "${p.description}"
  - Team: ${p.team_members?.join(', ')}
  - Keywords: ${p.keywords?.join(', ')}
  - Phase: ${p.phase}
  `).join('\n')}
  
  TASK: Analyze this meeting and determine which project(s) it relates to.
  
  SPECIAL CASES:
  - Operations meetings may discuss multiple projects
  - Executive meetings may have cross-project content
  - Look for project names, team member mentions, specific topics
  - Consider if this is a single-project focused meeting or multi-project
  
  For each relevant project, provide:
  1. Project ID
  2. Confidence (0.0-1.0)
  3. Reasoning (why this project is relevant)
  4. Relevant content sections
  
  Output as JSON array with this structure:
  [
    {
      "projectId": 123,
      "confidence": 0.85,
      "reasoning": "Meeting title mentions [project name] and discusses [specific topics]",
      "relevantContent": "Specific quotes or sections that relate to this project"
    }
  ]
  
  Only include projects with confidence > 0.3. Be conservative but thorough.
  `;
  
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 2000
    });
  
    try {
      return JSON.parse(response.choices[0]?.message?.content || '[]');
    } catch (error) {
      console.error('Failed to parse project assignment response:', error);
      return [];
    }
  }