// Application configuration constants

// API endpoints
export const KNOWLEDGE_DOCUMENTS_URL = '/api/knowledge-documents';
export const KNOWLEDGE_DOCUMENT_FILE_URL = (id: string) => `/api/knowledge-documents/${id}`;
export const getKnowledgeThreadCitationsUrl = (threadId: string) => `/api/knowledge-documents/citations/${threadId}`;

// Theme configuration
export const THEME_STORAGE_KEY = 'alleato-theme';

// Add other configuration constants as needed