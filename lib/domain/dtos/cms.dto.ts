export interface HomeCmsDto {
  heroTagline: string;
  quickStats: {
    label: string;
    value: string;
  }[];
  bannerImageUrls: string[];
  upcomingEventFeaturedId?: string;
}

export interface FounderCmsDto {
  bio: string;
  journeyMilestones: {
    date: string;
    title: string;
    description: string;
  }[];
  photos: string[];
  achievements: string[];
  personalLetter: string;
}
