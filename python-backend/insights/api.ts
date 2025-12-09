// API Request/Response Types for Project Insights Worker

export interface ProjectInsightsRequest {
    documentId?: string;        // Process single document
    batchMode?: boolean;        // Process pending documents
    forceReprocess?: boolean;   // Reprocess completed ones
    limit?: number;            // For batch processing
  }
  
  export interface ProcessDocumentRequest {
    documentId: string;
    forceReprocess?: boolean;
  }
  
  export interface ProcessBatchRequest {
    limit?: number;  // Default: 10
    projectId?: number;  // Filter by specific project
    dateFrom?: string;   // ISO date string
    dateTo?: string;     // ISO date string
  }
  
  export interface HealthResponse {
    status: 'healthy' | 'unhealthy';
    timestamp: string;
    service: string;
    version?: string;
  }
  
  export interface ProcessDocumentResponse {
    success: boolean;
    message: string;
    insightsGenerated?: number;
    projectsAssigned?: number;
    processingTimeMs?: number;
    documentId: string;
    data?: {
      projectAssignments: ProjectAssignmentResult[];
      insights: InsightResult[];
    };
  }
  
  export interface ProcessBatchResponse {
    success: boolean;
    processed: number;
    failed: number;
    totalInsights: number;
    processingTimeMs: number;
    results: BatchProcessingResult[];
    errors?: BatchError[];
  }
  
  export interface BatchProcessingResult {
    documentId: string;
    success: boolean;
    insightsGenerated: number;
    projectsAssigned: number;
    message?: string;
  }
  
  export interface BatchError {
    documentId: string;
    error: string;
    timestamp: string;
  }
  
  export interface ProjectAssignmentResult {
    projectId: number;
    projectName: string;
    confidence: number;
    reasoning: string;
    relevantContent: string;
  }
  
  export interface InsightResult {
    projectId: number;
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
  }
  
  export interface NumericalData {
    value: number;
    unit?: string;
    context: string;
    type?: 'currency' | 'percentage' | 'count' | 'days' | 'other';
  }
  
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
  
  export interface ErrorResponse {
    error: string;
    code?: string;
    details?: any;
    timestamp: string;
  }
  
  // API Route Handlers
  export interface ApiRoutes {
    '/health': {
      GET: {
        request: never;
        response: HealthResponse;
      };
    };
    '/process-document': {
      POST: {
        request: ProcessDocumentRequest;
        response: ProcessDocumentResponse;
      };
    };
    '/process-batch': {
      POST: {
        request: ProcessBatchRequest;
        response: ProcessBatchResponse;
      };
    };
  }
  
  // Worker Environment
  export interface WorkerEnv {
    OPENAI_API_KEY: string;
    SUPABASE_URL: string;
    SUPABASE_SERVICE_ROLE_KEY: string;
    ENVIRONMENT?: 'development' | 'staging' | 'production';
    LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error';
  }
  
  // CORS Configuration
  export interface CorsHeaders {
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Methods': string;
    'Access-Control-Allow-Headers': string;
    'Access-Control-Max-Age'?: string;
  }