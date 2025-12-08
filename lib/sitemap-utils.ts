import { readdirSync, statSync } from 'fs';
import { join } from 'path';

export interface SitemapRoute {
  url: string;
  title: string;
  category: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  children?: SitemapRoute[];
}

// Define static routes with metadata
export const staticRoutes: SitemapRoute[] = [
  {
    url: '/',
    title: 'Portfolio',
    category: 'Main',
    priority: 1.0,
    changeFrequency: 'daily',
  },
  {
    url: '/dashboard',
    title: 'Dashboard',
    category: 'Main',
    priority: 0.9,
    changeFrequency: 'daily',
  },
  {
    url: '/projects',
    title: 'Projects',
    category: 'Project Management',
    priority: 0.8,
    changeFrequency: 'weekly',
    children: [
      {
        url: '/create-project',
        title: 'Create Project',
        category: 'Forms',
        priority: 0.7,
        changeFrequency: 'monthly',
      },
    ],
  },
  {
    url: '/financial',
    title: 'Financial',
    category: 'Financial',
    priority: 0.8,
    changeFrequency: 'weekly',
    children: [
      {
        url: '/budget',
        title: 'Budget',
        category: 'Financial',
        priority: 0.8,
        changeFrequency: 'weekly',
        children: [
          {
            url: '/budget/line-item/new',
            title: 'New Budget Line Item',
            category: 'Forms',
            priority: 0.7,
            changeFrequency: 'monthly',
          },
        ],
      },
      {
        url: '/contracts',
        title: 'Prime Contracts',
        category: 'Financial',
        priority: 0.8,
        changeFrequency: 'weekly',
        children: [
          {
            url: '/contracts/new',
            title: 'New Prime Contract',
            category: 'Forms',
            priority: 0.7,
            changeFrequency: 'monthly',
          },
        ],
      },
      {
        url: '/commitments',
        title: 'Commitments',
        category: 'Financial',
        priority: 0.8,
        changeFrequency: 'weekly',
        children: [
          {
            url: '/commitments/new',
            title: 'New Commitment',
            category: 'Forms',
            priority: 0.7,
            changeFrequency: 'monthly',
          },
        ],
      },
      {
        url: '/change-orders',
        title: 'Change Orders',
        category: 'Financial',
        priority: 0.8,
        changeFrequency: 'weekly',
        children: [
          {
            url: '/change-orders/new',
            title: 'New Change Order',
            category: 'Forms',
            priority: 0.7,
            changeFrequency: 'monthly',
          },
        ],
      },
      {
        url: '/invoices',
        title: 'Invoices',
        category: 'Financial',
        priority: 0.8,
        changeFrequency: 'weekly',
        children: [
          {
            url: '/invoices/new',
            title: 'New Invoice',
            category: 'Forms',
            priority: 0.7,
            changeFrequency: 'monthly',
          },
        ],
      },
    ],
  },
  {
    url: '/forms',
    title: 'Forms',
    category: 'Forms',
    priority: 0.7,
    changeFrequency: 'monthly',
    children: [
      {
        url: '/create-rfi',
        title: 'Create RFI',
        category: 'Forms',
        priority: 0.6,
        changeFrequency: 'monthly',
      },
    ],
  },
  {
    url: '/auth',
    title: 'Authentication',
    category: 'Auth',
    priority: 0.5,
    changeFrequency: 'yearly',
    children: [
      {
        url: '/auth/login',
        title: 'Login',
        category: 'Auth',
        priority: 0.5,
        changeFrequency: 'yearly',
      },
      {
        url: '/auth/sign-up',
        title: 'Sign Up',
        category: 'Auth',
        priority: 0.5,
        changeFrequency: 'yearly',
      },
      {
        url: '/auth/forgot-password',
        title: 'Forgot Password',
        category: 'Auth',
        priority: 0.4,
        changeFrequency: 'yearly',
      },
    ],
  },
  {
    url: '/sitemap-view',
    title: 'Sitemap',
    category: 'Utility',
    priority: 0.3,
    changeFrequency: 'monthly',
  },
];

// Function to get all routes flattened for XML sitemap
export function getAllRoutesFlat(): SitemapRoute[] {
  const routes: SitemapRoute[] = [];
  
  function flattenRoutes(routeList: SitemapRoute[], parentUrl = '') {
    routeList.forEach(route => {
      routes.push({
        ...route,
        url: route.url, // URLs are already absolute in our structure
      });
      
      if (route.children) {
        flattenRoutes(route.children, route.url);
      }
    });
  }
  
  flattenRoutes(staticRoutes);
  return routes;
}

// Function to get routes organized by category
export function getRoutesByCategory(): Record<string, SitemapRoute[]> {
  const categorized: Record<string, SitemapRoute[]> = {};
  const allRoutes = getAllRoutesFlat();
  
  allRoutes.forEach(route => {
    if (!categorized[route.category]) {
      categorized[route.category] = [];
    }
    categorized[route.category].push(route);
  });
  
  return categorized;
}

// Function to search routes
export function searchRoutes(query: string): SitemapRoute[] {
  const allRoutes = getAllRoutesFlat();
  const lowerQuery = query.toLowerCase();
  
  return allRoutes.filter(route => 
    route.title.toLowerCase().includes(lowerQuery) ||
    route.url.toLowerCase().includes(lowerQuery) ||
    route.category.toLowerCase().includes(lowerQuery)
  );
}