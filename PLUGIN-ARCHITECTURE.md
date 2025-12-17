# Plugin Architecture for Alleato-Procore

## Overview

The Alleato-Procore plugin system provides a robust, secure, and extensible architecture for adding custom functionality to the application. Plugins can extend the UI, add new data processing capabilities, integrate with external services, and enhance workflows.

## Architecture Components

### 1. Core Components

- **Plugin Manager** (`/frontend/src/lib/plugins/plugin-manager.ts`) - Central orchestrator for plugin lifecycle
- **Plugin Loader** (`/frontend/src/lib/plugins/plugin-loader.ts`) - Secure plugin loading and sandboxing
- **Plugin Hooks** (`/frontend/src/lib/plugins/plugin-hooks.tsx`) - React integration and event system
- **Plugin Types** (`/frontend/src/types/plugin.types.ts`) - TypeScript definitions

### 2. Database Schema

The plugin system uses several database tables:
- `plugins` - Main plugin registry
- `plugin_permissions` - Permission management
- `plugin_hooks` - Hook registrations
- `plugin_storage` - Plugin data storage
- `plugin_logs` - Audit and debug logs
- `plugin_marketplace` - Future marketplace integration

### 3. UI Components

- **Plugin Manager UI** (`/frontend/src/components/plugins/plugin-manager-ui.tsx`) - Admin interface
- **Settings Page** (`/frontend/src/app/(dashboard)/settings/plugins/page.tsx`) - Plugin management page

## Plugin Structure

### Manifest File (manifest.json)

```json
{
  "metadata": {
    "id": "unique-plugin-id",
    "name": "Plugin Name",
    "version": "1.0.0",
    "description": "Plugin description",
    "author": {
      "name": "Author Name",
      "email": "author@example.com"
    },
    "compatibleVersions": {
      "min": "1.0.0",
      "max": "2.0.0"
    }
  },
  "entry": "./plugin.js",
  "permissions": ["read:projects", "modify:ui"]
}
```

### Plugin Implementation (plugin.js)

```javascript
module.exports = {
  lifecycle: {
    onInstall: async function() { /* Installation logic */ },
    onEnable: async function() { /* Enable logic */ },
    onDisable: async function() { /* Disable logic */ },
    onUninstall: async function() { /* Cleanup logic */ }
  },
  
  hooks: {
    'after:project:create': async function(context, api) {
      // Handle project creation
    },
    'dashboard:widget': async function(context, api) {
      // Register dashboard widgets
    }
  },
  
  components: {
    settings: function SettingsComponent({ api }) {
      // React component for plugin settings
    }
  }
};
```

## Available Hooks

### Data Hooks
- `before:project:create` - Before project creation
- `after:project:create` - After project creation
- `before:project:update` - Before project update
- `after:project:update` - After project update
- `before:project:delete` - Before project deletion
- `after:project:delete` - After project deletion
- `before:document:upload` - Before document upload
- `after:document:upload` - After document upload
- `before:ai:analysis` - Before AI analysis
- `after:ai:analysis` - After AI analysis

### UI Hooks
- `menu:project:actions` - Project action menu items
- `menu:document:actions` - Document action menu items
- `dashboard:widget` - Dashboard widgets
- `project:tab` - Project page tabs
- `ui:toolbar` - Toolbar customizations

### API Hooks
- `api:request` - Before API requests
- `api:response` - After API responses

## Plugin API

Plugins receive an API object with the following capabilities:

### Storage API
```javascript
api.storage.get(key)           // Get stored value
api.storage.set(key, value)    // Set stored value
api.storage.delete(key)        // Delete stored value
api.storage.clear()            // Clear all storage
```

### UI API
```javascript
api.ui.showNotification(message, type)    // Show notification
api.ui.showModal(content)                 // Show modal dialog
api.ui.registerMenuItem(menu, item)       // Add menu item
api.ui.registerWidget(widget)             // Add dashboard widget
api.ui.registerTab(projectId, tab)        // Add project tab
```

### Data API
```javascript
api.data.query(table, query)     // Query database
api.data.insert(table, data)     // Insert record
api.data.update(table, id, data) // Update record
api.data.delete(table, id)       // Delete record
```

### Events API
```javascript
api.events.emit(event, data)        // Emit event
api.events.on(event, handler)       // Listen to event
api.events.off(event, handler)      // Remove listener
```

### HTTP API
```javascript
api.http.get(url, options)           // GET request
api.http.post(url, data, options)    // POST request
api.http.put(url, data, options)     // PUT request
api.http.delete(url, options)        // DELETE request
```

## Security Model

### Sandboxing
- Plugins run in a restricted JavaScript environment
- Limited access to global objects and browser APIs
- No direct DOM access outside provided APIs

