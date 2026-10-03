import {
  BuilderMember,
  EventSession,
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
  bio: "AWS Student Builder Group Chapter Founder & Lead at Symbiosis Skills and Professional University. Passionate about cloud architecture, serverless computing, and empowering student builders.",
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
