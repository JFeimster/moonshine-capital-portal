export function sanitizeUrl(url: string | undefined | null): string {
  if (!url) return '#';
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.toString();
    }
  } catch (e) {
    // If it doesn't parse as a full URL, we might want to check if it's a relative path,
    // but in this context (external website URLs), we only want http/https.
  }
  return '#'; // Fallback for invalid/unsafe URLs
}
