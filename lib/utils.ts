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

