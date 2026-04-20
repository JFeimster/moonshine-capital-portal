/**
 * Sanitizes a URL to ensure it is safe to use in an href attribute.
 * Only allows http:// and https:// protocols to prevent javascript: and other malicious URIs.
 */
export function sanitizeUrl(url: string | undefined | null): string {
  if (!url) return '#';

  const trimmed = url.trim();

  // Check if the URL starts with http:// or https://
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  // For this application, we expect these links to be external.
  // If we wanted to allow internal links, we could check for / but not //
  // However, based on the vulnerability report, we should stick to http/https.

  return '#';
}
