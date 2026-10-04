/**
 * Shared utility functions for AWS SBG portal
 */

/**
 * Returns a fully qualified URL to the member's public AWS Builder Center profile.
 * Format: https://builder.aws.com/community/@builderid
 * If the user entered a full URL, returns it directly (normalizing /community/user/ to /community/@).
 * Otherwise, formats it to the official AWS Builder Center profile path.
 */
export function getAwsBuilderProfileUrl(builderId?: string | null): string {
  if (!builderId) return '';
  const trimmed = builderId.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed.replace('/community/user/', '/community/@');
  }
  const cleanId = trimmed.replace(/^@/, '');
  return `https://builder.aws.com/community/@${encodeURIComponent(cleanId)}`;
}

/**
 * Normalizes any LinkedIn input (raw iframe HTML, embed URL, or regular post URL)
 * into a valid LinkedIn embed URL that can be displayed inside an <iframe>.
 */
export function normalizeLinkedInEmbedUrl(input?: string | null): string {
  if (!input) return '';
  let str = input.trim();
  if (!str) return '';

  // Ignore stale placeholder ID
  if (str.includes('7511861086028222466')) return '';

  // Decode common HTML entities (&quot;, &lt;, &gt;, &amp;)
  str = str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

  // 1. Strip surrounding parenthesis e.g. (<iframe ...>)
  if (str.startsWith('(') && str.endsWith(')')) {
    str = str.slice(1, -1).trim();
  }

  // 2. Extract src attribute if full iframe tag is passed
  if (str.includes('<iframe') || str.includes('src=')) {
    const match = str.match(/src=["'](.*?)["']/i);
    if (match && match[1]) {
      str = match[1].trim();
    }
  }

  // 3. If URL is already in embed format
  if (str.includes('/embed/feed/update/')) {
    return str.split('?')[0];
  }

  // 4. If URL is standard feed update URL: /feed/update/urn:li:...
  if (str.includes('/feed/update/urn:li:')) {
    const clean = str.split('?')[0];
    return clean.replace('/feed/update/urn:li:', '/embed/feed/update/urn:li:');
  }

  // 5. If URL is a posts activity link or contains activity ID: /posts/...-activity-7353638537595932672-...
  const activityMatch = str.match(/activity[:\-](\d+)/i);
  if (activityMatch && activityMatch[1]) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activityMatch[1]}`;
  }

  // 6. If urn:li:share or urn:li:activity or urn:li:ugcPost was provided alone
  if (str.startsWith('urn:li:')) {
    const cleanUrn = str.split('?')[0];
    return `https://www.linkedin.com/embed/feed/update/${cleanUrn}`;
  }

  // 7. If a pure numeric ID was entered (16 to 22 digits)
  const numOnlyMatch = str.match(/^(\d{16,22})$/);
  if (numOnlyMatch) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${numOnlyMatch[1]}`;
  }

  // 8. If standard post URL contains a 17-21 digit numeric ID
  const anyPostIdMatch = str.match(/(\d{17,21})/);
  if (anyPostIdMatch && str.includes('linkedin.com')) {
    return `https://www.linkedin.com/embed/feed/update/urn:li:activity:${anyPostIdMatch[1]}`;
  }

  return str.split('?')[0];
}

/**
 * Returns direct public LinkedIn URL for a given input (for "Open in LinkedIn" button)
 */
export function getLinkedInPostDirectUrl(input?: string | null): string {
  if (!input) return 'https://www.linkedin.com/company/aws-sbg-sspu';
  const embed = normalizeLinkedInEmbedUrl(input);
  if (embed.includes('/embed/feed/update/')) {
    return embed.replace('/embed/feed/update/', '/feed/update/');
  }
  if ((input.startsWith('http://') || input.startsWith('https://')) && !input.includes('<iframe')) {
    return input;
  }
  return 'https://www.linkedin.com/company/aws-sbg-sspu';
}

export const DEFAULT_SSPU_MAPS_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.892019741006!2d73.73357597505295!3d18.62534578248962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b950882e3073%3A0x675846146c82725!2sSymbiosis%20Skills%20and%20Professional%20University!5e0!3m2!1sen!2sin!4v1728037000000!5m2!1sen!2sin';

