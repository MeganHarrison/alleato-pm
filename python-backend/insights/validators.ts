// Input validation helpers for Project Insights Worker

import type { 
    ProcessDocumentRequest, 
    ProcessBatchRequest, 
    InsightData, 
    ProjectAssignmentResult,
    DocumentMetadata,
    ProjectContext,
    InsightType,
    InsightSeverity,
    InsightStatus
  } from '../../types/insights';
  
  export interface ValidationResult<T = any> {
    isValid: boolean;
    data?: T;
    errors: string[];
    warnings?: string[];
  }
  
  export class InputValidators {
    
    /**
     * Validate process document request
     */
    static processDocumentRequest(input: any): ValidationResult<ProcessDocumentRequest> {
      const errors: string[] = [];
      const warnings: string[] = [];
      
      if (!input || typeof input !== 'object') {
        return { isValid: false, errors: ['Request body must be an object'] };
      }
      
      // Required fields
      if (!input.documentId || typeof input.documentId !== 'string') {
        errors.push('documentId is required and must be a string');
      } else if (input.documentId.trim().length === 0) {
        errors.push('documentId cannot be empty');
      } else if (input.documentId.length > 255) {
        errors.push('documentId is too long (max 255 characters)');
      }
      
      // Optional fields
      if (input.forceReprocess !== undefined && typeof input.forceReprocess !== 'boolean') {
        errors.push('forceReprocess must be a boolean');
      }
      
      const data: ProcessDocumentRequest = {
        documentId: input.documentId?.trim(),
        forceReprocess: input.forceReprocess || false
      };
      
      return {
        isValid: errors.length === 0,
        data: errors.length === 0 ? data : undefined,
        errors,
        warnings
      };
    }
    
    /**
     * Validate process batch request
     */
    static processBatchRequest(input: any): ValidationResult<ProcessBatchRequest> {
      const errors: string[] = [];
      const warnings: string[] = [];
      
      if (!input || typeof input !== 'object') {
        return { isValid: false, errors: ['Request body must be an object'] };
      }
      
      // Optional numeric fields
      if (input.limit !== undefined) {
        if (!Number.isInteger(input.limit) || input.limit < 1 || input.limit > 100) {
          errors.push('limit must be an integer between 1 and 100');
        }
      }
      
      if (input.projectId !== undefined) {
        if (!Number.isInteger(input.projectId) || input.projectId < 1) {
          errors.push('projectId must be a positive integer');
        }
      }
      
      // Optional date fields
      if (input.dateFrom !== undefined) {
        if (!this.isValidISODate(input.dateFrom)) {
          errors.push('dateFrom must be a valid ISO date string');
        }
      }
      
      if (input.dateTo !== undefined) {
        if (!this.isValidISODate(input.dateTo)) {
          errors.push('dateTo must be a valid ISO date string');
        }
      }
      
      // Validate date range
      if (input.dateFrom && input.dateTo) {
        const fromDate = new Date(input.dateFrom);
        const toDate = new Date(input.dateTo);
        if (fromDate >= toDate) {
          errors.push('dateFrom must be before dateTo');
        }
      }
      
      const data: ProcessBatchRequest = {
        limit: input.limit || 10,
        projectId: input.projectId,
        dateFrom: input.dateFrom,
        dateTo: input.dateTo
      };
      
      return {
        isValid: errors.length === 0,
        data: errors.length === 0 ? data : undefined,
        errors,
        warnings
      };
    }
    
    /**
     * Validate document metadata for processing
     */
    static documentMetadata(input: any): ValidationResult<DocumentMetadata> {
      const errors: string[] = [];
      const warnings: string[] = [];
      
      if (!input || typeof input !== 'object') {
        return { isValid: false, errors: ['Document metadata must be an object'] };
      }
      
      // Required fields
      if (!input.id || typeof input.id !== 'string') {
        errors.push('Document id is required and must be a string');
      }
      
      // Content validation - critical for insights generation
      if (!input.content || typeof input.content !== 'string') {
        errors.push('Document content is required and must be a string');
      } else if (input.content.trim().length < 100) {
        errors.push('Document content is too short for meaningful analysis (minimum 100 characters)');
      } else if (input.content.trim().length < 200) {
        warnings.push('Document content is short, may result in fewer insights');
      }
      
      // Optional fields validation
      if (input.title !== undefined && typeof input.title !== 'string') {
        errors.push('title must be a string');
      }
      
      if (input.participants !== undefined && typeof input.participants !== 'string') {
        errors.push('participants must be a string');
      }
      
      if (input.duration_minutes !== undefined) {
        if (!Number.isInteger(input.duration_minutes) || input.duration_minutes < 0) {
          errors.push('duration_minutes must be a non-negative integer');
        }
      }
      
      if (input.date !== undefined && !this.isValidISODate(input.date)) {
        errors.push('date must be a valid ISO date string');
      }
      
      if (input.project_id !== undefined) {
        if (!Number.isInteger(input.project_id) || input.project_id < 1) {
          errors.push('project_id must be a positive integer');
        }
      }
      
      return {
        isValid: errors.length === 0,
        data: errors.length === 0 ? input as DocumentMetadata : undefined,
        errors,
        warnings
      };
    }
    
    /**
     * Validate project assignment result from AI
     */
    static projectAssignment(input: any): ValidationResult<ProjectAssignmentResult> {
      const errors: string[] = [];
      const warnings: string[] = [];
      
      if (!input || typeof input !== 'object') {
        return { isValid: false, errors: ['Project assignment must be an object'] };
      }
      
      // Required fields
      if (!Number.isInteger(input.projectId) || input.projectId < 1) {
        errors.push('projectId must be a positive integer');
      }
      
      if (typeof input.confidence !== 'number' || input.confidence < 0 || input.confidence > 1) {
        errors.push('confidence must be a number between 0 and 1');
      } else if (input.confidence < 0.3) {
        warnings.push('Low confidence score may indicate uncertain project assignment');
      }
      
      if (!input.reasoning || typeof input.reasoning !== 'string') {
        errors.push('reasoning is required and must be a string');
      } else if (input.reasoning.length < 20) {
        errors.push('reasoning is too brief (minimum 20 characters)');
      }
      
      if (!input.relevantContent || typeof input.relevantContent !== 'string') {
        errors.push('relevantContent is required and must be a string');
      } else if (input.relevantContent.length < 10) {
        errors.push('relevantContent is too brief (minimum 10 characters)');
      }
      
      return {
        isValid: errors.length === 0,
        data: errors.length === 0 ? input as ProjectAssignmentResult : undefined,
        errors,
        warnings
      };
    }
    
    /**
     * Validate insight data from AI extraction
     */
    static insightData(input: any): ValidationResult<InsightData> {
      const errors: string[] = [];
      const warnings: string[] = [];
      
      if (!input || typeof input !== 'object') {
        return { isValid: false, errors: ['Insight data must be an object'] };
      }
      
      // Type validation
      if (!input.type || !this.isValidInsightType(input.type)) {
        errors.push(`type must be one of: ${this.getValidInsightTypes().join(', ')}`);
      }
      
      // Severity validation
      if (!input.severity || !this.isValidInsightSeverity(input.severity)) {
        errors.push(`severity must be one of: ${this.getValidInsightSeverities().join(', ')}`);
      }
      
      // Required string fields
      if (!input.title || typeof input.title !== 'string') {
        errors.push('title is required and must be a string');
      } else if (input.title.length > 200) {
        errors.push('title is too long (max 200 characters)');
      } else if (input.title.length < 5) {
        errors.push('title is too short (minimum 5 characters)');
      }
      
      if (!input.description || typeof input.description !== 'string') {
        errors.push('description is required and must be a string');
      } else if (input.description.length > 2000) {
        errors.push('description is too long (max 2000 characters)');
      } else if (input.description.length < 10) {
        errors.push('description is too short (minimum 10 characters)');
      }
      
      // Confidence validation
      if (typeof input.confidence !== 'number' || input.confidence < 0 || input.confidence > 1) {
        errors.push('confidence must be a number between 0 and 1');
      } else if (input.confidence < 0.5) {
        warnings.push('Low confidence score may indicate uncertain insight');
      }
      
      // Optional array fields
      if (input.exactQuotes !== undefined) {
        if (!Array.isArray(input.exactQuotes)) {
          errors.push('exactQuotes must be an array of strings');
        } else if (input.exactQuotes.some(q => typeof q !== 'string')) {
          errors.push('All exactQuotes must be strings');
        } else if (input.exactQuotes.length === 0) {
          warnings.push('No exact quotes provided - reduces insight credibility');
        }
      }
      
      if (input.urgencyIndicators !== undefined) {
        if (!Array.isArray(input.urgencyIndicators)) {
          errors.push('urgencyIndicators must be an array of strings');
        } else if (input.urgencyIndicators.some(i => typeof i !== 'string')) {
          errors.push('All urgencyIndicators must be strings');
        }
      }
      
      if (input.stakeholdersAffected !== undefined) {
        if (!Array.isArray(input.stakeholdersAffected)) {
          errors.push('stakeholdersAffected must be an array of strings');
        } else if (input.stakeholdersAffected.some(s => typeof s !== 'string')) {
          errors.push('All stakeholdersAffected must be strings');
        }
      }
      
      // Optional numeric fields
      if (input.financialImpact !== undefined) {
        if (typeof input.financialImpact !== 'number') {
          errors.push('financialImpact must be a number');
        }
      }
      
      if (input.timelineImpactDays !== undefined) {
        if (!Number.isInteger(input.timelineImpactDays)) {
          errors.push('timelineImpactDays must be an integer');
        }
      }
      
      // Optional string fields
      if (input.assignee !== undefined && typeof input.assignee !== 'string') {
        errors.push('assignee must be a string');
      }
      
      if (input.dueDate !== undefined && !this.isValidISODate(input.dueDate)) {
        errors.push('dueDate must be a valid ISO date string');
      }
      
      return {
        isValid: errors.length === 0,
        data: errors.length === 0 ? input as InsightData : undefined,
        errors,
        warnings
      };
    }
    
    /**
     * Validate array of insights
     */
    static insightDataArray(input: any[]): ValidationResult<InsightData[]> {
      const errors: string[] = [];
      const warnings: string[] = [];
      const validInsights: InsightData[] = [];
      
      if (!Array.isArray(input)) {
        return { isValid: false, errors: ['Input must be an array of insights'] };
      }
      
      if (input.length === 0) {
        warnings.push('No insights provided');
      } else if (input.length > 50) {
        errors.push('Too many insights (max 50 per document)');
      }
      
      input.forEach((insight, index) => {
        const validation = this.insightData(insight);
        if (validation.isValid && validation.data) {
          validInsights.push(validation.data);
        } else {
          validation.errors.forEach(error => {
            errors.push(`Insight ${index + 1}: ${error}`);
          });
        }
      });
      
      return {
        isValid: errors.length === 0,
        data: errors.length === 0 ? validInsights : undefined,
        errors,
        warnings
      };
    }
    
    /**
     * Validate project context data
     */
    static projectContext(input: any): ValidationResult<ProjectContext> {
      const errors: string[] = [];
      const warnings: string[] = [];
      
      if (!input || typeof input !== 'object') {
        return { isValid: false, errors: ['Project context must be an object'] };
      }
      
      // Required fields
      if (!Number.isInteger(input.id) || input.id < 1) {
        errors.push('id must be a positive integer');
      }
      
      if (!input.name || typeof input.name !== 'string') {
        errors.push('name is required and must be a string');
      } else if (input.name.length > 200) {
        errors.push('name is too long (max 200 characters)');
      }
      
      // Optional array fields
      const arrayFields = ['team_members', 'stakeholders', 'keywords', 'aliases'];
      arrayFields.forEach(field => {
        if (input[field] !== undefined) {
          if (!Array.isArray(input[field])) {
            errors.push(`${field} must be an array of strings`);
          } else if (input[field].some((item: any) => typeof item !== 'string')) {
            errors.push(`All ${field} must be strings`);
          }
        }
      });
      
      // Optional string fields
      const stringFields = ['description', 'phase', 'category', 'status'];
      stringFields.forEach(field => {
        if (input[field] !== undefined && typeof input[field] !== 'string') {
          errors.push(`${field} must be a string`);
        }
      });
      
      return {
        isValid: errors.length === 0,
        data: errors.length === 0 ? input as ProjectContext : undefined,
        errors,
        warnings
      };
    }
    
    // Helper methods
    private static isValidISODate(date: string): boolean {
      try {
        const parsed = new Date(date);
        return parsed instanceof Date && !isNaN(parsed.getTime()) && date.includes('-');
      } catch {
        return false;
      }
    }
    
    private static isValidInsightType(type: string): type is InsightType {
      return this.getValidInsightTypes().includes(type as InsightType);
    }
    
    private static isValidInsightSeverity(severity: string): severity is InsightSeverity {
      return this.getValidInsightSeverities().includes(severity as InsightSeverity);
    }
    
    private static isValidInsightStatus(status: string): status is InsightStatus {
      return this.getValidInsightStatuses().includes(status as InsightStatus);
    }
    
    private static getValidInsightTypes(): InsightType[] {
      return [
        'action_item',
        'decision', 
        'risk',
        'milestone',
        'fact',
        'blocker',
        'dependency',
        'budget_update',
        'timeline_change',
        'stakeholder_feedback',
        'technical_debt'
      ];
    }
    
    private static getValidInsightSeverities(): InsightSeverity[] {
      return ['low', 'medium', 'high', 'critical'];
    }
    
    private static getValidInsightStatuses(): InsightStatus[] {
      return ['open', 'in_progress', 'completed', 'cancelled'];
    }
  }
  
  /**
   * Content quality validators
   */
  export class ContentValidators {
    
    /**
     * Assess content quality for insights generation
     */
    static assessContentQuality(content: string): {
      score: number; // 0-1
      issues: string[];
      recommendations: string[];
    } {
      const issues: string[] = [];
      const recommendations: string[] = [];
      let score = 1.0;
      
      // Length assessment
      if (content.length < 200) {
        score -= 0.4;
        issues.push('Content is very short');
        recommendations.push('Ensure transcript is complete');
      } else if (content.length < 500) {
        score -= 0.2;
        issues.push('Content is somewhat short');
      }
      
      // Structure assessment
      if (!content.includes('.') && !content.includes('?') && !content.includes('!')) {
        score -= 0.2;
        issues.push('Content lacks sentence structure');
        recommendations.push('Check if content is properly formatted text');
      }
      
      // Meeting indicators
      const meetingIndicators = [
        'meeting', 'discussion', 'agenda', 'action item', 'decision',
        'follow up', 'next steps', 'timeline', 'deadline', 'project'
      ];
      const hasIndicators = meetingIndicators.some(indicator => 
        content.toLowerCase().includes(indicator)
      );
      
      if (!hasIndicators) {
        score -= 0.3;
        issues.push('Content does not appear to be from a meeting');
        recommendations.push('Verify this is meeting transcript content');
      }
      
      // Repetitive content check
      const words = content.toLowerCase().split(/\s+/);
      const uniqueWords = new Set(words);
      const repetitionRatio = uniqueWords.size / words.length;
      
      if (repetitionRatio < 0.3) {
        score -= 0.2;
        issues.push('Content appears highly repetitive');
        recommendations.push('Review content for quality issues');
      }
      
      // Actionable content indicators
      const actionIndicators = [
        'need to', 'should', 'will', 'must', 'action', 'task', 
        'assign', 'responsible', 'due', 'by when', 'follow up'
      ];
      const hasActionContent = actionIndicators.some(indicator => 
        content.toLowerCase().includes(indicator)
      );
      
      if (hasActionContent) {
        score += 0.1; // Bonus for actionable content
      } else {
        recommendations.push('Content may lack actionable items');
      }
      
      return {
        score: Math.max(0, Math.min(1, score)),
        issues,
        recommendations
      };
    }
    
    /**
     * Extract and validate participant information
     */
    static validateParticipants(participants: string | null): {
      isValid: boolean;
      normalizedParticipants: string[];
      warnings: string[];
    } {
      const warnings: string[] = [];
      
      if (!participants || participants.trim().length === 0) {
        return {
          isValid: false,
          normalizedParticipants: [],
          warnings: ['No participants information provided']
        };
      }
      
      // Parse participants (handle various formats)
      let participantList: string[] = [];
      
      if (participants.includes(',')) {
        participantList = participants.split(',').map(p => p.trim());
      } else if (participants.includes(';')) {
        participantList = participants.split(';').map(p => p.trim());
      } else if (participants.includes('\n')) {
        participantList = participants.split('\n').map(p => p.trim());
      } else {
        participantList = [participants.trim()];
      }
      
      // Filter out empty entries
      participantList = participantList.filter(p => p.length > 0);
      
      // Validate participant names
      participantList = participantList.filter(participant => {
        if (participant.length < 2) {
          warnings.push(`Participant name too short: "${participant}"`);
          return false;
        }
        if (participant.length > 100) {
          warnings.push(`Participant name too long: "${participant}"`);
          return false;
        }
        return true;
      });
      
      if (participantList.length === 0) {
        warnings.push('No valid participants after parsing');
      } else if (participantList.length === 1) {
        warnings.push('Only one participant - meetings typically have multiple participants');
      }
      
      return {
        isValid: participantList.length > 0,
        normalizedParticipants: participantList,
        warnings
      };
    }
  }
  
  /**
   * AI response validators
   */
  export class AIResponseValidators {
    
    /**
     * Validate AI-generated project assignments
     */
    static validateProjectAssignments(
      response: string,
      availableProjectIds: number[]
    ): ValidationResult<ProjectAssignmentResult[]> {
      const errors: string[] = [];
      const warnings: string[] = [];
      
      try {
        const parsed = JSON.parse(response);
        
        if (!Array.isArray(parsed)) {
          return { isValid: false, errors: ['AI response must be an array of project assignments'] };
        }
        
        const validAssignments: ProjectAssignmentResult[] = [];
        
        parsed.forEach((assignment, index) => {
          const validation = InputValidators.projectAssignment(assignment);
          
          if (validation.isValid && validation.data) {
            // Additional validation: check if project ID exists
            if (!availableProjectIds.includes(validation.data.projectId)) {
              errors.push(`Assignment ${index + 1}: Project ID ${validation.data.projectId} not found in available projects`);
              return;
            }
            
            validAssignments.push(validation.data);
          } else {
            validation.errors.forEach(error => {
              errors.push(`Assignment ${index + 1}: ${error}`);
            });
          }
        });
        
        // Check for duplicate project assignments
        const projectIds = validAssignments.map(a => a.projectId);
        const uniqueProjectIds = new Set(projectIds);
        if (projectIds.length !== uniqueProjectIds.size) {
          warnings.push('Duplicate project assignments detected');
        }
        
        return {
          isValid: errors.length === 0,
          data: errors.length === 0 ? validAssignments : undefined,
          errors,
          warnings
        };
        
      } catch (parseError) {
        return {
          isValid: false,
          errors: [`Failed to parse AI response as JSON: ${parseError}`]
        };
      }
    }
    
    /**
     * Validate AI-generated insights
     */
    static validateInsightGeneration(response: string): ValidationResult<InsightData[]> {
      const errors: string[] = [];
      const warnings: string[] = [];
      
      try {
        const parsed = JSON.parse(response);
        
        if (!Array.isArray(parsed)) {
          return { isValid: false, errors: ['AI response must be an array of insights'] };
        }
        
        return InputValidators.insightDataArray(parsed);
        
      } catch (parseError) {
        return {
          isValid: false,
          errors: [`Failed to parse AI response as JSON: ${parseError}`]
        };
      }
    }
  }