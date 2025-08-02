export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  points: number;
  badges: Badge[];
  reportsCount: number;
  joinedAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Date;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  priority: IssuePriority;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: string[];
  progressImages?: {
    before: string[];
    after: string[];
  };
  reportedBy: User;
  reportedAt: Date;
  updatedAt: Date;
  assignedTo?: string;
  supportCount: number;
  supportedBy: string[];
  comments: Comment[];
  timeline: TimelineEvent[];
  qrCode?: string;
  voiceNote?: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
  replies?: Comment[];
}

export interface TimelineEvent {
  id: string;
  type: 'created' | 'updated' | 'assigned' | 'resolved' | 'verified';
  description: string;
  date: Date;
  by?: string;
  images?: string[];
}

export type IssueCategory = 
  | 'pothole'
  | 'garbage'
  | 'water-leak'
  | 'street-light'
  | 'drainage'
  | 'road-damage'
  | 'noise'
  | 'illegal-parking'
  | 'other';

export type IssueStatus = 'reported' | 'verified' | 'in-progress' | 'resolved' | 'closed';

export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';

export interface FilterOptions {
  category?: IssueCategory[];
  status?: IssueStatus[];
  priority?: IssuePriority[];
  distance?: number;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface AdminStats {
  totalReports: number;
  resolvedReports: number;
  pendingReports: number;
  activeUsers: number;
  averageResolutionTime: number;
  reportsByCategory: Record<IssueCategory, number>;
  reportsByStatus: Record<IssueStatus, number>;
  trendsData: {
    date: string;
    reports: number;
    resolved: number;
  }[];
}

export const CATEGORY_CONFIG: Record<IssueCategory, { label: string; icon: string }> = {
  pothole: { label: "Pothole", icon: "🕳️" },
  garbage: { label: "Garbage", icon: "🗑️" },
  // water-leak: { label: "Water Leak", icon: "🚰" },
  // street-light: { label: "Street Light", icon: "💡" },
  "water-leak": { label: "Water Leak", icon: "🚰" },     // ✅ Fixed
  "street-light": { label: "Street Light", icon: "💡" }, 
  drainage: { label: "Drainage", icon: "🚽" },
  "road-damage": { label: "Road Damage", icon: "🛣️" },
  noise: { label: "Noise", icon: "🔊" },
  "illegal-parking": { label: "Illegal Parking", icon: "🚫" },
  other: { label: "Other", icon: "📌" },
};
