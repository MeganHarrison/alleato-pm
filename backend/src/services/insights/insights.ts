// Types for Project Insights and Analysis

// Core insight types matching database schema
export interface InsightData {
    type: InsightType;
    severity: InsightSeverity;
    title: string;
    description: string;
    confidence: number;
    exactQuotes: string[];
    numericalData?: NumericalData[];
    urgencyIndicators?: string[];
    businessImpact?: string;
    financialImpact?: number;
    timelineImpactDays?: number;
    stakeholdersAffected?: string[];
    assignee?: string;
    dueDate?: string;
    status?: InsightStatus;
    metadata?: Record<string, any>;
  }
  
  // Database record structure for ai_insights table
  export interface AIInsightRecord {
    id?: number;
    project_id: number;
    document_id?: string;
    insight_type: InsightType;
    severity: InsightSeverity;
    title: string;
    description: string;
    confidence_score: number;
    exact_quotes?: string[] | Record<string, any>;
    numerical_data?: NumericalData[] | Record<string, any>;
    urgency_indicators?: string[];
    business_impact?: string;
    financial_impact?: number;
    timeline_impact_days?: number;
    stakeholders_affected?: string[];
    status?: InsightStatus;
    assigned_to?: string;
    assignee?: string;
    due_date?: string;
    created_at?: string;
    resolved?: number;
    resolved_at?: string;
    meeting_id?: string;
    meeting_name?: string;
    project_name?: string;
    meeting_date?: string;
    chunks_id?: string;
    cross_project_impact?: number[];
    dependencies?: Record<string, any>[];
    metadata?: Record<string, any>;
  }
  
  // Insight classification types
  export type InsightType = 
    | 'action_item'
    | 'decision'
    | 'risk'
    | 'milestone'
    | 'fact'
    | 'blocker'
    | 'dependency'
    | 'budget_update'
    | 'timeline_change'
    | 'stakeholder_feedback'
    | 'technical_debt';
  
  export type InsightSeverity = 'low' | 'medium' | 'high' | 'critical';
  
  export type InsightStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
  
  // Project assignment and analysis
  export interface ProjectAssignmentResult {
    projectId: number;
    projectName?: string;
    confidence: number;
    reasoning: string;
    relevantContent: string;
  }
  
  export interface ProjectContext {
    id: number;
    name: string;
    description?: string;
    team_members?: string[];
    stakeholders?: string[];
    keywords?: string[];
    phase?: string;
    category?: string;
    status?: string;
    aliases?: string[];
  }
  
  // Document and meeting data structures
  export interface DocumentMetadata {
    id: string;
    title?: string;
    url?: string;
    created_at?: string;
    type?: string;
    source?: string;
    content?: string;
    summary?: string;
    transcript_url?: string;
    participants?: string;
    tags?: string;
    category?: string;
    storage_bucket_path?: string;
    fireflies_id?: string;
    fireflies_link?: string;
    project_id?: number;
    project?: string;
    date?: string;
    outline?: string;
    duration_minutes?: number;
    bullet_points?: string;
    action_items?: string;
    created_by?: string;
    entities?: Record<string, any>;
  }
  
  // Numerical data structure for insights
  export interface NumericalData {
    value: number;
    unit?: string;
    context: string;
    type?: 'currency' | 'percentage' | 'count' | 'days' | 'hours' | 'other';
    confidence?: number;
  }
  
  // Analysis results and processing
  export interface MeetingAnalysis {
    documentId: string;
    projectAssignments: ProjectAssignmentResult[];
    insights: InsightData[];
    processingMetadata: {
      totalProjects: number;
      totalInsights: number;
      processingTimeMs: number;
      aiModelUsed: string;
      confidenceThreshold: number;
    };
  }
  
  export interface ProcessingResult {
    success: boolean;
    documentId: string;
    projectsAssigned: number;
    insightsGenerated: number;
    message: string;
    errors?: string[];
    analysis?: MeetingAnalysis;
  }
  
  // AI processing configuration
  export interface AIProcessingConfig {
    projectAssignment: {
      confidenceThreshold: number;
      model: string;
      temperature: number;
      maxTokens: number;
    };
    insightGeneration: {
      confidenceThreshold: number;
      model: string;
      temperature: number;
      maxTokens: number;
    };
    contentProcessing: {
      maxContentLength: number;
      enableContentTruncation: boolean;
      preserveActionItems: boolean;
    };
  }
  
  // Batch processing types
  export interface BatchProcessingOptions {
    limit?: number;
    projectId?: number;
    dateFrom?: string;
    dateTo?: string;
    forceReprocess?: boolean;
    processingStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  }
  
  export interface BatchProcessingStats {
    totalDocuments: number;
    processedSuccessfully: number;
    processingFailed: number;
    totalInsightsGenerated: number;
    averageInsightsPerDocument: number;
    processingTimeMs: number;
  }
  
  // Validation and quality assurance
  export interface InsightValidation {
    isValid: boolean;
    score: number;  // 0-1
    issues: string[];
    suggestions: string[];
  }
  
  export interface QualityMetrics {
    averageConfidence: number;
    insightTypeDistribution: Record<InsightType, number>;
    severityDistribution: Record<InsightSeverity, number>;
    projectCoverage: number;
    duplicateCount: number;
  }
  
  // Error handling
  export interface ProcessingError {
    documentId: string;
    stage: 'project_assignment' | 'insight_generation' | 'database_storage';
    error: string;
    timestamp: string;
    context?: Record<string, any>;
  }
  
  // Search and filtering
  export interface InsightSearchCriteria {
    projectIds?: number[];
    insightTypes?: InsightType[];
    severities?: InsightSeverity[];
    statuses?: InsightStatus[];
    dateFrom?: string;
    dateTo?: string;
    assignedTo?: string;
    textSearch?: string;
    confidenceMin?: number;
    hasFinancialImpact?: boolean;
    hasTimelineImpact?: boolean;
  }
  
  export interface InsightSearchResult {
    insights: AIInsightRecord[];
    totalCount: number;
    facets: {
      types: Record<InsightType, number>;
      severities: Record<InsightSeverity, number>;
      statuses: Record<InsightStatus, number>;
      projects: Record<string, number>;
    };
  }
  
  // Meeting pattern analysis
  export interface MeetingPattern {
    meetingType: 'single_project' | 'multi_project' | 'operations' | 'executive' | 'standup' | 'client';
    confidence: number;
    indicators: string[];
    expectedProjectCount: number;
    processingStrategy: 'standard' | 'multi_project_aware' | 'cross_project';
  }
  
  // Stakeholder and team analysis
  export interface StakeholderContext {
    name: string;
    role?: string;
    projects?: number[];
    email?: string;
    department?: string;
    isDecisionMaker?: boolean;
  }
  
  export interface TeamContext {
    projectId: number;
    teamMembers: StakeholderContext[];
    stakeholders: StakeholderContext[];
    keyContacts: StakeholderContext[];
  }
  
  // Timeline and scheduling
  export interface TimelineImpact {
    originalDate?: string;
    newDate?: string;
    delayDays?: number;
    accelerationDays?: number;
    impactReason: string;
    affectedMilestones?: string[];
    cascadeEffects?: string[];
  }
  
  // Financial impact analysis
  export interface FinancialImpact {
    amount: number;
    currency: string;
    impactType: 'cost_increase' | 'cost_decrease' | 'revenue_impact' | 'budget_reallocation';
    confidence: number;
    timeframe?: string;
    justification: string;
  }
  
  // Cross-project dependencies
  export interface CrossProjectDependency {
    sourceProjectId: number;
    targetProjectId: number;
    dependencyType: 'blocks' | 'requires' | 'informs' | 'shares_resource';
    description: string;
    criticality: InsightSeverity;
    estimatedResolutionDays?: number;
  }
  
  // Export commonly used type unions
  export type InsightSortField = 
    | 'created_at' 
    | 'severity' 
    | 'confidence_score' 
    | 'financial_impact' 
    | 'timeline_impact_days'
    | 'project_id';
  
  export type SortOrder = 'asc' | 'desc';
  
  export interface SortOptions {
    field: InsightSortField;
    order: SortOrder;
  }