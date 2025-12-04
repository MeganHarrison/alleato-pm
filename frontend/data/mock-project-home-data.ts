import {
  ProjectTool,
  RecentActivity,
  ProjectInfo,
  QuickAction,
  ProjectTeamMember,
  ProjectOverviewItem,
  MyOpenItem,
} from '@/types/project-home';

export const mockProjectTools: ProjectTool[] = [
  // Core Tools
  {
    id: 'home',
    name: 'Home',
    description: 'Project overview and dashboard',
    icon: 'Home',
    href: '/projects/[projectId]/home',
    category: 'core',
    isConfigured: true,
  },
  {
    id: 'directory',
    name: 'Directory',
    description: 'Project contacts and team members',
    icon: 'Users',
    href: '/projects/[projectId]/directory',
    category: 'core',
    itemCount: 24,
    isConfigured: true,
  },
  {
    id: 'documents',
    name: 'Documents',
    description: 'Project files and documents',
    icon: 'FileText',
    href: '/projects/[projectId]/documents',
    category: 'core',
    itemCount: 156,
    isConfigured: true,
  },
  {
    id: 'photos',
    name: 'Photos',
    description: 'Project photos and albums',
    icon: 'Image',
    href: '/projects/[projectId]/photos',
    category: 'core',
    itemCount: 342,
    isConfigured: true,
  },
  // Project Management
  {
    id: 'rfis',
    name: 'RFIs',
    description: 'Requests for Information',
    icon: 'HelpCircle',
    href: '/projects/[projectId]/rfis',
    category: 'project-management',
    itemCount: 12,
    isConfigured: true,
  },
  {
    id: 'submittals',
    name: 'Submittals',
    description: 'Material and shop drawing submittals',
    icon: 'ClipboardCheck',
    href: '/projects/[projectId]/submittals',
    category: 'project-management',
    itemCount: 45,
    isConfigured: true,
  },
  {
    id: 'daily-log',
    name: 'Daily Log',
    description: 'Daily site reports and logs',
    icon: 'Calendar',
    href: '/projects/[projectId]/daily-log',
    category: 'project-management',
    isConfigured: true,
  },
  {
    id: 'meetings',
    name: 'Meetings',
    description: 'Meeting minutes and agendas',
    icon: 'Users2',
    href: '/projects/[projectId]/meetings',
    category: 'project-management',
    itemCount: 8,
    isConfigured: true,
  },
  {
    id: 'schedule',
    name: 'Schedule',
    description: 'Project schedule and milestones',
    icon: 'CalendarDays',
    href: '/projects/[projectId]/schedule',
    category: 'project-management',
    isConfigured: true,
  },
  {
    id: 'tasks',
    name: 'Tasks',
    description: 'Project tasks and to-dos',
    icon: 'CheckSquare',
    href: '/projects/[projectId]/tasks',
    category: 'project-management',
    itemCount: 23,
    isConfigured: true,
  },
  // Financial Management
  {
    id: 'budget',
    name: 'Budget',
    description: 'Project budget and cost tracking',
    icon: 'DollarSign',
    href: '/projects/[projectId]/budget',
    category: 'financial-management',
    isConfigured: true,
  },
  {
    id: 'commitments',
    name: 'Commitments',
    description: 'Subcontracts and purchase orders',
    icon: 'FileSignature',
    href: '/projects/[projectId]/commitments',
    category: 'financial-management',
    itemCount: 18,
    isConfigured: true,
  },
  {
    id: 'prime-contracts',
    name: 'Prime Contracts',
    description: 'Owner contracts',
    icon: 'Handshake',
    href: '/projects/[projectId]/prime-contracts',
    category: 'financial-management',
    itemCount: 1,
    isConfigured: true,
  },
  {
    id: 'invoicing',
    name: 'Invoicing',
    description: 'Payment applications and invoices',
    icon: 'Receipt',
    href: '/projects/[projectId]/invoicing',
    category: 'financial-management',
    itemCount: 6,
    isConfigured: true,
  },
  {
    id: 'change-orders',
    name: 'Change Orders',
    description: 'Budget and contract changes',
    icon: 'FileEdit',
    href: '/projects/[projectId]/change-orders',
    category: 'financial-management',
    itemCount: 4,
    isConfigured: true,
  },
];

