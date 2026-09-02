import type { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/site-config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.publicBrand,
    short_name: SITE_CONFIG.publicBrand,
    description: SITE_CONFIG.defaultDescription,
    start_url: '/',
    display: 'standalone',
    background_color: SITE_CONFIG.backgroundColor,
    theme_color: SITE_CONFIG.themeColor,
  };
}
