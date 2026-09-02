import { describe, expect, it } from 'vitest';
import {
  getFundingPagesRegistry,
  getProductFamiliesRegistry,
  getPublicProductFamilies,
  getPublicFundingPages,
  resolveFundingFamilyBySlug,
} from '../lib/funding-registry';

describe('Funding Registry & Route Resolution', () => {
  it('reads public pages from funding-pages registry', () => {
    const registry = getFundingPagesRegistry();
    expect(registry.pages).toBeDefined();
    expect(registry.pages.length).toBeGreaterThan(0);

    const publicPages = getPublicFundingPages();
    expect(publicPages.length).toBeGreaterThan(0);

    const hubPage = publicPages.find((p) => p.id === 'funding');
    expect(hubPage).toBeDefined();
    expect(hubPage?.visibility).toBe('public');
    expect(hubPage?.hero.headline).toContain('capital lane');
  });

  it('reads public product families from funding-product-families registry', () => {
    const registry = getProductFamiliesRegistry();
    expect(registry.entries).toBeDefined();

    const publicFamilies = getPublicProductFamilies();
    expect(publicFamilies.length).toBe(6); // 6 public families, excluding structured-growth-loans

    const familyIds = publicFamilies.map((f) => f.id);
    expect(familyIds).not.toContain('structured-growth-loans');
  });

  it('resolves valid public family slugs correctly with products and providers', () => {
    const resolved = resolveFundingFamilyBySlug('working-capital');
    expect(resolved).not.toBeNull();
    if (!resolved) return;

    expect(resolved.family.id).toBe('working-capital');
    expect(resolved.page.id).toBe('working-capital');
    expect(resolved.products.length).toBeGreaterThan(0);
    expect(resolved.providers.length).toBeGreaterThan(0);
    expect(resolved.relatedFamilies.length).toBe(5);
  });

  it('resolves mapped page slugs correctly (e.g., startup-funding -> startup-credit-leverage)', () => {
    const resolved = resolveFundingFamilyBySlug('startup-funding');
    expect(resolved).not.toBeNull();
    if (!resolved) return;

    expect(resolved.family.id).toBe('startup-credit-leverage');
    expect(resolved.page.id).toBe('startup-funding');
    expect(resolved.products.length).toBeGreaterThan(0);
  });

  it('returns null for deprecated/internal family structured-growth-loans', () => {
    const resolvedBySlug = resolveFundingFamilyBySlug('structured-growth-loans');
    expect(resolvedBySlug).toBeNull();
  });

  it('returns null for non-existent family slugs', () => {
    const resolved = resolveFundingFamilyBySlug('invalid-non-existent-family');
    expect(resolved).toBeNull();
  });
});
