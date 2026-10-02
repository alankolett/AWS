export interface EventDetailDto {
  id: string;
  title: string;
  type: string;
  eventDate: string;
  timeRange: string;
  location: string;
  speakerName: string;
  speakerRole?: string;
  tags: string[];
  totalSeats: number;
  seatsRemaining: number;
  description?: string;
  bannerTemplates: any[];
  isPast: boolean;
  postEventNotes?: string;
  slidesUrl?: string;
  recordingUrl?: string;
  githubUrl?: string;
}

export interface RsvpRequestDto {
  eventId: string;
  studentName: string;
  prn: string;
  email?: string;
}

export interface BannerGenerateDto {
  eventId: string;
  styleId: string;
  attendeeName: string;
  prn: string;
  photoUrl?: string;
}
