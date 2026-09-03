import type { Metadata } from 'next';
import { SITE_CONFIG, getCanonicalPartnerUrl, getCanonicalUrl } from './site-config';

export function constructMetadata({
  title,
  description = SITE_CONFIG.defaultDescription,
  path = '/',
  type = 'website',
  noindex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  type?: 'website' | 'profile';
  noindex?: boolean;
} = {}): Metadata {
  const canonical = getCanonicalUrl(path);
  return {
    title: title || SITE_CONFIG.defaultTitle,
    description,
    alternates: { canonical },
    openGraph: {
      title: title || SITE_CONFIG.defaultTitle,
      description,
      type,
      url: canonical,
      siteName: SITE_CONFIG.publicBrand,
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export function getPartnerTitle(partnerName: string, companyName?: string | null) {
  const partner = partnerName.trim();
  const company = companyName?.trim();
  const companyIsDistinct = company && company.toLocaleLowerCase() !== partner.toLocaleLowerCase();
  return companyIsDistinct
    ? `${partner} | ${company} | ${SITE_CONFIG.publicBrand}`
    : `${partner} | ${SITE_CONFIG.publicBrand}`;
}

export function constructPartnerMetadata({
  slug,
  partnerName,
  companyName,
  description,
  path = '',
  pageTitle,
  image,
}: {
  slug: string;
  partnerName: string;
  companyName?: string | null;
  description?: string | null;
  path?: string;
  pageTitle?: string;
  image?: string | null;
}): Metadata {
  const title = pageTitle
    ? `${pageTitle} | ${partnerName}`
    : getPartnerTitle(partnerName, companyName);
  const relativePath = path ? `/${slug.replace(/^\/+|\/+$/g, '')}/${path.replace(/^\/+/, '')}` : `/${slug}`;
  const canonical = getCanonicalUrl(relativePath);
  const resolvedDescription = description || `Explore business funding options with ${partnerName} and ${SITE_CONFIG.publicBrand}.`;
  return {
    title: { absolute: title },
    description: resolvedDescription,
    alternates: { canonical },
    openGraph: {
      title,
      description: resolvedDescription,
      type: 'profile',
      url: canonical,
      siteName: SITE_CONFIG.publicBrand,
      ...(image ? { images: [{ url: image, alt: partnerName }] } : {}),
    },
  };
}
