export function resolveSafeRedirect(destination: string, requestUrl: string): URL | null {
  try {
    if (destination.startsWith('/') && !destination.startsWith('//')) {
      return new URL(destination, requestUrl);
    }

    const url = new URL(destination);
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url;
    }
  } catch {
    return null;
  }

  return null;
}
