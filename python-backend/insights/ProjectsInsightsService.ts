async processDocument(documentId: string, forceReprocess = false) {
    try {
      // 1. Get meeting document
      const { data: document, error: docError } = await this.supabase
        .from('document_metadata')
        .select('*')
        .eq('id', documentId)
        .single();
  
      if (docError || !document) {
        throw new Error(`Document not found: ${docError?.message}`);
      }
  
      // Skip if not a meeting or no content
      if (!document.content || document.content.length < 200) {
        return { success: false, message: 'Document has insufficient content for analysis' };
      }
  
      // Check if already processed
      if (!forceReprocess) {
        const { data: existingInsights } = await this.supabase
          .from('ai_insights')
          .select('id')
          .eq('document_id', documentId)
          .limit(1);
        
        if (existingInsights && existingInsights.length > 0) {
          return { success: true, message: 'Document already processed' };
        }
      }
  
      // 2. Get all available projects for context
      const { data: projects, error: projError } = await this.supabase
        .from('projects')
        .select('id, name, description, team_members, stakeholders, keywords, phase');
  
      if (projError) {
        throw new Error(`Failed to fetch projects: ${projError.message}`);
      }
  
      // 3. Assign projects using AI
      const projectAssignments = await this.assignProjects(document, projects || []);
      
      if (projectAssignments.length === 0) {
        return { success: false, message: 'No projects could be confidently assigned to this meeting' };
      }
  
      // 4. Generate insights for each assigned project
      let totalInsights = 0;
      
      for (const assignment of projectAssignments) {
        const insights = await this.generateInsights(document, assignment);
        
        // 5. Store insights in database
        for (const insight of insights) {
          const { error: insertError } = await this.supabase
            .from('ai_insights')
            .insert({
              project_id: assignment.projectId,
              document_id: documentId,
              insight_type: insight.type,
              severity: insight.severity,
              title: insight.title,
              description: insight.description,
              confidence_score: insight.confidence,
              exact_quotes: insight.exactQuotes || [],
              numerical_data: insight.numericalData || [],
              urgency_indicators: insight.urgencyIndicators || [],
              business_impact: insight.businessImpact,
              financial_impact: insight.financialImpact,
              timeline_impact_days: insight.timelineImpactDays,
              stakeholders_affected: insight.stakeholdersAffected || [],
              status: 'open',
              metadata: {
                meeting_title: document.title,
                meeting_date: document.date,
                project_assignment_confidence: assignment.confidence,
                project_assignment_reasoning: assignment.reasoning
              }
            });
  
          if (insertError) {
            console.error('Failed to insert insight:', insertError);
          } else {
            totalInsights++;
          }
        }
      }
  
      return {
        success: true,
        message: `Generated ${totalInsights} insights for ${projectAssignments.length} projects`,
        insightsGenerated: totalInsights
      };
  
    } catch (error: any) {
      console.error(`Error processing document ${documentId}:`, error);
      return {
        success: false,
        message: error.message || 'Unknown error occurred'
      };
    }
  }