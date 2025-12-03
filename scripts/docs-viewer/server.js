#!/usr/bin/env node

/**
 * Markdown Documentation Viewer
 * Automatically serves all markdown files in a directory as browseable web pages
 */

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const marked = require('marked');
const hljs = require('highlight.js');

const app = express();
const PORT = process.env.PORT || 3333;

// Configure marked with syntax highlighting
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return code;
  },
  breaks: true,
  gfm: true
});

// Serve static assets
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// HTML template for pages
const htmlTemplate = (title, content, navigation) => `
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Alleato Docs</title>
    <link rel="stylesheet" href="/assets/github-markdown.css">
    <link rel="stylesheet" href="/assets/highlight.css">
    <link rel="stylesheet" href="/assets/custom.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>📚 Alleato Documentation</h1>
            <div class="actions">
                <button id="theme-toggle" title="Toggle theme">🌙</button>
                <a href="/" class="home-link">Home</a>
            </div>
        </header>
        
        <div class="layout">
            <nav class="sidebar">
                <div class="nav-wrapper">
                    ${navigation}
                </div>
            </nav>
            
            <main class="content markdown-body">
                ${content}
            </main>
        </div>
    </div>
    
    <script>
        // Theme toggle
        const toggle = document.getElementById('theme-toggle');
        const html = document.documentElement;
        const currentTheme = localStorage.getItem('theme') || 'light';
        html.setAttribute('data-theme', currentTheme);
        toggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
        
        toggle.addEventListener('click', () => {
            const newTheme = html.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            toggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
        });
        
        // Highlight current page in nav
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll('.sidebar a');
        links.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    </script>
</body>
</html>
`;

// Root directory for documentation (configurable)
const DOCS_ROOT = process.argv[2] || process.cwd();

// Recursively find all markdown files
async function findMarkdownFiles(dir, baseDir = dir) {
  const files = [];
  const items = await fs.readdir(dir, { withFileTypes: true });
  
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    
    // Skip node_modules and hidden directories
    if (item.name.startsWith('.') || item.name === 'node_modules') continue;
    
    if (item.isDirectory()) {
      const subFiles = await findMarkdownFiles(fullPath, baseDir);
      files.push(...subFiles);
    } else if (item.name.endsWith('.md') || item.name.endsWith('.markdown')) {
      const relativePath = path.relative(baseDir, fullPath);
      files.push({
        path: fullPath,
        relativePath: relativePath,
        name: item.name,
        urlPath: '/' + relativePath.replace(/\\/g, '/').replace(/\.md$/, '')
      });
    }
  }
  
  return files;
}

// Generate navigation menu
function generateNavigation(files, currentPath) {
  const tree = {};
  
  // Build directory tree
  files.forEach(file => {
    const parts = file.relativePath.split(path.sep);
    let current = tree;
    
    parts.forEach((part, index) => {
      if (index === parts.length - 1) {
        // It's a file
        if (!current._files) current._files = [];
        current._files.push({
          name: part,
          urlPath: file.urlPath,
          isActive: file.urlPath === currentPath
        });
      } else {
        // It's a directory
        if (!current[part]) current[part] = {};
        current = current[part];
      }
    });
  });
  
  // Generate HTML from tree
  function renderTree(node, level = 0) {
    let html = '';
    
    // Render root level files first if at top level
    if (level === 0 && node._files) {
      html += '<div class="nav-section">';
      html += '<ul class="nav-list">';
      node._files.forEach(file => {
        const displayName = file.name.replace(/\.md$/, '').replace(/-/g, ' ')
          .replace(/readme/i, 'Overview')
          .replace(/claude/i, 'Claude instructions');
        const className = file.isActive ? 'active' : '';
        html += `<li><a href="${file.urlPath}" class="${className}">${displayName}</a></li>`;
      });
      html += '</ul>';
      html += '</div>';
    }
    
    // Render directories
    Object.keys(node).sort().forEach(key => {
      if (key === '_files') return;
      
      html += `<div class="nav-section">`;
      // Format directory name
      const formattedName = key
        .replace(/-/g, ' ')
        .replace(/multi agent setup/i, 'multi-agent setup')
        .replace(/procore screenshot capture/i, 'procore screenshot capture');
      
      html += `<h${Math.min(level + 3, 6)} class="nav-header">${formattedName}</h${Math.min(level + 3, 6)}>`;
      
      // Render sub-files first
      if (node[key]._files) {
        html += '<ul class="nav-list">';
        node[key]._files.forEach(file => {
          const displayName = file.name.replace(/\.md$/, '')
            .replace(/-/g, ' ')
            .replace(/readme/i, 'Overview')
            .replace(/claude/i, 'Claude instructions');
          const className = file.isActive ? 'active' : '';
          html += `<li><a href="${file.urlPath}" class="${className}">${displayName}</a></li>`;
        });
        html += '</ul>';
      }
      
      // Then render subdirectories
      const subDirs = Object.keys(node[key]).filter(k => k !== '_files');
      if (subDirs.length > 0) {
        html += renderTree(node[key], level + 1);
      }
      
      html += `</div>`;
    });
    
    return html;
  }
  
  return renderTree(tree);
}

// Serve markdown files
app.get('*', async (req, res) => {
  try {
    const urlPath = req.path === '/' ? '/README' : req.path;
    const mdPath = path.join(DOCS_ROOT, urlPath + '.md');
    
    // Check if file exists
    try {
      await fs.access(mdPath);
    } catch {
      // Try without .md extension (in case URL already has it)
      const altPath = path.join(DOCS_ROOT, urlPath);
      try {
        await fs.access(altPath);
      } catch {
        return res.status(404).send(htmlTemplate(
          '404 Not Found',
          '<h1>404 - Page Not Found</h1><p>The requested documentation page does not exist.</p>',
          await generateNavigationHTML()
        ));
      }
    }
    
    // Read and convert markdown
    const markdown = await fs.readFile(mdPath, 'utf-8');
    const html = marked.parse(markdown);
    
    // Get all files for navigation
    const files = await findMarkdownFiles(DOCS_ROOT);
    const navigation = generateNavigation(files, urlPath);
    
    // Extract title from first H1 or filename
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : path.basename(mdPath, '.md');
    
    res.send(htmlTemplate(title, html, navigation));
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(htmlTemplate(
      'Error',
      `<h1>Error</h1><p>Failed to load documentation: ${error.message}</p>`,
      ''
    ));
  }
});

// Helper to generate navigation for error pages
async function generateNavigationHTML() {
  try {
    const files = await findMarkdownFiles(DOCS_ROOT);
    return generateNavigation(files, '');
  } catch {
    return '<p>Unable to load navigation</p>';
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`
📚 Markdown Documentation Viewer
================================

Serving docs from: ${DOCS_ROOT}
View at: http://localhost:${PORT}

Tips:
- All .md files are automatically served
- Navigate using the sidebar
- Toggle between light/dark theme
- URL structure mirrors file structure

Press Ctrl+C to stop
  `);
});