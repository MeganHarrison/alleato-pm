/**
 * Core plugin system types for Alleato-Procore
 * This file defines the plugin architecture interfaces and types
 */

import { z } from 'zod';

// Plugin metadata schema
export const pluginMetadataSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  description: z.string().max(500),
  author: z.object({
    name: z.string(),
    email: z.string().email().optional(),
    url: z.string().url().optional(),
  }),
  repository: z.string().url().optional(),
  homepage: z.string().url().optional(),
  license: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  icon: z.string().optional(), // Base64 or URL
  requiredPermissions: z.array(z.string()).optional(),
  compatibleVersions: z.object({
    min: z.string().regex(/^\d+\.\d+\.\d+$/),
    max: z.string().regex(/^\d+\.\d+\.\d+$/).optional(),
  }),
});

export type PluginMetadata = z.infer<typeof pluginMetadataSchema>;

// Plugin lifecycle hooks
export interface PluginLifecycle {
  onInstall?: () => Promise<void>;
  onEnable?: () => Promise<void>;
  onDisable?: () => Promise<void>;
  onUninstall?: () => Promise<void>;
  onUpdate?: (previousVersion: string) => Promise<void>;
}

// Plugin hook types
export type HookType = 
  | 'before:project:create'
  | 'after:project:create'
  | 'before:project:update'
  | 'after:project:update'
  | 'before:project:delete'
  | 'after:project:delete'
  | 'before:document:upload'
  | 'after:document:upload'
  | 'before:ai:analysis'
  | 'after:ai:analysis'
  | 'menu:project:actions'
  | 'menu:document:actions'
  | 'dashboard:widget'
  | 'project:tab'
  | 'ui:toolbar'
  | 'api:request'
  | 'api:response';

// Hook context for different hook types
export interface HookContext {
  type: HookType;
  data: any;
  user: {
    id: string;
    email: string;
    role: string;
  };
  project?: {
    id: string;
    name: string;
  };
}

// Plugin API interface
export interface PluginAPI {
  // Storage API
  storage: {
    get: (key: string) => Promise<any>;
    set: (key: string, value: any) => Promise<void>;
    delete: (key: string) => Promise<void>;
    clear: () => Promise<void>;
  };
  
  // UI API
  ui: {
    showNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => void;
    showModal: (content: React.ReactNode) => void;
    registerMenuItem: (menu: string, item: MenuItem) => void;
    registerWidget: (widget: DashboardWidget) => void;
    registerTab: (projectId: string, tab: ProjectTab) => void;
  };
  
  // Data API
  data: {
    query: (table: string, query: any) => Promise<any[]>;
    insert: (table: string, data: any) => Promise<any>;
    update: (table: string, id: string, data: any) => Promise<any>;
    delete: (table: string, id: string) => Promise<void>;
  };
  
  // Events API
  events: {
    emit: (event: string, data: any) => void;
    on: (event: string, handler: (data: any) => void) => () => void;
    off: (event: string, handler: (data: any) => void) => void;
  };
  
  // HTTP API
  http: {
    get: (url: string, options?: RequestInit) => Promise<Response>;
    post: (url: string, data: any, options?: RequestInit) => Promise<Response>;
    put: (url: string, data: any, options?: RequestInit) => Promise<Response>;
    delete: (url: string, options?: RequestInit) => Promise<Response>;
  };
}

// Menu item interface
export interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  action: () => void;
  condition?: () => boolean;
}

// Dashboard widget interface
export interface DashboardWidget {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  defaultSize: { w: number; h: number };
  minSize?: { w: number; h: number };
  maxSize?: { w: number; h: number };
}

// Project tab interface
export interface ProjectTab {
  id: string;
  label: string;
  icon?: string;
  component: React.ComponentType<{ projectId: string }>;
  condition?: (project: any) => boolean;
}

// Plugin instance interface
export interface Plugin {
  metadata: PluginMetadata;
  lifecycle?: PluginLifecycle;
  hooks?: {
    [K in HookType]?: (context: HookContext, api: PluginAPI) => Promise<any>;
  };
  components?: {
    settings?: React.ComponentType<{ api: PluginAPI }>;
    [key: string]: React.ComponentType<any> | undefined;
  };
}

// Plugin manifest schema
export const pluginManifestSchema = z.object({
  metadata: pluginMetadataSchema,
  entry: z.string(), // Main entry file
  files: z.array(z.string()),
  dependencies: z.record(z.string(), z.string()).optional(),
  permissions: z.array(z.string()).optional(),
});

export type PluginManifest = z.infer<typeof pluginManifestSchema>;

// Plugin status in the system
export enum PluginStatus {
  INSTALLED = 'installed',
  ENABLED = 'enabled',
  DISABLED = 'disabled',
  ERROR = 'error',
  UPDATING = 'updating',
}

// Plugin database record
export interface PluginRecord {
  id: string;
  manifestUrl?: string;
  manifest: PluginManifest;
  status: PluginStatus;
  installedAt: Date;
  updatedAt: Date;
  enabledAt?: Date;
  disabledAt?: Date;
  settings?: Record<string, any>;
  errorMessage?: string;
}

// Plugin permission types
export enum PluginPermission {
  READ_PROJECTS = 'read:projects',
  WRITE_PROJECTS = 'write:projects',
  READ_DOCUMENTS = 'read:documents',
  WRITE_DOCUMENTS = 'write:documents',
  READ_USERS = 'read:users',
  WRITE_USERS = 'write:users',
  USE_AI = 'use:ai',
  SEND_NOTIFICATIONS = 'send:notifications',
  ACCESS_API = 'access:api',
  MODIFY_UI = 'modify:ui',
  ACCESS_STORAGE = 'access:storage',
}

// Plugin error types
export class PluginError extends Error {
  constructor(
    message: string,
    public code: string,
    public pluginId?: string
  ) {
    super(message);
    this.name = 'PluginError';
  }
}

// Plugin validation result
export interface PluginValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}
