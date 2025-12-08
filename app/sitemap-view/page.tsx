'use client';

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  ChevronRight, 
  FileText, 
  LayoutDashboard, 
  DollarSign, 
  FolderOpen, 
  Shield,
  Wrench
} from 'lucide-react';
import Link from 'next/link';
import { staticRoutes, getRoutesByCategory, searchRoutes, SitemapRoute } from '@/lib/sitemap-utils';
import { cn } from '@/lib/utils';

const categoryIcons: Record<string, any> = {
  'Main': LayoutDashboard,
  'Financial': DollarSign,
  'Project Management': FolderOpen,
  'Forms': FileText,
  'Auth': Shield,
  'Utility': Wrench,
};

function RouteCard({ route }: { route: SitemapRoute }) {
  const Icon = categoryIcons[route.category] || FileText;
  
  return (
    <Link href={route.url} className="block">
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-gray-600" />
              <CardTitle className="text-base">{route.title}</CardTitle>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">{route.url}</code>
            <Badge variant="outline" className="text-xs">
              {route.priority ? `Priority: ${route.priority}` : 'Standard'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function RouteTree({ routes, level = 0 }: { routes: SitemapRoute[], level?: number }) {
  return (
    <div className={cn("space-y-1", level > 0 && "ml-4 border-l-2 border-gray-200 pl-4")}>
      {routes.map((route, index) => (
        <div key={route.url}>
          <Link 
            href={route.url}
            className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md transition-colors"
          >
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <span className="text-sm font-medium">{route.title}</span>
            <code className="text-xs bg-gray-100 px-2 py-0.5 rounded ml-auto">{route.url}</code>
          </Link>
          {route.children && route.children.length > 0 && (
            <RouteTree routes={route.children} level={level + 1} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function SitemapPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'tree' | 'cards'>('cards');
  
  const categorizedRoutes = useMemo(() => getRoutesByCategory(), []);
  const searchResults = useMemo(() => {
    if (!searchQuery) return null;
    return searchRoutes(searchQuery);
  }, [searchQuery]);
  
  const totalRoutes = useMemo(() => {
    return Object.values(categorizedRoutes).reduce((acc, routes) => acc + routes.length, 0);
  }, [categorizedRoutes]);

  return (
    <div className="container mx-auto py-10 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Sitemap</h1>
        <p className="text-muted-foreground">
          Explore all {totalRoutes} pages and routes in the application
        </p>
      </div>

      {/* Search and Controls */}
      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search pages by title, URL, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'cards' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('cards')}
          >
            Card View
          </Button>
          <Button
            variant={viewMode === 'tree' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('tree')}
          >
            Tree View
          </Button>
          <div className="ml-auto">
            <Link href="/sitemap.xml" target="_blank">
              <Button variant="outline" size="sm">
                View XML Sitemap
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && searchResults && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Search Results ({searchResults.length})
          </h2>
          {searchResults.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {searchResults.map(route => (
                <RouteCard key={route.url} route={route} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
          )}
        </div>
      )}

      {/* All Routes */}
      {!searchQuery && (
        <>
          {viewMode === 'cards' ? (
            // Card View
            Object.entries(categorizedRoutes).map(([category, routes]) => {
              const Icon = categoryIcons[category] || FileText;
              return (
                <div key={category} className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <h2 className="text-lg font-semibold">{category}</h2>
                    <Badge variant="secondary" className="ml-2">
                      {routes.length} pages
                    </Badge>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {routes.map(route => (
                      <RouteCard key={route.url} route={route} />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            // Tree View
            <Card>
              <CardHeader>
                <CardTitle>Route Tree</CardTitle>
                <CardDescription>
                  Hierarchical view of all application routes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RouteTree routes={staticRoutes} />
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Statistics */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Sitemap Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Total Pages</p>
              <p className="text-2xl font-bold">{totalRoutes}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold">{Object.keys(categorizedRoutes).length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="text-2xl font-bold">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}