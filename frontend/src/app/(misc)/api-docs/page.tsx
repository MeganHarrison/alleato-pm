'use client'

import { useEffect } from 'react'

export default function ApiDocsPage() {
  useEffect(() => {
    // Keep references for cleanup
    let link: HTMLLinkElement | null = null
    let script: HTMLScriptElement | null = null
    let presetScript: HTMLScriptElement | null = null

    // Import Swagger UI CSS
    link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css'
    document.head.appendChild(link)

    // Import Swagger UI JS
    script = document.createElement('script')
    script.src = 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js'
    script.onload = () => {
      // Initialize Swagger UI after script loads
      if (window.SwaggerUIBundle) {
        // Load standalone preset script first
        presetScript = document.createElement('script')
        presetScript.src = 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js'
        presetScript.onload = () => {
          window.SwaggerUIBundle({
            url: '/openapi.json',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              window.SwaggerUIBundle.presets.apis,
              window.SwaggerUIStandalonePreset
            ],
            plugins: [
              window.SwaggerUIBundle.plugins.DownloadUrl
            ],
            layout: 'StandaloneLayout',
          docExpansion: 'list',
          filter: true,
          tryItOutEnabled: true,
          supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
            onComplete: () => {
              console.log('Swagger UI loaded successfully')
            }
          })
        }
        document.body.appendChild(presetScript)
      }
    }
    document.body.appendChild(script)

    // Cleanup
    return () => {
      if (link && link.parentNode) document.head.removeChild(link)
      if (script && script.parentNode) document.body.removeChild(script)
      if (presetScript && presetScript.parentNode) document.body.removeChild(presetScript)
    }
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
          <p className="mt-2 text-gray-600">
            Interactive documentation for the Alleato Procore API. You can explore endpoints, 
            see request/response schemas, and test API calls directly from this interface.
          </p>
          <div className="mt-4 flex gap-4">
            <a
              href="/openapi.json"
              className="text-blue-600 hover:text-blue-800 underline"
              download
            >
              Download OpenAPI Spec (JSON)
            </a>
            <a
              href="/openapi.yaml"
              className="text-blue-600 hover:text-blue-800 underline"
              download
            >
              Download OpenAPI Spec (YAML)
            </a>
          </div>
        </div>
        <div id="swagger-ui" className="swagger-container" />
      </div>
    </div>
  )
}