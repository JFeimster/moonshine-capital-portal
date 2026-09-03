import { describe, expect, it } from 'vitest';
import {
  getPartnerFundingPage,
  getPartnerIndustryPage,
  getPartnerTool,
  getPartnerResource,
  listPartnerFundingPages,
  listPartnerIndustryPages,
} from '../lib/partner-site';

describe('partner site content adapter', () => {
  it('exposes funding pages from the existing registry', () => {
    const fundingPages = listPartnerFundingPages();
    expect(fundingPages.length).toBeGreaterThan(0);
    expect(fundingPages.some((item) => item.slug === 'working-capital')).toBe(true);

    const page = getPartnerFundingPage('working-capital');
    expect(page?.title).toContain('Working Capital');
    expect(page?.relatedIndustrySlugs.length).toBeGreaterThan(0);
  });

  it('exposes a supported set of industry pages', () => {
    const industries = listPartnerIndustryPages();
    expect(industries.some((item) => item.slug === 'construction')).toBe(true);

    const page = getPartnerIndustryPage('construction');
    expect(page?.title).toContain('Construction');
    expect(page?.relevantFundingSlugs.length).toBeGreaterThan(0);
  });

  it('reads tools and resources from the shared registry', async () => {
    const tool = await getPartnerTool('the-premium-finance-gap-calculator');
    expect(tool?.title).toBeTruthy();

    const resource = await getPartnerResource('the-premium-finance-gap-calculator');
    expect(resource).toBeNull();
  });
});
