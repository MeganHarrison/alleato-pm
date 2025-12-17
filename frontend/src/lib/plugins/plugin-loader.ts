/**
 * Plugin Loader with sandboxing and security
 * Handles safe loading and execution of plugin code
 */

import { PluginError } from '@/types/plugin.types';
import type { Plugin, PluginManifest } from '@/types/plugin.types';

export interface LoaderOptions {
  timeout?: number; // Max execution time in ms
  memoryLimit?: number; // Max memory usage in MB (future enhancement)
  allowedGlobals?: string[]; // Additional globals to expose
}

export class PluginLoader {
  private static readonly DEFAULT_TIMEOUT = 5000; // 5 seconds
  private static readonly SAFE_GLOBALS = [
    'console',
    'setTimeout',
    'setInterval',
    'clearTimeout',
    'clearInterval',
    'Promise',
    'Date',
    'Math',
    'JSON',
    'Object',
    'Array',
    'String',
    'Number',
    'Boolean',
    'Map',
    'Set',
    'WeakMap',
    'WeakSet',
    'Error',
    'TypeError',
    'RangeError',
    'SyntaxError',
  ];

  /**
   * Load plugin from URL
   */
  static async loadFromUrl(
    url: string,
    manifest: PluginManifest,
    options: LoaderOptions = {}
  ): Promise<Plugin> {
    try {
      // Fetch plugin code
      const response = await fetch(url, {
        signal: AbortSignal.timeout(options.timeout || this.DEFAULT_TIMEOUT),
      });
      
      if (!response.ok) {
        throw new PluginError(
          `Failed to fetch plugin: ${response.statusText}`,
          'FETCH_ERROR',
          manifest.metadata.id
        );
      }
      
      const code = await response.text();
      
      // Validate code size
      const maxSize = 5 * 1024 * 1024; // 5MB limit
      if (code.length > maxSize) {
        throw new PluginError(
          'Plugin code exceeds maximum size limit',
          'SIZE_LIMIT_EXCEEDED',
          manifest.metadata.id
        );
      }
      
      // Load and evaluate
      return this.loadFromCode(code, manifest, options);
    } catch (error) {
      if (error instanceof PluginError) {
        throw error;
      }
      throw new PluginError(
        `Failed to load plugin: ${error}`,
        'LOAD_ERROR',
        manifest.metadata.id
      );
    }
  }

  /**
   * Load plugin from code string
   */
  static loadFromCode(
    code: string,
    manifest: PluginManifest,
    options: LoaderOptions = {}
  ): Plugin {
    // Create sandboxed environment
    const sandbox = this.createSandbox(manifest, options);
    
    // Wrap code in IIFE with injected dependencies
    const wrappedCode = this.wrapPluginCode(code, manifest);
    
    try {
      // Create isolated function
      const pluginFactory = new Function(
        ...Object.keys(sandbox),
        wrappedCode
      );
      
      // Execute with sandboxed context
      const pluginModule = pluginFactory(...Object.values(sandbox));
      
      // Validate plugin structure
      const plugin = this.validatePlugin(pluginModule, manifest);
      
      return plugin;
    } catch (error) {
      throw new PluginError(
        `Plugin evaluation failed: ${error}`,
        'EVALUATION_ERROR',
        manifest.metadata.id
      );
    }
  }

  /**
   * Create sandboxed environment for plugin execution
   */
  private static createSandbox(
    manifest: PluginManifest,
    options: LoaderOptions
  ): Record<string, any> {
    const sandbox: Record<string, any> = {};
    
    // Add safe globals
    for (const global of this.SAFE_GLOBALS) {
      if (global in globalThis) {
        sandbox[global] = (globalThis as any)[global];
      }
    }
    
    // Add allowed additional globals
    if (options.allowedGlobals) {
      for (const global of options.allowedGlobals) {
        if (global in globalThis && !sandbox[global]) {
          sandbox[global] = (globalThis as any)[global];
        }
      }
    }
    
    // Add plugin-specific utilities
    sandbox.pluginMetadata = manifest.metadata;
    
    // Add restricted fetch
    sandbox.fetch = this.createRestrictedFetch(manifest);
    
    // Add React (if needed by plugin)
    if (manifest.dependencies?.react) {
      sandbox.React = (window as any).React;
      sandbox.ReactDOM = (window as any).ReactDOM;
    }
    
    return sandbox;
  }