### Permissions
Required permissions must be declared in the manifest:
- `read:projects` - Read project data
- `write:projects` - Modify project data
- `read:documents` - Read document data
- `write:documents` - Modify document data
- `read:users` - Read user data
- `write:users` - Modify user data
- `use:ai` - Access AI features
- `send:notifications` - Send notifications
- `access:api` - Make external API calls
- `modify:ui` - Modify user interface
- `access:storage` - Use plugin storage

### Row Level Security (RLS)
- Database access is controlled by RLS policies
- Plugins can only access data they have permission for
- Admin-only operations are protected

## Development Workflow

### 1. Create Plugin Structure
```
my-plugin/
├── manifest.json
├── plugin.js
├── components/
│   └── settings.jsx
└── assets/
    └── icon.svg
```

### 2. Develop Plugin Logic
- Implement required hooks
- Add UI components
- Handle lifecycle events
- Test functionality

### 3. Deploy Plugin
- Host manifest and plugin files
- Install via Plugin Manager UI
- Configure permissions and settings

### 4. Testing
```bash
npm run test:plugins  # Run plugin tests
npm run test:e2e      # Run E2E tests including plugin functionality
```

## Example Plugins

### Audit Logger Plugin
- Tracks all project and document changes
- Provides compliance reporting
- Adds audit log viewer to project menus

**Files:**
- `/frontend/src/plugins/examples/audit-logger/manifest.json`
- `/frontend/src/plugins/examples/audit-logger/plugin.js`

### Weather Widget Plugin
- Shows weather at project sites
- Integrates with OpenWeatherMap API
- Adds dashboard widget and project tab

**Files:**
- `/frontend/src/plugins/examples/weather-widget/manifest.json`
- `/frontend/src/plugins/examples/weather-widget/plugin.js`

## Integration Points

### React Integration
```tsx
import { PluginProvider, usePluginHook } from '@/lib/plugins/plugin-hooks';

// Wrap your app
<PluginProvider>
  <App />
</PluginProvider>

// Use hooks in components
const menuItems = usePluginMenuItems('project-actions');
const widgets = usePluginWidgets();
```

### Database Integration
```sql
-- Enable plugin system
\i backend/migrations/create_plugin_tables.sql

-- Grant permissions
GRANT USAGE ON SCHEMA plugins TO authenticated;
```

## Best Practices

### Plugin Development
1. **Follow semantic versioning** for plugin releases
2. **Minimize permissions** - only request what you need
3. **Handle errors gracefully** - don't break the host application
4. **Use storage efficiently** - clean up unused data
5. **Provide clear documentation** for your plugin

### Performance
1. **Lazy load components** when possible
2. **Cache API responses** to reduce external calls
3. **Debounce expensive operations**
4. **Use efficient data structures**

### Security
1. **Validate all inputs** from external sources
2. **Use HTTPS** for all external API calls
3. **Don't store sensitive data** in plugin storage
4. **Follow principle of least privilege**

## Troubleshooting

### Common Issues

1. **Plugin won't load**
   - Check manifest syntax and required fields
   - Verify entry file is accessible
   - Check browser console for errors

2. **Permission denied**
   - Verify required permissions in manifest
   - Check RLS policies in database
   - Ensure user has appropriate role

3. **Hooks not firing**
   - Verify hook type names are correct
   - Check plugin is enabled and loaded
   - Review plugin logs in database

### Debugging Tools

1. **Browser DevTools** - Check console for errors
2. **Plugin Logs** - View in plugin_logs table
3. **Network Tab** - Monitor API calls
4. **React DevTools** - Debug component state

## Future Enhancements

### Planned Features
- **Plugin Marketplace** - Centralized plugin distribution
- **Plugin Templates** - Scaffolding for new plugins
- **Plugin Analytics** - Usage and performance metrics
- **Plugin Versioning** - Automatic update system
- **Plugin Dependencies** - Inter-plugin relationships

### Extension Points
- **Custom Data Sources** - Plugin-defined data connectors
- **Workflow Engine** - Plugin-driven automation
- **Custom Reports** - Plugin-generated reports
- **AI Extensions** - Plugin-enhanced AI capabilities

## Contributing

To contribute to the plugin system:

1. Review the architecture documentation
2. Follow the coding conventions
3. Add tests for new features
4. Update documentation
5. Submit pull requests

## Support

For plugin development support:
- Check the example plugins in `/frontend/src/plugins/examples/`
- Review the test files in `/frontend/tests/e2e/plugins.spec.ts`
- Consult the TypeScript definitions in `/frontend/src/types/plugin.types.ts`

---

This plugin architecture provides a solid foundation for extending Alleato-Procore while maintaining security, performance, and usability.