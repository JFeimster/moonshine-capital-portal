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

/**
 * Extracts and normalizes the state to a 2-letter abbreviation if possible.
 * This is a basic implementation.
 */
export function normalizeState(state?: string): string {
  if (!state) return '';
  return state.trim().substring(0, 2).toUpperCase();
}
