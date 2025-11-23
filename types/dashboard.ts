
export interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconAndroid: string;
  color: string;
  route: string;
}

export interface RecentInspection {
  id: string;
  address: string;
  date: Date;
  status: 'completed' | 'pending' | 'in-progress';
  severity: 'low' | 'medium' | 'high';
  imageCount: number;
}

export interface JobQueueItem {
  id: string;
  title: string;
  address: string;
  scheduledDate: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
}

export interface SalesPipelineStage {
  id: string;
  name: string;
  count: number;
  value: number;
  color: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed-won' | 'closed-lost';
  source: string;
  value: number;
  createdAt: Date;
  lastContact?: Date;
  notes: string;
}

export interface Opportunity {
  id: string;
  leadId: string;
  title: string;
  value: number;
  stage: string;
  probability: number;
  expectedCloseDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  role?: string;
  address?: string;
  notes: string;
  createdAt: Date;
}

export interface FollowUp {
  id: string;
  leadId: string;
  contactId?: string;
  type: 'call' | 'email' | 'meeting' | 'site-visit';
  scheduledDate: Date;
  completed: boolean;
  notes: string;
  createdAt: Date;
}
