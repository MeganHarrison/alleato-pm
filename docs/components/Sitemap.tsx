import { useConfig } from 'nextra-theme-docs'

export function Sitemap() {
  const config = useConfig()
  const pageMap = (config as any).pageMap

  // Handle case where pageMap is not available during build
  if (!pageMap || !Array.isArray(pageMap)) {
    return (
      <div className="sitemap">
        <h2 className="text-3xl font-bold mb-6">Documentation Sitemap</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Loading sitemap...
        </div>
      </div>
    )
  }

  const renderPageTree = (items: any[], level = 0) => {
    return (
      <ul className={level === 0 ? 'space-y-2' : 'ml-4 mt-2 space-y-1'}>
        {items.map((item, index) => {
          // Skip hidden items
          if (item.display === 'hidden') return null
          
          // Handle folders
          if (item.kind === 'Folder' && item.children) {
            return (
              <li key={index}>
                <div className="font-semibold text-lg mt-4 mb-2">
                  {item.name}
                </div>
                {renderPageTree(item.children, level + 1)}
              </li>
            )
          }
          
          // Handle pages
          if (item.kind === 'MdxPage') {
            const title = item.frontMatter?.title || item.name
            const route = item.route
            
            return (
              <li key={index}>
                <a
                  href={route}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {title}
                </a>
              </li>
            )
          }
          
          return null
        })}
      </ul>
    )
  }

  return (
    <div className="sitemap">
      <h2 className="text-3xl font-bold mb-6">Documentation Sitemap</h2>
      <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Complete overview of all documentation pages
      </div>
      {renderPageTree(pageMap)}
    </div>
  )
}
