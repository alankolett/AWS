export type ActiveTabType =
  | 'home'
  | 'events'
  | 'founder'
  | 'team'
  | 'builders'
  | 'learning'
  | 'pathgen'
  | 'blog'
  | 'opportunities'
  | 'announcements'
  | 'banner-gen'
  | 'builder-pass'
  | 'attendance'
  | 'certificates';

export interface BuilderMember {
  id: string;
  name: string;
  role: string;
  division: string;
  year: string;
  avatar: string;
  badges: string[];
  certs: string[];
  bio: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  isLead?: boolean;
  featured?: boolean;
  builderId?: string;
}

export interface EventSession {
  id: string;
  title: string;
  type: 'Workshop' | 'Bootcamp' | 'Keynote' | 'Hackathon' | 'Community' | 'Watch Party';
  date: string;
  time: string;
  location: string;
  speaker: string;
  speakerRole: string;
  tags: string[];
  seatsRemaining: number;
  totalSeats: number;
  description: string;
  bannerGradient?: string;
  isPast?: boolean;
  attendedCount?: number;
  slidesUrl?: string;
  githubUrl?: string;
  recordingUrl?: string;
}

export interface CertificateRecord {
  id: string;
  recipientName: string;
  prn: string;
  eventName: string;
  date: string;
  issueId: string;
  verificationUrl: string;
  credentialTier: 'Gold Builder' | 'Silver Builder' | 'Contributor' | 'Attendee';
  skillsVerified: string[];
}

export interface LearningResource {
  id: string;
  title: string;
  level: 'Fundamentals' | 'Associate' | 'Professional' | 'Specialty';
  category: 'Cloud Architecture' | 'Serverless' | 'DevOps & CI/CD' | 'Machine Learning' | 'Security';
  duration: string;
  description: string;
  iconName: string;
  url: string;
  modulesCount: number;
}

export interface BlogPost {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  excerpt: string;
  tags: string[];
  coverColor: string;
  likes: number;
}

export interface OpportunityItem {
  id: string;
  title: string;
  company: string;
  type: 'Internship' | 'Full-Time' | 'Cloud Fellowship' | 'Hackathon Grant';
  location: string;
  stipend?: string;
  deadline: string;
  link: string;
  tags: string[];
  isVerified: boolean;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  date: string;
  priority: 'CRITICAL' | 'NORMAL' | 'UPDATE';
  category: string;
  content: string;
  author: string;
}

export interface BuilderPassData {
  name: string;
  prn: string;
  branchYear: string;
  role: string;
  tier: 'PRO' | 'FELLOW' | 'MEMBER' | 'ARCHITECT';
  avatarUrl: string;
  memberSince: string;
  joinedDate: string;
  qrPayload: string;
}

export interface AttendanceRecord {
  id: string;
  prn: string;
  studentName: string;
  timestamp: string;
  eventId: string;
  eventTitle: string;
  verified: boolean;
}