/**
 * Normalizes any Google Maps input (raw iframe HTML, embed URL, or search query)
 * into a valid Google Maps embed URL that can be displayed inside an <iframe>.
 */
export function normalizeGoogleMapsEmbedUrl(input?: string | null): string {
  if (!input) return '';
  let str = input.trim();
  if (!str) return '';

  // Decode common HTML entities (&quot;, &lt;, &gt;, &amp;)
  str = str
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

  // Extract src attribute if full iframe tag is passed
  if (str.includes('<iframe') || str.includes('src=')) {
    const match = str.match(/src=["'](.*?)["']/i);
    if (match && match[1]) {
      str = match[1].trim();
    }
  }

  // Already a Google Maps embed URL
  if (str.includes('google.com/maps/embed')) {
    return str;
  }

  // If it's a standard maps.google.com/?q=... search link, convert to output=embed
  if (str.includes('google.com/maps') && !str.includes('output=embed')) {
    const separator = str.includes('?') ? '&' : '?';
    return `${str}${separator}output=embed`;
  }

  return str;
}

/**
 * Returns a direct Google Maps link (for "Open in Google Maps" external link button).
 */
export function getGoogleMapsDirectUrl(embedInput?: string | null, fallbackLocation?: string | null): string {
  const norm = normalizeGoogleMapsEmbedUrl(embedInput);
  if (norm) {
    return norm;
  }
  if (fallbackLocation && fallbackLocation.trim()) {
    return `https://maps.google.com/?q=${encodeURIComponent(fallbackLocation.trim())}`;
  }
  return 'https://maps.google.com/?q=Symbiosis+Skills+and+Professional+University,+Kiwale,+Pune';
}

/**
 * Cleans up corrupted/concatenated description text (e.g. accidentally prepended placeholder strings)
 */
export function cleanEventDescription(desc?: string | null): string {
  if (!desc) return '';
  let text = desc.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  // Strip accidental prepended placeholder remnant:
  text = text.replace(/^Hands-on architectural spri(nt)?\s*/i, '');
  return text.trim();
}

/**
 * Determines if an event is hosted online / virtually
 */
export function isOnlineEvent(location?: string | null, totalSeats?: number | null): boolean {
  if (!location) return false;
  if (totalSeats === 0) return true;
  return /online|virtual|google meet|meet\.google|zoom|teams|youtube|discord/i.test(location);
}

/**
 * Checks if an event is in the past based on flag or event date
 */
export function isEventPast(eventDate?: string | null, isPastFlag?: boolean | null): boolean {
  if (isPastFlag) return true;
  if (!eventDate) return false;

  const trimmed = eventDate.trim();
  // Today's date in local YYYY-MM-DD
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed < todayStr;
  }

  const parsed = new Date(trimmed);
  if (!isNaN(parsed.getTime())) {
    today.setHours(0, 0, 0, 0);
    return parsed < today;
  }

  return false;
}

/**
 * Extracts bucket name and relative file path from a Supabase storage URL.
 * Handles both public URLs and signed URLs.
 * Example URL: https://xyz.supabase.co/storage/v1/object/public/avatars/179105-photo.jpg
 * -> { bucket: "avatars", path: "179105-photo.jpg" }
 */
export function parseSupabaseStorageUrl(url: string): { bucket: string; path: string } | null {
  if (!url || typeof url !== 'string' || !url.trim()) return null;

  const match = url.match(/\/storage\/v1\/object\/(?:public|sign)\/([^/?#]+)\/([^?#]+)/);
  if (match) {
    try {
      const bucket = decodeURIComponent(match[1]);
      const path = decodeURIComponent(match[2]);
      return { bucket, path };
    } catch {
      return { bucket: match[1], path: match[2] };
    }
  }

  // Handle direct relative paths like "avatars/123-file.png"
  const knownBuckets = ['avatars', 'event-banners', 'cms-media', 'team-photos'];
  for (const b of knownBuckets) {
    if (url.startsWith(`${b}/`)) {
      return { bucket: b, path: url.slice(b.length + 1) };
    }
  }

  return null;
}
