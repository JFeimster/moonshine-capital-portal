import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/site-config';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/portal/', '/admin/', '/access', '/out', '/go/', '/api/'],
    },
    sitemap: `${SITE_CONFIG.canonicalOrigin}/sitemap.xml`,
  };
}
