import {
  BuilderMember,
  EventSession,
  CertificateRecord,
  LearningResource,
  BlogPost,
  OpportunityItem,
  AnnouncementItem,
} from './types';

export const UPCOMING_EVENTS: (EventSession & {
  speaker: string;
  totalSeats: number;
  seatsRemaining: number;
  date: string;
  bannerTemplates: string[];
})[] = [
  {
    id: 'placeholder-1',
    title: 'Lorem Ipsum Event Title',
    eventDate: 'December 01, 2026',
    date: 'December 01, 2026',
    time: '14:00 - 16:00 IST',
    location: 'Computer Lab 3, Academic Block',
    type: 'WORKSHOP',
    tags: ['LOREM', 'IPSUM', 'DOLOR'],
    speaker: 'Jane Doe',
    speakerName: 'Jane Doe',
    speakerRole: 'Software Engineer',
    totalSeats: 60,
    seatsRemaining: 60,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    bannerTemplates: ['modern', 'minimal'],
    isPast: false,
    slidesUrl: '',
    recordingUrl: '',
    githubUrl: '',
  },
];

export const PAST_EVENTS: (EventSession & {
  speaker: string;
  totalSeats: number;
  seatsRemaining: number;
  date: string;
})[] = [
  {
    id: 'placeholder-2',
    title: 'Sit Amet Consectetur Event',
    eventDate: 'November 15, 2026',
    date: 'November 15, 2026',
    time: '10:00 - 13:00 IST',
    location: 'Virtual',
    type: 'SEMINAR',
    tags: ['LOREM', 'IPSUM'],
    speaker: 'John Doe',
    speakerName: 'John Doe',
    speakerRole: 'Cloud Architect',
    totalSeats: 100,
    seatsRemaining: 0,
    description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.',
    isPast: true,
    slidesUrl: '#',
    recordingUrl: '#',
    githubUrl: '#',
  }
];

export const CORE_TEAM: BuilderMember[] = [
  {
    id: 'admin-1',
    name: 'Placeholder Admin',
    role: 'Administrator',
    division: 'Operations',
    year: 'Year 4',
    avatar: '/stickman.svg',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vel massa et tellus venenatis pulvinar. Nunc viverra ipsum in ipsum fermentum, nec lobortis velit ultricies.',
    badges: ['LOREM', 'IPSUM'],
    certs: ['Dolor Sit Amet', 'Consectetur Adipiscing'],
    builderId: 'admin-001',
    github: '#',
    linkedin: '#',
    portfolio: '#',
  },
  {
    id: 'member-1',
    name: 'Placeholder Member',
    role: 'Member',
    division: 'Engineering',
    year: 'Year 3',
    avatar: '/stickman.svg',
    bio: 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante.',
    badges: ['DOLOR'],
    certs: ['Elit'],
    builderId: 'member-001',
    github: '#',
    linkedin: '#',
    portfolio: '#',
  }
];

export const FOUNDER_STORY = {
  quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  author: "Founder Name",
  role: "Founder / Captain",
  timeline: [
    {
      date: "Jan 2026",
      title: "Lorem Ipsum",
      description: "Incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam."
    },
    {
      date: "Mar 2026",
      title: "Dolor Sit Amet",
      description: "Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      date: "Oct 2026",
      title: "Consectetur Adipiscing",
      description: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    }
  ]
};

export const MOCK_CERTIFICATES: CertificateRecord[] = [
  {
    id: 'CERT-SSPU-2026-001',
    recipientName: 'Laksh Meghani',
    prn: '20230104001',
    eventName: 'AWS Serverless Architecture Deep Dive',
    date: '2026-10-15',
    issueId: 'AWS-SBG-SSPU-WS-8921',
    verificationUrl: 'https://verify.sbg-sspu.org/cert/001',
    credentialTier: 'Gold Builder',
    skillsVerified: ['AWS Lambda', 'DynamoDB', 'API Gateway', 'SAM CLI'],
  },
];

export const LEARNING_PATHS: LearningResource[] = [
  {
    id: 'lp-architect',
    title: 'Solutions Architect Fast-Track',
    level: 'Associate',
    category: 'Cloud Architecture',
    duration: '6 Weeks (Self-paced + Labs)',
    description: 'Master VPC subnets, transit gateways, auto-scaling groups, ALB routing, S3 storage tiers, and RDS Aurora multi-region setups.',
    iconName: 'Layers',
    url: '#',
    modulesCount: 18,
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Architecting for 99.99% Availability at Scale',
    author: 'Student Builder Lead',
    authorRole: 'Founder & Community Lead',
    date: 'OCT 01, 2026',
    readTime: '6 min read',
    excerpt: 'How we configured Amazon CloudFront, Route 53 latency-based routing, and Aurora Serverless v2.',
    tags: ['Architecture', 'CloudFront', 'Aurora Serverless'],
    coverColor: 'from-purple-900/60 to-slate-900',
    likes: 48,
  },
];

export const OPPORTUNITIES: OpportunityItem[] = [
  {
    id: 'opp-1',
    title: 'AWS Cloud Support Associate',
    company: 'Amazon Web Services (AWS)',
    type: 'Full-Time',
    location: 'Pune, India',
    deadline: 'NOV 15, 2026',
    link: 'https://amazon.jobs',
    tags: ['Networking', 'Linux', 'AWS Core Services'],
    isVerified: true,
  },
];

export const ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'anc-1',
    title: 'AWS Student Builder Group Session Schedule Updated',
    date: 'OCT 01, 2026',
    priority: 'CRITICAL',
    category: 'Event Alert',
    content: 'Check out upcoming workshops and interactive sessions in Computer Lab 3.',
    author: 'Chapter Core Team',
  },
];
