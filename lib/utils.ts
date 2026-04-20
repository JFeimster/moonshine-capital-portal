export function sanitizeUrl(url?: string | null): string {
  if (!url) return '#';
  const trimmed = url.trim();
  if (trimmed === '#' || trimmed === '') return '#';
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^mailto:/i.test(trimmed)) return trimmed;
  if (/^tel:/i.test(trimmed)) return trimmed;
  if (/^[a-zA-Z0-9]+:/i.test(trimmed)) return '#'; // Blocks javascript:, data:, etc.

  // If it does not contain a dot, assume it's a relative path
  if (!trimmed.includes('.')) {
    return `/${trimmed}`;
  }

  // It contains a dot but no protocol, so prepend https://
  return `https://${trimmed}`;
}
