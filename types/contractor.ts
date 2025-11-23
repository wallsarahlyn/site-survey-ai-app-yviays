
export interface Job {
  id: string;
  title: string;
  address: string;
  clientName: string;
  clientPhone: string;
  scheduledDate: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assignedTo: string;
  estimatedDuration: number;
  actualDuration?: number;
  checklist: ChecklistItem[];
  photos: JobPhoto[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  required: boolean;
  completedAt?: Date;
  completedBy?: string;
}

export interface JobPhoto {
  id: string;
  uri: string;
  category: 'before' | 'during' | 'after' | 'damage' | 'completion';
  required: boolean;
  caption?: string;
  takenAt: Date;
  takenBy: string;
}

export interface Payment {
  id: string;
  jobId: string;
  amount: number;
  type: 'deposit' | 'progress' | 'final';
  status: 'pending' | 'paid' | 'overdue';
  dueDate: Date;
  paidDate?: Date;
  method?: 'cash' | 'check' | 'card' | 'transfer';
  notes: string;
}
