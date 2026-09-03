const RESERVED_ROOT_SEGMENTS = new Set([
  'about',
  'access',
  'admin',
  'api',
  'apply',
  'brokers',
  'contact',
  'directory',
  'disclosures',
  'faq',
  'funding-types',
  'go',
  'how-it-works',
  'industries',
  'onboarding',
  'out',
  'portal',
  'privacy',
  'sitemap.xml',
  'terms',
]);

export function isPartnerRoute(pathname: string) {
  const segment = pathname.replace(/^\/+/, '').split('/')[0] || '';
  return Boolean(segment) && !RESERVED_ROOT_SEGMENTS.has(segment.toLowerCase());
}