  /**
   * Create a restricted fetch function for plugins
   */
  private static createRestrictedFetch(manifest: PluginManifest) {
    return async (url: string, options?: RequestInit) => {
      // Check if URL is allowed
      const allowedDomains = manifest.permissions?.includes('access:api')
        ? [] // No restrictions if API access is granted
        : ['api.alleato.com', 'localhost:3000']; // Default allowed domains
      
      const urlObj = new URL(url, window.location.href);
      
      if (allowedDomains.length > 0 && !allowedDomains.includes(urlObj.hostname)) {
        throw new Error(`Plugin not allowed to fetch from ${urlObj.hostname}`);
      }
      
      // Add plugin identifier to headers
      const headers = new Headers(options?.headers);
      headers.set('X-Plugin-ID', manifest.metadata.id);
      
      return fetch(url, { ...options, headers });
    };
  }

  /**
   * Wrap plugin code for safe execution
   */
  private static wrapPluginCode(code: string, manifest: PluginManifest): string {
    return `
      'use strict';
      
      // Plugin: ${manifest.metadata.name} v${manifest.metadata.version}
      
      try {
        // Create module scope
        const module = { exports: {} };
        const exports = module.exports;
        
        // Plugin code
        ${code}
        
        // Return module exports
        return module.exports.default || module.exports;
      } catch (error) {
        throw new Error('Plugin initialization failed: ' + error.message);
      }
    `;
  }

  /**
   * Validate plugin structure and capabilities
   */
  private static validatePlugin(pluginModule: any, manifest: PluginManifest): Plugin {
    // Ensure we have a valid plugin object
    if (!pluginModule || typeof pluginModule !== 'object') {
      throw new Error('Plugin must export an object');
    }
    
    // Create plugin instance
    const plugin: Plugin = {
      metadata: manifest.metadata,
      lifecycle: pluginModule.lifecycle,
      hooks: pluginModule.hooks,
      components: pluginModule.components,
    };
    
    // Validate lifecycle methods
    if (plugin.lifecycle) {
      const lifecycleMethods = [
        'onInstall',
        'onEnable',
        'onDisable',
        'onUninstall',
        'onUpdate',
      ];
      
      for (const method of Object.keys(plugin.lifecycle)) {
        if (!lifecycleMethods.includes(method)) {
          throw new Error(`Unknown lifecycle method: ${method}`);
        }
        
        if (typeof (plugin.lifecycle as any)[method] !== 'function') {
          throw new Error(`Lifecycle method ${method} must be a function`);
        }
      }
    }
    
    // Validate hooks
    if (plugin.hooks) {
      for (const [hookType, handler] of Object.entries(plugin.hooks)) {
        if (typeof handler !== 'function') {
          throw new Error(`Hook handler for ${hookType} must be a function`);
        }
      }
    }
    
    // Validate components
    if (plugin.components) {
      for (const [name, component] of Object.entries(plugin.components)) {
        if (component && typeof component !== 'function') {
          throw new Error(`Component ${name} must be a React component`);
        }
      }
    }
    
    return plugin;
  }

  /**
   * Create a plugin from inline code (useful for development)
   */
  static createInlinePlugin(
    metadata: Plugin['metadata'],
    implementation: Partial<Plugin>
  ): Plugin {
    return {
      metadata,
      lifecycle: implementation.lifecycle,
      hooks: implementation.hooks,
      components: implementation.components,
    };
  }
}

/**
 * Helper function to load plugin from URL
 */
export async function loadPlugin(
  manifestUrl: string,
  options?: LoaderOptions
): Promise<Plugin> {
  // Fetch manifest
  const manifestResponse = await fetch(manifestUrl);
  if (!manifestResponse.ok) {
    throw new Error(`Failed to fetch manifest: ${manifestResponse.statusText}`);
  }
  
  const manifest: PluginManifest = await manifestResponse.json();
  
  // Resolve entry URL relative to manifest
  const entryUrl = new URL(manifest.entry, manifestUrl).href;
  
  // Load plugin
  return PluginLoader.loadFromUrl(entryUrl, manifest, options);
}

/**
 * Create a simple plugin for testing
 */
export function createTestPlugin(
  name: string,
  hooks: Plugin['hooks'] = {}
): Plugin {
  return PluginLoader.createInlinePlugin(
    {
      id: `test-${name}-${Date.now()}`,
      name,
      version: '1.0.0',
      description: `Test plugin: ${name}`,
      author: { name: 'Test Author' },
      compatibleVersions: { min: '1.0.0' },
    },
    { hooks }
  );
}