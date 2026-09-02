import fs from 'fs';
import path from 'path';

export interface FundingPageNav {
  label: string;
  group: string;
  order: number;
  showInHeader: boolean;
  showInFooter: boolean;
}

export interface FundingPageSeo {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  schemaType: string;
}

export interface CtaLink {
  label: string;
  href?: string;
  trackingId?: string;
}

export interface FundingPageHero {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta?: CtaLink;
  secondaryCta?: CtaLink;
}

export interface FundingPageSection {
  id: string;
  type: string;
  title: string;
  description?: string;
  source?: string;
  itemIds?: string[];
  filters?: Record<string, unknown>;
  formId?: string;
}

export interface FundingPageDataRefs {
  productFamilyIds?: string[];
  featuredProductIds?: string[];
  featuredProviderIds?: string[];
  featuredToolIds?: string[];
  featuredGptIds?: string[];
  formIds?: string[];
}

export interface FundingPageCompliance {
  reviewStatus: string;
  disclaimer: string;
  forbiddenClaims: string[];
}

export interface FundingPage {
  id: string;
  slug: string;
  route: string;
  template: string;
  status: string;
  visibility: 'public' | 'internal';
  nav?: FundingPageNav;
  seo?: FundingPageSeo;
  hero: FundingPageHero;
  pageIntent?: string[];
  audiences?: string[];
  sections: FundingPageSection[];
  dataRefs?: FundingPageDataRefs;
  filters?: Record<string, unknown>;
  compliance: FundingPageCompliance;
}

export interface QualificationSignals {
  minCreditScoreGuide?: number | null;
  minMonthlyRevenueGuide?: number | null;
  minTimeInBusinessMonthsGuide?: number | null;
  creditTier?: string[];
  repaymentSource?: string;
}

export interface SpeedProfile {
  label: string;
  typicalTimeToFunding: string;
}

export interface ProductFamily {
  id: string;
  slug: string;
  route: string | null;
  name: string;
  publicName: string;
  category: string;
  summary: string;
  bestFitBorrower?: string[];
  avoidWhen?: string[];
  commonUseCases?: string[];
  qualificationSignals: QualificationSignals;
  speedProfile?: SpeedProfile | null;
  requiredDocuments?: string[];
  fastDisqualifiers?: string[];
  relatedProductIds: string[];
  relatedProviderIds: string[];
  relatedToolIds?: string[];
  primaryCta?: CtaLink;
  status: 'draft' | 'active' | 'deprecated';
  visibility: 'public' | 'internal';
  deprecated?: boolean;
  mergedInto?: string[];
  needsReview?: string[];
}

export interface FundingProduct {
  id: string;
  slug: string;
  name: string;
  providerName: string;
  providerId: string;
  productFamily: string;
  category: string;
  fundingType: string;
  minAmount?: number | null;
  maxAmount?: number | null;
  minCreditScore?: number | null;
  minMonthlyRevenue?: number | null;
  minMonthlyRevenueNote?: string | null;
  minTimeInBusinessMonths?: number | null;
  creditTier?: string;
  termLength?: string;
  paymentType?: string;
  rateCostRange?: string;
  timeToFunding?: string;
  startupEligible?: boolean;
  cta?: CtaLink;
  visibility: 'public' | 'internal';
  status: string;
  familyNote?: string;
}

export interface FundingProvider {
  id: string;
  slug: string;
  name: string;
  categories?: string[];
  productFamilyIds: string[];
  financingProducts?: string[];
  geographicCoverage?: string[];
  industryAppetite?: string[];
  restrictedIndustries?: string[];
  typicalBorrowerProfile?: string;
  eligibility?: {
    minCreditScore?: number | null;
    minMonthlyRevenue?: number | null;
    minTimeInBusinessMonths?: number | null;
  };
  requirements?: {
    pgType?: string | null;
    disqualifiers?: string[] | null;
    requirementsNote?: string | null;
  };
  terms?: {
    fundingAmountText?: string | null;
  };
  affiliate?: {
    affiliateStatus?: string;
    directory?: string[];
    affiliateUrl?: string | null;
    applyUrl?: string | null;
    commissionRate?: string | null;
    contactEmail?: string | null;
    keyContact?: string | null;
    website?: string | null;
  };
}

export interface ToolRegistryItem {
  id?: string;
  slug: string;
  name?: string;
  title?: string;
  description?: string;
  kind?: string;
  category?: string;
  resourceType?: string;
  renderType?: string;
  accessLevel?: string;
  status?: string;
  url?: string;
  ctaLabel?: string;
  ctaHref?: string;
  tags?: string[];
  audience?: string[];
  verticals?: string[];
  useCases?: string[];
  featured?: boolean;
  relatedFamilyIds?: string[];
}

