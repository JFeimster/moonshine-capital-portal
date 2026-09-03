import { promises as fs } from 'fs';
import path from 'path';

export interface FundingCta {
  label: string;
  href?: string;
  trackingId?: string;
}

export interface QualificationSignals {
  minCreditScoreGuide?: number;
  minMonthlyRevenueGuide?: number;
  minTimeInBusinessMonthsGuide?: number;
  creditTier?: string[];
  speedProfile?: string;
  [key: string]: unknown;
}

export interface FundingProductFamily {
  id: string;
  slug: string;
  route: string;
  name: string;
  publicName: string;
  category: string;
  summary: string;
  bestFitBorrower: string[];
  avoidWhen: string[];
  commonUseCases: string[];
  qualificationSignals: QualificationSignals;
  speedProfile: string;
  requiredDocuments: string[];
  fastDisqualifiers: string[];
  relatedProductIds: string[];
  relatedProviderIds: string[];
  relatedToolIds: string[];
  primaryCta?: FundingCta;
  status: string;
  visibility: string;
  needsReview?: boolean;
}

export interface FundingPageSection {
  id: string;
  type: string;
  title: string;
  source?: string;
  filters?: Record<string, unknown>;
  itemIds?: string[];
  formId?: string;
}

export interface FundingPage {
  id: string;
  slug: string;
  route: string;
  template: string;
  status: string;
  visibility: string;
  nav: {
    label: string;
    group: string;
    order: number;
    showInHeader: boolean;
    showInFooter: boolean;
  };
  seo: {
    title: string;
    description: string;
    canonical: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
    schemaType: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    primaryCta: FundingCta;
    secondaryCta?: FundingCta;
  };
  pageIntent?: string[];
  audiences?: string[];
  sections?: FundingPageSection[];
  dataRefs?: {
    productFamilyIds?: string[];
    featuredProductIds?: string[];
    featuredProviderIds?: string[];
    featuredToolIds?: string[];
    featuredGptIds?: string[];
    formIds?: string[];
  };
  filters?: {
    enabled: boolean;
    fields: string[];
  };
  compliance?: {
    reviewStatus: string;
    disclaimer: string;
    forbiddenClaims: string[];
  };
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
  minAmount: number;
  maxAmount: number;
  minCreditScore: number;
  minMonthlyRevenue: number;
  minMonthlyRevenueNote?: string | null;
  minTimeInBusinessMonths: number;
  creditTier: string;
  termLength: string;
  paymentType: string;
  rateCostRange: string;
  timeToFunding: string;
  startupEligible: boolean;
  cta?: FundingCta;
  visibility?: string;
}

export interface FundingProvider {
  id: string;
  slug: string;
  name: string;
  categories: string[];
  productFamilyIds: string[];
  financingProducts: string[];
  geographicCoverage: string[];
  industryAppetite: string[];
  restrictedIndustries: string[];
  typicalBorrowerProfile: string;
  eligibility: {
    minCreditScore?: number;
    minMonthlyRevenue?: number;
    minTimeInBusiness?: string;
  };
  speedToFunding?: string;
  cta?: FundingCta;
  status?: string;
  visibility?: string;
}

export interface ToolItem {
  id?: string;
  slug: string;
  name?: string;
  brand?: string;
  persona?: string;
  problem?: string;
  ctaLabel?: string;
  ctaHref?: string;
  [key: string]: unknown;
}

const DEPRECATED_OR_INTERNAL_SLUGS = new Set(['structured-growth-loans']);

function isPublicProductFamily(family: FundingProductFamily): boolean {
  if (!family || !family.slug) return false;
  if (DEPRECATED_OR_INTERNAL_SLUGS.has(family.slug)) return false;
  if (family.visibility !== 'public') return false;
  if (family.status === 'deprecated' || family.status === 'internal' || family.status === 'archived') return false;
  return true;
}

async function readJsonFile<T>(relativePath: string): Promise<T> {
  const filePath = path.join(process.cwd(), ...relativePath.split('/'));
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

export async function getAllProductFamilies(): Promise<FundingProductFamily[]> {
  const data = await readJsonFile<{ entries: FundingProductFamily[] }>('data/funding/funding-product-families.registry.json');
  return data.entries || [];
}

export async function getPublicProductFamilies(): Promise<FundingProductFamily[]> {
  const families = await getAllProductFamilies();
  return families.filter(isPublicProductFamily);
}

export async function getProductFamilyBySlug(slug: string): Promise<FundingProductFamily | null> {
  if (!slug || DEPRECATED_OR_INTERNAL_SLUGS.has(slug)) return null;
  const families = await getPublicProductFamilies();
  return families.find((f) => f.slug === slug) ?? null;
}

export async function getAllFundingPages(): Promise<FundingPage[]> {
  const data = await readJsonFile<{ pages: FundingPage[] }>('data/pages/funding-pages.registry.json');
  return data.pages || [];
}

export async function getFundingHubPage(): Promise<FundingPage | null> {
  const pages = await getAllFundingPages();
  return pages.find((p) => p.slug === 'funding') ?? null;
}

export async function getFundingPageForFamily(familySlug: string): Promise<FundingPage | null> {
  if (!familySlug || DEPRECATED_OR_INTERNAL_SLUGS.has(familySlug)) return null;
  const pages = await getAllFundingPages();
  return (
    pages.find(
      (p) =>
        p.dataRefs?.productFamilyIds?.includes(familySlug) ||
        p.slug === familySlug
    ) ?? null
  );
}

export async function getAllFundingProducts(): Promise<FundingProduct[]> {
  const data = await readJsonFile<{ entries: FundingProduct[] }>('data/funding/funding-products.registry.json');
  return data.entries || [];
}

export async function getProductsByFamily(familySlug: string): Promise<FundingProduct[]> {
  if (!familySlug || DEPRECATED_OR_INTERNAL_SLUGS.has(familySlug)) return [];
  const products = await getAllFundingProducts();
  return products.filter((p) => p.productFamily === familySlug && p.visibility !== 'internal_only');
}

export async function getAllFundingProviders(): Promise<FundingProvider[]> {
  const data = await readJsonFile<{ entries: FundingProvider[] }>('data/funding/funding-providers.registry.json');
  return data.entries || [];
}

export async function getProvidersByFamily(familySlug: string): Promise<FundingProvider[]> {
  if (!familySlug || DEPRECATED_OR_INTERNAL_SLUGS.has(familySlug)) return [];
  const providers = await getAllFundingProviders();
  return providers.filter((p) => p.productFamilyIds && p.productFamilyIds.includes(familySlug));
}

export async function getRelatedFamilies(currentSlug: string): Promise<FundingProductFamily[]> {
  const publicFamilies = await getPublicProductFamilies();
  return publicFamilies.filter((f) => f.slug !== currentSlug);
}

export async function getFundingTools(toolIds?: string[]): Promise<ToolItem[]> {
  const data = await readJsonFile<{ entries: ToolItem[] }>('data/embeds/tool-registry.json');
  const entries = data.entries || [];
  if (!toolIds || toolIds.length === 0) {
    return entries.slice(0, 6);
  }
  return entries.filter((t) => (t.id && toolIds.includes(t.id)) || toolIds.includes(t.slug));
}
