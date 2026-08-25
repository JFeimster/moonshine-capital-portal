/**
 * Normalize a full name into a URL-friendly slug.
 */
export function generateSlug(fullName: string): string {
  if (!fullName) return '';
  return fullName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/** Stable non-cryptographic hash for deterministic public identifiers. */
function stableHash(value: string): string {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36).padStart(7, '0').slice(0, 7);
}

export function normalizeEmail(email?: string): string {
  return (email || '').trim().toLowerCase();
}

export function generatePartnerId(email: string): string {
  const normalized = normalizeEmail(email);
  return normalized ? `prt_${stableHash(normalized)}` : '';
}

export function generateReferralCode(email: string): string {
  const normalized = normalizeEmail(email);
  return normalized ? `MC${stableHash(`ref:${normalized}`).toUpperCase()}` : '';
}

/**
 * Human-readable and deterministic. The stable suffix prevents same-name collisions.
 */
export function generatePartnerSlug(fullName: string, email: string): string {
  const base = generateSlug(fullName) || 'partner';
  const normalized = normalizeEmail(email);
  return normalized ? `${base}-${stableHash(normalized).slice(0, 5)}` : base;
}

export function normalizeUrl(url?: string): string | undefined {
  if (!url || url.trim() === '') return undefined;
  let cleaned = url.trim();
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = `https://${cleaned}`;
  }
  if (cleaned.endsWith('/')) cleaned = cleaned.slice(0, -1);
  return cleaned;
}

export function normalizeArray(input?: string | string[]): string[] {
  if (!input) return [];
  const arr = typeof input === 'string' ? input.split(',') : Array.isArray(input) ? input : [];
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
const VALID_STATE_CODES = new Set(Object.values(STATE_MAP));

export function normalizeState(state?: string): string {
  if (!state) return '';
  const trimmed = state.trim().toLowerCase();
  if (STATE_MAP[trimmed]) return STATE_MAP[trimmed];
  const upperCode = trimmed.toUpperCase();
  if (upperCode.length === 2 && VALID_STATE_CODES.has(upperCode)) return upperCode;
  return '';
}
