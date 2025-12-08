export interface ProjectTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  href: string;
  category: 'core' | 'project-management' | 'resource-management' | 'financial-management';
  itemCount?: number;
  isConfigured?: boolean;
}

export interface RecentActivity {
  id: string;
  type: 'rfi' | 'submittal' | 'daily-log' | 'change-order' | 'invoice' | 'document';
  title: string;
  description: string;
  user: string;
  timestamp: Date;
  link: string;
}

export interface ProjectInfo {
  id: string;
  name: string;
  projectNumber: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  status: 'Active' | 'Inactive';
  stage: string;
  type: string;
  startDate?: Date;
  estimatedCompletionDate?: Date;
  projectValue?: number;
  owner?: string;
  architect?: string;
  generalContractor?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  href: string;
}

export interface ProjectTeamMember {
  id: string;
  role: string;
  name: string;
  company: string;
  email: string;
  office?: string;
  mobile?: string;
}

export interface ProjectOverviewItem {
  id: string;
  name: string;
  overdue: number;
  nextSevenDays: number;
  moreThanSevenDays: number;
  totalOpen: number;
  link: string;
}

export interface MyOpenItem {
  id: string;
  type: string;
  itemType: string;
  details: string;
  status: string;
  dueDate?: Date;
  link: string;
  icon: string;
}