function readJsonFile<T>(relativePath: string): T {
  const filePath = path.join(process.cwd(), relativePath);
  const content = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(content) as T;
}

export function getFundingPagesRegistry(): { pages: FundingPage[] } {
  return readJsonFile<{ pages: FundingPage[] }>('data/pages/funding-pages.registry.json');
}

export function getProductFamiliesRegistry(): { entries: ProductFamily[] } {
  return readJsonFile<{ entries: ProductFamily[] }>('data/funding/funding-product-families.registry.json');
}

export function getProductsRegistry(): { entries: FundingProduct[]; familyCounts: Record<string, number> } {
  return readJsonFile<{ entries: FundingProduct[]; familyCounts: Record<string, number> }>('data/funding/funding-products.registry.json');
}

export function getProvidersRegistry(): { entries: FundingProvider[] } {
  return readJsonFile<{ entries: FundingProvider[] }>('data/funding/funding-providers.registry.json');
}

export function getToolRegistry(): { tools?: ToolRegistryItem[]; entries?: ToolRegistryItem[] } {
  return readJsonFile<{ tools?: ToolRegistryItem[]; entries?: ToolRegistryItem[] }>('data/embeds/tool-registry.json');
}

export function getPublicProductFamilies(): ProductFamily[] {
  const registry = getProductFamiliesRegistry();
  return (registry.entries || []).filter(
    (family) => family.visibility === 'public' && family.status !== 'deprecated' && !family.deprecated
  );
}

export function getPublicFundingPages(): FundingPage[] {
  const registry = getFundingPagesRegistry();
  return (registry.pages || []).filter((page) => page.visibility === 'public');
}

export interface ResolvedFamilyRoute {
  page: FundingPage;
  family: ProductFamily;
  products: FundingProduct[];
  providers: FundingProvider[];
  relatedFamilies: ProductFamily[];
}

export function resolveFundingFamilyBySlug(slug: string): ResolvedFamilyRoute | null {
  const publicPages = getPublicFundingPages();
  const publicFamilies = getPublicProductFamilies();

  // Find family by matching family.slug, family.id, page.slug, or family.route === page.route
  let matchedFamily: ProductFamily | undefined;
  let matchedPage: FundingPage | undefined;

  // First try page by slug
  matchedPage = publicPages.find((p) => p.slug === slug);
  if (matchedPage) {
    matchedFamily = publicFamilies.find(
      (f) => f.route === matchedPage?.route || f.slug === slug || f.id === slug
    );
  }

  // If page not found, try family directly by slug or id
  if (!matchedFamily) {
    matchedFamily = publicFamilies.find((f) => f.slug === slug || f.id === slug);
    if (matchedFamily) {
      matchedPage = publicPages.find((p) => p.route === matchedFamily?.route);
    }
  }

  // If no family or family is deprecated/internal, return null
  if (!matchedFamily || matchedFamily.visibility !== 'public' || matchedFamily.status === 'deprecated' || matchedFamily.deprecated) {
    return null;
  }

  // Fallback default page if no page record exists for this public family
  if (!matchedPage) {
    matchedPage = {
      id: matchedFamily.id,
      slug: matchedFamily.slug,
      route: matchedFamily.route || `/funding/${matchedFamily.slug}`,
      template: 'product-family-hub',
      status: matchedFamily.status,
      visibility: 'public',
      hero: {
        eyebrow: matchedFamily.publicName || matchedFamily.name,
        headline: `${matchedFamily.publicName || matchedFamily.name} Solutions`,
        subheadline: matchedFamily.summary,
        primaryCta: matchedFamily.primaryCta,
      },
      sections: [],
      compliance: {
        reviewStatus: 'active',
        disclaimer: 'Funding availability, terms, speed, and eligibility vary by provider, applicant profile, documentation, and underwriting review. No approval or funding outcome is guaranteed.',
        forbiddenClaims: ['guaranteed approval', 'guaranteed funding'],
      },
    };
  }

  const allProducts = getProductsRegistry().entries || [];
  const allProviders = getProvidersRegistry().entries || [];

  // Related products
  const familyProducts = allProducts.filter((p) => p.productFamily === matchedFamily?.id);

  // Related providers
  const familyProviders = allProviders.filter(
    (p) => matchedFamily?.relatedProviderIds.includes(p.id) || p.productFamilyIds.includes(matchedFamily!.id)
  );

  // Related product families (other public families)
  const relatedFamilies = publicFamilies.filter((f) => f.id !== matchedFamily?.id);

  return {
    page: matchedPage,
    family: matchedFamily,
    products: familyProducts,
    providers: familyProviders,
    relatedFamilies,
  };
}
