/**
 * Plugin System Context and Integration Points
 * Provides integration with the main application
 */

import React, { createContext, useContext } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { HookContext } from '@/types/plugin.types';

// Context for sharing application state with plugins
interface AppContextForPlugins {
  user: {
    id: string;
    email: string;
    role: string;
  } | null;
  currentProject?: {
    id: string;
    name: string;
  };
  supabase: ReturnType<typeof createClient>;
}

const AppPluginContext = createContext<AppContextForPlugins | null>(null);

/**
 * Provider that shares app context with plugins
 */
export function AppPluginContextProvider({
  children,
  projectId,
  projectName,
  user: providedUser,
}: {
  children: React.ReactNode;
  projectId?: string;
  projectName?: string;
  user?: { id: string; email: string; role: string };
}) {
  const supabase = createClient();

  const context: AppContextForPlugins = {
    user: providedUser || null,
    currentProject: projectId ? {
      id: projectId,
      name: projectName || '',
    } : undefined,
    supabase,
  };

  return (
    <AppPluginContext.Provider value={context}>
      {children}
    </AppPluginContext.Provider>
  );
}

/**
 * Hook to access app context in plugin-aware components
 */
export function useAppPluginContext() {
  const context = useContext(AppPluginContext);
  if (!context) {
    throw new Error('useAppPluginContext must be used within AppPluginContextProvider');
  }
  return context;
}

/**
 * Create hook context from app context
 */
export function createHookContext(
  type: HookContext['type'],
  data: any,
  appContext: AppContextForPlugins
): HookContext {
  return {
    type,
    data,
    user: appContext.user || {
      id: 'anonymous',
      email: '',
      role: 'guest',
    },
    project: appContext.currentProject,
  };
}

/**
 * Integration points for common operations
 */
export const pluginIntegration = {
  /**
   * Wrap a Supabase query with plugin hooks
   */
  async wrapSupabaseQuery<T>(
    operation: () => Promise<T>,
    table: string,
    action: 'select' | 'insert' | 'update' | 'delete',
    data?: any
  ): Promise<T> {
    // Import dynamically to avoid circular dependencies
    const { pluginManager } = await import('./plugin-manager');
    const context = createHookContext(
      'api:request' as any,
      { table, action, data },
      {} as AppContextForPlugins // This would come from context
    );

    // Execute before hooks
    await pluginManager.executeHooks('api:request' as any, context);

    try {
      // Execute operation
      const result = await operation();

      // Execute after hooks
      await pluginManager.executeHooks('api:response' as any, {
        ...context,
        data: { ...context.data, result },
      });

      return result;
    } catch (error) {
      // Execute error hooks
      await pluginManager.executeHooks('api:response' as any, {
        ...context,
        data: { ...context.data, error },
      });

      throw error;
    }
  },

  /**
   * Wrap a component with plugin enhancement
   */
  enhanceComponent<P extends object>(
    Component: React.ComponentType<P>,
    hookTypes: {
      mount?: HookContext['type'];
      unmount?: HookContext['type'];
      render?: HookContext['type'];
    }
  ): React.ComponentType<P> {
    return (props: P) => {
      const appContext = useAppPluginContext();
      
      React.useEffect(() => {
        if (hookTypes.mount) {
          const mountContext = createHookContext(
            hookTypes.mount,
            props,
            appContext
          );
          
          import('./plugin-manager').then(({ pluginManager }) => {
            pluginManager.executeHooks(hookTypes.mount!, mountContext);
          });
        }

        return () => {
          if (hookTypes.unmount) {
            const unmountContext = createHookContext(
              hookTypes.unmount,
              props,
              appContext
            );
            
            import('./plugin-manager').then(({ pluginManager }) => {
              pluginManager.executeHooks(hookTypes.unmount!, unmountContext);
            });
          }
        };
      }, []);

      // Execute render hooks if specified
      if (hookTypes.render) {
        const renderContext = createHookContext(
          hookTypes.render,
          props,
          appContext
        );
        
        import('./plugin-manager').then(({ pluginManager }) => {
          pluginManager.executeHooks(hookTypes.render!, renderContext);
        });
      }

      return <Component {...props} />;
    };
  },
};