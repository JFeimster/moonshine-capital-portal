import { describe, it, expect } from 'vitest';
import {
  getPublicProductFamilies,
  getProductFamilyBySlug,
  getFundingHubPage,
  getFundingPageForFamily,
  getProductsByFamily,
  getProvidersByFamily,
  getRelatedFamilies,
  getFundingTools,
} from '../lib/funding-registry';

describe('Funding Registry Data Helper Functions', () => {
  it('loads public product families excluding structured-growth-loans and deprecated items', async () => {
    const families = await getPublicProductFamilies();
    expect(families.length).toBeGreaterThan(0);
    const slugs = families.map((f) => f.slug);

    expect(slugs).not.toContain('structured-growth-loans');
    expect(slugs).toContain('working-capital');
    expect(slugs).toContain('startup-credit-leverage');
    expect(slugs).toContain('business-line-access');
    expect(slugs).toContain('equipment-finance');
    expect(slugs).toContain('real-estate-capital');
    expect(slugs).toContain('marketplace-capital');
  });

  it('returns null when querying internal or deprecated product family slugs directly', async () => {
    const structuredGrowth = await getProductFamilyBySlug('structured-growth-loans');
    expect(structuredGrowth).toBeNull();

    const nonExistent = await getProductFamilyBySlug('non-existent-family-slug');
    expect(nonExistent).toBeNull();
  });

  it('correctly resolves valid public product families', async () => {
    const workingCapital = await getProductFamilyBySlug('working-capital');
    expect(workingCapital).not.toBeNull();
    expect(workingCapital?.slug).toBe('working-capital');
    expect(workingCapital?.name).toBe('Working Capital');
  });

  it('loads the funding hub page metadata from registry', async () => {
    const page = await getFundingHubPage();
    expect(page).not.toBeNull();
    expect(page?.slug).toBe('funding');
    expect(page?.hero.headline).toBeDefined();
  });

  it('loads matching page metadata for a public family', async () => {
    const realEstatePage = await getFundingPageForFamily('real-estate-capital');
    expect(realEstatePage).not.toBeNull();
    expect(realEstatePage?.dataRefs?.productFamilyIds).toContain('real-estate-capital');

    const deprecatedPage = await getFundingPageForFamily('structured-growth-loans');
    expect(deprecatedPage).toBeNull();
  });

  it('fetches products associated with a family and filters out internal_only items', async () => {
    const products = await getProductsByFamily('working-capital');
    expect(products.length).toBeGreaterThan(0);
    expect(products.every((p) => p.productFamily === 'working-capital')).toBe(true);

    const deprecatedProducts = await getProductsByFamily('structured-growth-loans');
    expect(deprecatedProducts).toEqual([]);
  });

  it('fetches providers associated with a family', async () => {
    const providers = await getProvidersByFamily('real-estate-capital');
    expect(providers.length).toBeGreaterThan(0);
    expect(providers.every((p) => p.productFamilyIds.includes('real-estate-capital'))).toBe(true);

    const deprecatedProviders = await getProvidersByFamily('structured-growth-loans');
    expect(deprecatedProviders).toEqual([]);
  });

  it('returns related families without current slug or structured-growth-loans', async () => {
    const related = await getRelatedFamilies('working-capital');
    const slugs = related.map((f) => f.slug);
    expect(slugs).not.toContain('working-capital');
    expect(slugs).not.toContain('structured-growth-loans');
    expect(related.length).toBeGreaterThan(0);
  });

  it('verifies public families match expected count of 6', async () => {
    const families = await getPublicProductFamilies();
    const slugs = families.map((p) => p.slug);
    expect(slugs).not.toContain('structured-growth-loans');
    expect(slugs.length).toBe(6);
  });

  it('fetches funding tools for display', async () => {
    const tools = await getFundingTools();
    expect(tools.length).toBeGreaterThan(0);
  });
});
