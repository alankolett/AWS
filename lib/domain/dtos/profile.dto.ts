export interface BuilderProfileDto {
  id: string;
  email: string;
  role: 'admin' | 'member' | 'student';
  builderId?: string;
  fullName?: string;
  headline?: string;
  branch?: string;
  year?: string;
  bio?: string;
  quote?: string;
  bannerUrl?: string;
  avatarUrl?: string;
  certifications: string[];
  badges: string[];
  skills: string[];
  projects: any[]; // Using any[] for JSONB for now, can be refined
  linkedinUrl?: string;
  githubUrl?: string;
  isLead: boolean;
}

export interface UpdateBuilderProfileDto {
  quote?: string;
  bannerUrl?: string;
  skills?: string[];
  projects?: any[];
  linkedinUrl?: string;
  githubUrl?: string;
  bio?: string;
  avatarUrl?: string;
}

export interface AssignRoleDto {
  userId: string;
  role: 'admin' | 'member' | 'student';
}
