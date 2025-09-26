export type ComplaintStatus = 'pending' | 'in-progress' | 'resolved';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  imageUrl: string;
  status: ComplaintStatus;
  dateSubmitted: Date;
  assignedDepartment?: string;
  submitter: {
    name: string;
    email: string;
  };
  actionHistory: ActionHistory[];
}

export interface ActionHistory {
  id: string;
  action: string;
  timestamp: Date;
  adminName: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  totalComplaints: number;
  rewardPoints: number;
  isActive: boolean;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  resolved: number;
}