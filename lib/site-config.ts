export const SITE_CONFIG = {
  canonicalOrigin: 'https://capital.distilledfunding.com',
  publicBrand: 'Distilled Funding',
  platformName: 'Moonshine Capital Portal',
  operatingBrand: 'Moonshine Capital',
  defaultTitle: 'Distilled Funding',
  defaultDescription: 'The marketplace for operators who move money.',
  themeColor: '#000000',
  backgroundColor: '#FAF9F5',
} as const;

export function getCanonicalUrl(pathname = '/') {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return new URL(path, `${SITE_CONFIG.canonicalOrigin}/`).toString().replace(/\/$/, pathname === '/' ? '/' : '');
}

export function getCanonicalPartnerUrl(slug: string) {
  return getCanonicalUrl(`/${encodeURIComponent(slug.trim())}`);
}
