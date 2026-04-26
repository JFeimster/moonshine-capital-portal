/**
 * Normalize a full name into a URL-friendly slug.
 * Transforms: Lowercase, replace spaces with hyphens, remove special characters.
 */
export function generateSlug(fullName: string): string {
  if (!fullName) return '';
  return fullName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove special characters
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-'); // collapse multiple hyphens
}

/**
 * Normalizes URLs, ensuring protocol is present and trailing slashes are removed.
 */
export function normalizeUrl(url?: string): string | undefined {
  if (!url || url.trim() === '') return undefined;

  let cleaned = url.trim();

  // ensure protocol
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = `https://${cleaned}`;
  }

  // remove trailing slash
  if (cleaned.endsWith('/')) {
    cleaned = cleaned.slice(0, -1);
  }

  return cleaned;
}

/**
 * Normalizes an array or comma-separated string from Tally into a trimmed array of strings.
 */
export function normalizeArray(input?: string | string[]): string[] {
  if (!input) return [];

  let arr: string[] = [];
  if (typeof input === 'string') {
    arr = input.split(',');
  } else if (Array.isArray(input)) {
    arr = input;
  }

  return arr.map(item => item.trim()).filter(item => item.length > 0);
}

const STATE_MAP: Record<string, string> = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
  'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
  'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
  'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO',
  'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
  'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH',
  'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT',
  'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY',
  'district of columbia': 'DC', 'dc': 'DC', 'puerto rico': 'PR', 'pr': 'PR'
};

/**
 * Extracts and normalizes the state to a 2-letter abbreviation using a USPS lookup.
 * Returns the exact match if it is already a valid 2-letter code.
 */
export function normalizeState(state?: string): string {
  if (!state) return '';

  const trimmed = state.trim().toLowerCase();

  // If it matches a full name, return the abbreviation
  if (STATE_MAP[trimmed]) {
    return STATE_MAP[trimmed];
  }

  // If it's already a 2-letter code, return it uppercased
  if (trimmed.length === 2) {
    return trimmed.toUpperCase();
  }

  // Fallback (for invalid states or edge cases)
  return trimmed.substring(0, 2).toUpperCase();
}
