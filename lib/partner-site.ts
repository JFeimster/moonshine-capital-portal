import { readFileSync } from 'fs';
import path from 'path';
import { getRegistryDestination, getToolBySlug, getToolsByKind, type ToolRegistryItem } from './embed-registry';
import { getPartnerContactActions, getPartnerDisplaySpecialties, getPartnerSupportLine, getPrioritizedPartnerFunding, getPrioritizedPartnerIndustries } from './partner-personalization';
export { getPartnerContactActions, getPartnerDisplaySpecialties, getPartnerSupportLine, getPrioritizedPartnerFunding, getPrioritizedPartnerIndustries } from './partner-personalization';

type FAQItem = { question: string; answer: string };

type FundingFamily = {
  slug: string;
  route?: string | null;
  name?: string;
  publicName?: string;
  summary?: string;
  commonUseCases?: string[];
  bestFitBorrower?: string[];
  requiredDocuments?: string[];
  relatedToolIds?: string[];
  visibility?: string;
  status?: string;
  deprecated?: boolean;
};

type FundingOverlay = {
  slug: string;
  title?: string;
  description?: string;
  summary?: string;
  useCases?: string[];
  whoItMayFit?: string[];
  whatToPrepare?: string[];
  relatedIndustrySlugs?: string[];
  relatedFundingSlugs?: string[];
  relatedResourceSlugs?: string[];
  relatedToolSlugs?: string[];
  faq?: FAQItem[];
};

type RegistryFile<T> = { entries?: T[] };
type PlacementRegistryFile = { placements?: PartnerToolPlacement[] };

export interface PartnerFundingPage {
  slug: string;
  title: string;
  description: string;
  summary: string;
  useCases: string[];
  whoItMayFit: string[];
  whatToPrepare: string[];
  relatedIndustrySlugs: string[];
  relatedFundingSlugs: string[];
  relatedResourceSlugs: string[];
  relatedToolSlugs: string[];
  faq: FAQItem[];
}

export interface PartnerIndustryPage {
  slug: string;
  title: string;
  description: string;
  summary: string;
  capitalPressures: string[];
  relevantFundingSlugs: string[];
  relatedResourceSlugs: string[];
  relatedToolSlugs: string[];
  faq: FAQItem[];
}

export interface PartnerResourceSection {
  heading: string;
  body?: string;
  items?: string[];
}

export interface PartnerResourcePage {
  slug: string;
  title: string;
  description: string;
  summary: string;
  resourceType: string;
  sections: PartnerResourceSection[];
  ctaLabel: string;
  relatedFundingSlugs: string[];
  relatedIndustrySlugs: string[];
}

export interface PartnerCampaign {
  slug: string;
  eyebrow: string;
  headline: string;
  summary: string;
  useCases: string[];
  industrySlugs: string[];
  fundingSlugs: string[];
  primaryCtaLabel: string;
  secondaryCtaMode: string;
}

export interface PartnerToolPlacement {
  context: string;
  candidateToolSlugs: string[];
}

const dataPath = (...segments: string[]) => path.join(process.cwd(), 'data', ...segments);

function readRegistry<T>(...segments: string[]): RegistryFile<T> {
  return JSON.parse(readFileSync(dataPath(...segments), 'utf-8')) as RegistryFile<T>;
}

