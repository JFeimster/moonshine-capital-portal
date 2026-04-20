export function sanitizeUrl(url: string | null | undefined, fallback: string = '#'): string {
  if (!url) return fallback;

  if (url.startsWith('/') || url.startsWith('#')) {
    return url;
  }

  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
      return parsed.href;
    }
  } catch (error) {
    // Invalid URL format
  }

  return fallback;
}
