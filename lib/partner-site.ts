import { readFileSync } from 'fs';
import path from 'path';
import { getRegistryDestination, getToolBySlug, getToolsByKind, type ToolRegistryItem } from './embed-registry';

type FAQItem = { question: string; answer: string };

type FundingFamily = {
  slug: string;
  name?: string;
  publicName?: string;
  summary?: string;
  commonUseCases?: string[];
  bestFitBorrower?: string[];
  requiredDocuments?: string[];
  relatedToolIds?: string[];
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
  const overlays = new Map((readRegistry<FundingOverlay>('partner-site', 'funding-pages.registry.json').entries ?? []).map((entry) => [entry.slug, entry]));

  return canonical.filter((entry) => entry.slug).map((entry) => {
    const overlay = overlays.get(entry.slug);
    return {
      slug: entry.slug,
      title: overlay?.title || entry.publicName || entry.name || 'Funding Option',
      description: overlay?.description || entry.summary || 'Funding option information.',
      summary: overlay?.summary || entry.summary || 'Funding option information.',
      useCases: overlay?.useCases || entry.commonUseCases || [],
      whoItMayFit: overlay?.whoItMayFit || entry.bestFitBorrower || [],
      whatToPrepare: overlay?.whatToPrepare || entry.requiredDocuments || [],
      relatedIndustrySlugs: overlay?.relatedIndustrySlugs || [],
      relatedFundingSlugs: overlay?.relatedFundingSlugs || [],
      relatedResourceSlugs: overlay?.relatedResourceSlugs || [],
      relatedToolSlugs: entry.relatedToolIds || [],
      faq: overlay?.faq || [
        { question: 'Who is this typically best for?', answer: entry.bestFitBorrower?.[0] || 'This capital lane is most useful when the business has a clear use case and repayment source.' },
        { question: 'What should I prepare?', answer: entry.requiredDocuments?.[0] || 'Prepare recent business financials, use-case details, and an outline of the financing need.' },
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
  return (await getToolsByKind('tool')).slice(0, 12);
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

export async function getPartnerToolsForContext(context: string): Promise<ToolRegistryItem[]> {
  const placement = (JSON.parse(readFileSync(dataPath('partner-site', 'tool-placement.registry.json'), 'utf-8')) as PlacementRegistryFile).placements?.find((entry) => entry.context === context);
  if (!placement) return [];
  const tools = await Promise.all(placement.candidateToolSlugs.map((slug) => getToolBySlug(slug)));
  return tools.filter((tool): tool is ToolRegistryItem => Boolean(tool && tool.kind === 'tool' && tool.status === 'active' && getRegistryDestination(tool) !== '#'));
}
