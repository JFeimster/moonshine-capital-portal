import { describe, expect, it } from 'vitest';
import { getPartnerFundingPage, listPartnerFundingPages, listPartnerIndustryPages } from '../lib/partner-site';
import { createBreadcrumbSchema, createFaqSchema, createItemListSchema, createPartnerIdentitySchema, getPartnerCanonicalUrl, serializeJsonLd } from '../lib/partner-schema';
import type { BrokerProfile } from '../lib/types';

const sparseBroker: BrokerProfile = {
  id: 'jane', fullName: 'Jane Smith', displayName: 'Jane Smith', agencyName: '', slug: 'jane-smith', shortBio: '', city: '', state: '', publicEmail: '', whyChooseYou: '',
  industries: [], fundingTypes: [], urgencyCategory: 'standard', approvalStatus: 'approved', profileStatus: 'published', isActive: true,
};

describe('partner structured data', () => {
  it('describes the real advisor and omits sparse contact fields and fabricated claims', () => {
    const schema = createPartnerIdentitySchema(sparseBroker);
    const text = JSON.stringify(schema);
    expect(text).toContain('Jane Smith');
    expect(text).not.toContain('email');
    expect(text).not.toContain('telephone');
    expect(text).not.toMatch(/rating|review|approvalRate|fundingVolume|license|award/i);
  });

  it('serializes user text without executable script delimiters', () => {
    const output = serializeJsonLd({ text: '<script>& dangerous > value' });
    expect(output).toBe('{"text":"\\u003cscript\\u003e\\u0026 dangerous \\u003e value"}');
  });

  it('builds canonical breadcrumbs and excludes transactional routes from lists', () => {
    const schema = createBreadcrumbSchema('jane-smith', 'Jane Smith', [{ label: 'Funding', path: 'funding' }, { label: 'Working Capital', path: 'funding/working-capital' }]);
    expect(schema.itemListElement).toEqual([
      { '@type': 'ListItem', position: 1, name: 'Jane Smith', item: getPartnerCanonicalUrl('jane-smith') },
      { '@type': 'ListItem', position: 2, name: 'Funding', item: getPartnerCanonicalUrl('jane-smith', 'funding') },
      { '@type': 'ListItem', position: 3, name: 'Working Capital', item: getPartnerCanonicalUrl('jane-smith', 'funding/working-capital') },
    ]);
    const list = createItemListSchema([{ name: 'Working Capital', url: getPartnerCanonicalUrl('jane-smith', 'funding/working-capital') }]);
    expect(JSON.stringify(list)).not.toContain('/apply');
    expect(JSON.stringify(list)).not.toContain('/book');
  });

  it('uses registry FAQ data and inventory counts', () => {
    const funding = listPartnerFundingPages();
    const page = getPartnerFundingPage(funding[0].slug);
    expect(page).toBeTruthy();
    const faq = createFaqSchema(page!.faq);
    expect(faq?.mainEntity).toHaveLength(page!.faq.length);
    expect(createItemListSchema(listPartnerIndustryPages().map((item) => ({ name: item.title, url: getPartnerCanonicalUrl('jane-smith', `industries/${item.slug}`) }))).numberOfItems).toBe(listPartnerIndustryPages().length);
  });
});
