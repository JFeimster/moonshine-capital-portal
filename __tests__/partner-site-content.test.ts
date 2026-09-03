import { describe, expect, it } from 'vitest';
import manifest from '../data/partner-site/manifest.json';
import { getRegistryDestination } from '../lib/embed-registry';
import {
  getPartnerFundingPage,
  getPartnerIndustryPage,
  getPartnerTool,
  getPartnerResource,
  getPartnerCampaign,
  getPartnerToolsForContext,
  listPartnerResourcePages,
  listPartnerFundingPages,
  listPartnerIndustryPages,
  listPartnerCampaigns,
} from '../lib/partner-site';

describe('partner site content adapter', () => {
  it('exposes funding pages from the existing registry', () => {
    const fundingPages = listPartnerFundingPages();
    expect(fundingPages.length).toBeGreaterThanOrEqual(manifest.counts.funding);
    expect(fundingPages.some((item) => item.slug === 'working-capital')).toBe(true);
    expect(getPartnerFundingPage('business-acquisition')).not.toBeNull();
    expect(getPartnerFundingPage('merchant-cash-advance')).not.toBeNull();
    expect(fundingPages.some((item) => item.slug === 'structured-growth-loans')).toBe(false);

    const page = getPartnerFundingPage('working-capital');
    expect(page?.title).toContain('Working Capital');
    expect(page?.description).toContain('Flexible business capital');
    expect(page?.whatToPrepare).toContain('Recent business bank statements');
    expect(page?.relatedIndustrySlugs.length).toBeGreaterThan(0);
  });

  it('exposes a supported set of industry pages', () => {
    const industries = listPartnerIndustryPages();
    expect(industries.length).toBeGreaterThanOrEqual(manifest.counts.industries);
    expect(industries.some((item) => item.slug === 'construction')).toBe(true);
    expect(getPartnerIndustryPage('hvac')).not.toBeNull();
    expect(getPartnerIndustryPage('amazon-sellers')).not.toBeNull();
    expect(getPartnerIndustryPage('staffing')).not.toBeNull();

    const page = getPartnerIndustryPage('hvac');
    expect(page?.title).toBe('HVAC');
    expect(page?.relevantFundingSlugs.length).toBeGreaterThan(0);
  });

  it('resolves structured resources and campaigns', async () => {
    expect((await listPartnerResourcePages()).length).toBeGreaterThanOrEqual(manifest.counts.resources);
    const resource = await getPartnerResource('funding-readiness');
    expect(await getPartnerResource('loan-stacking-risks')).not.toBeNull();
    expect(resource && 'sections' in resource && resource.sections.length).toBeGreaterThan(0);
    expect(getPartnerCampaign('hvac')?.headline).toContain('crews moving');
    expect(getPartnerCampaign('commercial-real-estate')).not.toBeNull();
    expect(await getPartnerResource('does-not-exist')).toBeNull();
  });

  it('keeps campaign inventory at the v2 threshold', async () => {
    const campaigns = (await import('../data/partner-site/campaigns.registry.json')).entries;
    expect(campaigns.length).toBeGreaterThanOrEqual(manifest.counts.campaigns);
    expect(listPartnerCampaigns().length).toBeGreaterThanOrEqual(manifest.counts.campaigns);
  });

  it('reads tools and resources from the shared registry', async () => {
    const tool = await getPartnerTool('the-premium-finance-gap-calculator');
    expect(tool?.title).toBeTruthy();

    const resource = await getPartnerResource('the-premium-finance-gap-calculator');
    expect(resource).toBeNull();
    const tools = await getPartnerToolsForContext('business-acquisition');
    expect(tools.every((item) => item.status === 'active' && getRegistryDestination(item) !== '#')).toBe(true);
    expect(await getPartnerToolsForContext('construction')).toEqual([]);
  });
});
