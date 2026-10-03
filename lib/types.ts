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
  type: string;
  eventDate: string;
  date?: string;
  time: string;
  location: string;
  speakerName: string;
  speakerRole: string;
  tags: string[];
  description: string;
  bannerGradient?: string;
  isPast?: boolean;
  meetupLink?: string;
  meetup_link?: string;
  thumbnailUrl?: string;
  thumbnail_url?: string;
  prerequisites?: string;
  bannerTemplates?: any[];
  banner_templates?: any[];
  post_event_photo_url?: string;
  post_event_text?: string;
  postEventPhotoUrl?: string;
  postEventText?: string;
  slidesUrl?: string;
  githubUrl?: string;
  recordingUrl?: string;
}
