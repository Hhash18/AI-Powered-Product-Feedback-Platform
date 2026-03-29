export interface IFeedback {
  _id: string;
  title: string;
  description: string;
  category?: string;
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  summary?: string;
  userEmail?: string;
  userType?: 'User' | 'Admin' | 'Guest';
  status?: 'New' | 'Reviewed' | 'In Progress' | 'Completed' | 'Archived';
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
}
