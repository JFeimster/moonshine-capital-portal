import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { RouteChrome } from '@/components/RouteChrome';
import { SITE_CONFIG } from '@/lib/site-config';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.canonicalOrigin),
  title: {
    default: SITE_CONFIG.defaultTitle,
    template: `%s | ${SITE_CONFIG.publicBrand}`,
  },
  description: SITE_CONFIG.defaultDescription,
  openGraph: {
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.defaultDescription,
    siteName: SITE_CONFIG.publicBrand,
    type: 'website',
    url: SITE_CONFIG.canonicalOrigin,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[100] btn-brutal-primary px-6 py-3 font-bold uppercase border-2 border-neo-black bg-neo-yellow text-neo-black shadow-brutal outline-none">
          Skip to main content
        </a>
        <RouteChrome>
          <div id="main-content" className="flex-grow outline-none" tabIndex={-1}>
            {children}
          </div>
        </RouteChrome>
        <Analytics />
      </body>
    </html>
  );
}