export function listPartnerFundingPages(): PartnerFundingPage[] {
  const canonical = readRegistry<FundingFamily>('funding', 'funding-product-families.registry.json').entries ?? [];
  const overlayEntries = readRegistry<FundingOverlay>('partner-site', 'funding-pages.registry.json').entries ?? [];
  const overlays = new Map(overlayEntries.filter((entry) => entry.slug).map((entry) => [entry.slug, entry]));
  const publicCanonical = canonical.filter((entry) => {
    if (!entry.slug || overlays.has(entry.slug)) return Boolean(entry.slug);
    return entry.status !== 'deprecated' && !entry.deprecated && entry.visibility !== 'internal' && Boolean(entry.route);
  });

  return [...publicCanonical, ...overlayEntries.filter((entry) => entry.slug && !canonical.some((item) => item.slug === entry.slug))].map((entry) => {
    const overlay = overlays.get(entry.slug);
    const canonicalEntry = canonical.find((item) => item.slug === entry.slug);
    return {
      slug: entry.slug,
      title: overlay?.title ?? canonicalEntry?.publicName ?? canonicalEntry?.name ?? 'Funding Option',
      description: overlay?.description ?? canonicalEntry?.summary ?? 'Funding option information.',
      summary: overlay?.summary ?? canonicalEntry?.summary ?? 'Funding option information.',
      useCases: overlay?.useCases ?? canonicalEntry?.commonUseCases ?? [],
      whoItMayFit: overlay?.whoItMayFit ?? canonicalEntry?.bestFitBorrower ?? [],
      whatToPrepare: overlay?.whatToPrepare ?? canonicalEntry?.requiredDocuments ?? [],
      relatedIndustrySlugs: overlay?.relatedIndustrySlugs ?? [],
      relatedFundingSlugs: overlay?.relatedFundingSlugs ?? [],
      relatedResourceSlugs: overlay?.relatedResourceSlugs ?? [],
      relatedToolSlugs: overlay?.relatedToolSlugs ?? canonicalEntry?.relatedToolIds ?? [],
      faq: overlay?.faq ?? [
        { question: 'Who is this typically best for?', answer: canonicalEntry?.bestFitBorrower?.[0] || 'This capital lane is most useful when the business has a clear use case and repayment source.' },
        { question: 'What should I prepare?', answer: canonicalEntry?.requiredDocuments?.[0] || 'Prepare recent business financials, use-case details, and an outline of the financing need.' },
      ],
    };
  });
}

export function getPartnerFundingPage(slug: string): PartnerFundingPage | null {
  return listPartnerFundingPages().find((page) => page.slug === slug) ?? null;
}

export function listPartnerIndustryPages(): PartnerIndustryPage[] {
  return (readRegistry<PartnerIndustryPage>('partner-site', 'industry-pages.registry.json').entries ?? []).filter((entry) => entry.slug);
}

export function getPartnerIndustryPage(slug: string): PartnerIndustryPage | null {
  return listPartnerIndustryPages().find((page) => page.slug === slug) ?? null;
}

export async function listPartnerToolPages(): Promise<ToolRegistryItem[]> {
  return (await getToolsByKind('tool')).filter((tool) => tool.accessLevel === 'public' && getRegistryDestination(tool) !== '#').slice(0, 12);
}

export async function getPartnerTool(slug: string): Promise<ToolRegistryItem | null> {
  return getToolBySlug(slug);
}

export async function listPartnerResourcePages(): Promise<Array<PartnerResourcePage | ToolRegistryItem>> {
  const structured = (readRegistry<PartnerResourcePage>('partner-site', 'resource-pages.registry.json').entries ?? []).filter((entry) => entry.slug);
  return [...structured, ...(await getToolsByKind('resource')).slice(0, 10)];
}

export async function getPartnerResource(slug: string): Promise<PartnerResourcePage | ToolRegistryItem | null> {
  const structured = (readRegistry<PartnerResourcePage>('partner-site', 'resource-pages.registry.json').entries ?? []).find((entry) => entry.slug === slug);
  if (structured) return structured;
  const item = await getToolBySlug(slug);
  if (!item || item.kind !== 'resource') return null;
  return item;
}

export function getPartnerCampaign(slug: string): PartnerCampaign | null {
  return (readRegistry<PartnerCampaign>('partner-site', 'campaigns.registry.json').entries ?? []).find((entry) => entry.slug === slug) ?? null;
}

export function listPartnerCampaigns(): PartnerCampaign[] {
  return (readRegistry<PartnerCampaign>('partner-site', 'campaigns.registry.json').entries ?? []).filter((entry) => entry.slug);
}

export async function getPartnerToolsForContext(context: string): Promise<ToolRegistryItem[]> {
  const placement = (JSON.parse(readFileSync(dataPath('partner-site', 'tool-placement.registry.json'), 'utf-8')) as PlacementRegistryFile).placements?.find((entry) => entry.context === context);
  if (!placement) return [];
  const tools = await Promise.all(placement.candidateToolSlugs.map((slug) => getToolBySlug(slug)));
  return tools.filter((tool): tool is ToolRegistryItem => Boolean(tool && tool.kind === 'tool' && tool.status === 'active' && tool.accessLevel === 'public' && getRegistryDestination(tool) !== '#'));
}
