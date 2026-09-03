import { describe, expect, it } from 'vitest';
import { SITE_CONFIG, getCanonicalPartnerUrl, getCanonicalUrl } from '../lib/site-config';
import { constructPartnerMetadata, getPartnerTitle } from '../lib/seo';
import { generateItemListSchema, generatePartnerSchema } from '../lib/schema';

describe('centralized site SEO configuration', () => {
  it('locks the canonical public origin', () => {
    expect(SITE_CONFIG.canonicalOrigin).toBe('https://capital.distilledfunding.com');
    expect(getCanonicalUrl('/directory')).toBe('https://capital.distilledfunding.com/directory');
  });

  it('builds canonical top-level partner URLs', () => {
    expect(getCanonicalPartnerUrl('jane-smith')).toBe('https://capital.distilledfunding.com/jane-smith');
  });

  it('deduplicates partner and agency names in titles', () => {
    expect(getPartnerTitle('Jane Smith', 'Smith Capital')).toBe('Jane Smith | Smith Capital | Distilled Funding');
    expect(getPartnerTitle('Jane Smith', 'jane smith')).toBe('Jane Smith | Distilled Funding');
    expect(getPartnerTitle('Jane Smith')).toBe('Jane Smith | Distilled Funding');
  });

  it('uses the same canonical partner URL for metadata and schema', () => {
    const metadata = constructPartnerMetadata({
      slug: 'jane-smith',
      partnerName: 'Jane Smith',
      companyName: 'Smith Capital',
      description: 'Funding partner profile',
    });
    const schema = generatePartnerSchema({
      slug: 'jane-smith',
      name: 'Jane Smith',
      companyName: 'Smith Capital',
      description: 'Funding partner profile',
    });

    expect(metadata.alternates?.canonical).toBe('https://capital.distilledfunding.com/jane-smith');
    expect(schema.url).toBe('https://capital.distilledfunding.com/jane-smith');
  });

  it('uses full canonical URLs for partner nested pages', () => {
    const routes = [
      '/funding/working-capital',
      '/industries/hvac',
      '/resources/funding-readiness',
      '/campaign/hvac',
    ];

    for (const path of routes) {
      const metadata = constructPartnerMetadata({
        slug: 'darwin-hanneman',
        partnerName: 'Darwin Hanneman',
        path,
        pageTitle: 'Funding Page',
      });
      expect(metadata.alternates?.canonical).toBe(`https://capital.distilledfunding.com/darwin-hanneman${path}`);
      expect(metadata.openGraph?.url).toBe(`https://capital.distilledfunding.com/darwin-hanneman${path}`);
    }
  });

  it('uses canonical top-level URLs in directory ItemList schema', () => {
    const schema = generateItemListSchema([{ slug: 'jane-smith' }, { slug: 'alex-doe' }]);
    expect(schema.itemListElement.map((item) => item.url)).toEqual([
      'https://capital.distilledfunding.com/jane-smith',
      'https://capital.distilledfunding.com/alex-doe',
    ]);
  });

  it('does not leak stale or deployment domains from canonical helpers', () => {
    const outputs = [
      SITE_CONFIG.canonicalOrigin,
      getCanonicalUrl('/directory'),
      getCanonicalPartnerUrl('jane-smith'),
      JSON.stringify(generatePartnerSchema({ slug: 'jane-smith', name: 'Jane Smith' })),
    ].join(' ');

    expect(outputs).not.toContain('moonshinecapital.com');
    expect(outputs).not.toContain('.vercel.app');
  });
});