export const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'rfi',
    title: 'RFI #012 - Electrical Panel Location',
    description: 'Submitted for review',
    user: 'John Smith',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    link: '/projects/[projectId]/rfis/012',
  },
  {
    id: '2',
    type: 'daily-log',
    title: 'Daily Log - Nov 30, 2024',
    description: 'Completed by Site Manager',
    user: 'Maria Garcia',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    link: '/projects/[projectId]/daily-log',
  },
  {
    id: '3',
    type: 'submittal',
    title: 'Submittal #045 - HVAC Equipment',
    description: 'Approved with comments',
    user: 'Bob Johnson',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    link: '/projects/[projectId]/submittals/045',
  },
  {
    id: '4',
    type: 'change-order',
    title: 'PCO #003 - Foundation Modification',
    description: 'Pending owner approval',
    user: 'Sarah Williams',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    link: '/projects/[projectId]/change-orders/003',
  },
  {
    id: '5',
    type: 'invoice',
    title: 'Invoice #INV-2024-006',
    description: 'Submitted for payment',
    user: 'Mike Davis',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    link: '/projects/[projectId]/invoicing/006',
  },
];

export const mockProjectInfo: ProjectInfo = {
  id: '1',
  name: '24-104 - Goodwill Bart',
  projectNumber: '24-104',
  address: '123 Bart',
  city: 'San Leandro',
  state: 'CA',
  zip: '94577',
  phone: '(510) 555-0100',
  status: 'Active',
  stage: 'Preconstruction',
  type: 'Industrial',
  startDate: new Date('2024-06-01'),
  estimatedCompletionDate: new Date('2025-08-15'),
  projectValue: 2500000,
  owner: 'Goodwill Industries',
  architect: 'Design Partners LLC',
  generalContractor: 'Alleato Group',
};

export const mockQuickActions: QuickAction[] = [
  {
    id: 'create-rfi',
    label: 'Create RFI',
    icon: 'Plus',
    href: '/projects/[projectId]/rfis/new',
  },
  {
    id: 'add-daily-log',
    label: 'Add Daily Log',
    icon: 'Calendar',
    href: '/projects/[projectId]/daily-log/new',
  },
  {
    id: 'upload-document',
    label: 'Upload Document',
    icon: 'Upload',
    href: '/projects/[projectId]/documents/upload',
  },
  {
    id: 'add-photo',
    label: 'Add Photo',
    icon: 'Camera',
    href: '/projects/[projectId]/photos/upload',
  },
];

// Project Team based on Procore DOM
export const mockProjectTeam: ProjectTeamMember[] = [
  {
    id: '1',
    role: 'Project Manager',
    name: 'Nick Jepson',
    company: 'Alleato Group',
    email: 'njepson@alleatogroup.com',
    office: '',
    mobile: '(727) 603-1265',
  },
  {
    id: '2',
    role: 'Project Manager',
    name: 'Brandon Clymer',
    company: 'Alleato Group',
    email: 'bclymer@alleatogroup.com',
    office: '+1 3177600088',
    mobile: '(317) 760-0088',
  },
];

// Project Overview based on Procore DOM
export const mockProjectOverview: ProjectOverviewItem[] = [
  {
    id: 'schedule',
    name: 'Schedule',
    overdue: 28,
    nextSevenDays: 0,
    moreThanSevenDays: 0,
    totalOpen: 28,
    link: '/projects/[projectId]/schedule',
  },
  {
    id: 'punch-list',
    name: 'Punch List',
    overdue: 5,
    nextSevenDays: 0,
    moreThanSevenDays: 0,
    totalOpen: 5,
    link: '/projects/[projectId]/punch-list',
  },
  {
    id: 'meetings',
    name: 'Meetings',
    overdue: 3,
    nextSevenDays: 0,
    moreThanSevenDays: 20,
    totalOpen: 23,
    link: '/projects/[projectId]/meetings',
  },
];

// My Open Items based on Procore DOM
export const mockMyOpenItems: MyOpenItem[] = [
  {
    id: '1',
    type: 'meeting',
    itemType: 'Meeting Item',
    details: 'Goodwill Bart - Current Schedule',
    status: 'Open',
    dueDate: undefined,
    link: '/projects/[projectId]/meetings/562949972597337',
    icon: 'Calendar',
  },
];

// Helper to get tools by category
export function getToolsByCategory(category: ProjectTool['category']): ProjectTool[] {
  return mockProjectTools.filter((tool) => tool.category === category);
}
