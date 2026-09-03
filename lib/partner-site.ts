import { readFileSync } from 'fs';
import path from 'path';
import { getToolBySlug, getToolsByKind, type ToolRegistryItem } from './embed-registry';

export interface PartnerFundingPage {
  slug: string;
  title: string;
  description: string;
  summary: string;
  useCases: string[];
  relatedIndustrySlugs: string[];
  relatedToolSlugs: string[];
  faq: Array<{ question: string; answer: string }>;
}

export interface PartnerIndustryPage {
  slug: string;
  title: string;
  description: string;
  summary: string;
  capitalPressures: string[];
  relevantFundingSlugs: string[];
  relatedToolSlugs: string[];
  faq: Array<{ question: string; answer: string }>;
}

const registryPath = path.join(process.cwd(), 'data', 'funding', 'funding-product-families.registry.json');

function readFundingRegistry(): { entries?: Array<Record<string, any>> } {
  const file = readFileSync(registryPath, 'utf-8');
  return JSON.parse(file) as { entries?: Array<Record<string, any>> };
}

const industryMap: Record<string, string[]> = {
  'working-capital': ['construction', 'trucking', 'restaurants', 'ecommerce', 'medical', 'franchises'],
  'startup-credit-leverage': ['technology', 'saas', 'franchises', 'professional-services'],
  'business-line-access': ['construction', 'restaurants', 'manufacturing', 'automotive', 'professional-services'],
  'equipment-finance': ['construction', 'trucking', 'automotive', 'manufacturing', 'real-estate-investors'],
  'real-estate-capital': ['real-estate-investors', 'construction', 'franchises', 'medical'],
  'marketplace-capital': ['ecommerce', 'saas', 'technology', 'restaurants'],
  'business-acquisition': ['franchises', 'professional-services', 'manufacturing', 'restaurants'],
  'sba': ['franchises', 'construction', 'manufacturing', 'restaurants'],
  'term-financing': ['technology', 'manufacturing', 'professional-services', 'ecommerce'],
};

const defaultIndustries: PartnerIndustryPage[] = [
  {
    slug: 'construction',
    title: 'Construction & Trades',
    description: 'Capital for contractors, builders, and trade businesses with seasonal work and project cycles.',
    summary: 'Construction companies often need working capital for payroll, materials, subcontractors, and cash-flow gaps between draws and invoices.',
    capitalPressures: ['Payroll and subcontractor coverage', 'Equipment replacement', 'Slow-paying customer draws', 'Weather-driven cash-flow swings'],
    relevantFundingSlugs: ['working-capital', 'equipment-finance', 'business-line-access'],
    relatedToolSlugs: [],
    faq: [
      { question: 'What capital is most common for contractors?', answer: 'Working capital, equipment financing, and line-of-credit structures are common depending on project timing.' },
      { question: 'Do lenders care about backlog?', answer: 'Yes. Verified contracts, WIP, and recent project history often matter as much as tax returns.' },
    ],
  },
  {
    slug: 'trucking',
    title: 'Trucking & Transportation',
    description: 'Funding for fleet growth, fuel and payroll, and operating cushion in a volatile margin environment.',
    summary: 'Transportation businesses often need quick capital for trucks, driver payroll, fuel costs, and seasonal route swings.',
    capitalPressures: ['Fuel and payroll gaps', 'Truck acquisition', 'Maintenance and insurance costs', 'Cash-flow volatility'],
    relevantFundingSlugs: ['working-capital', 'equipment-finance', 'term-financing'],
    relatedToolSlugs: [],
    faq: [
      { question: 'What matters most for trucking operators?', answer: 'Business revenue consistency, driver payroll, and equipment utilization usually matter most.' },
    ],
  },
  {
    slug: 'restaurants',
    title: 'Restaurants & Hospitality',
    description: 'Options for hospitality businesses that need quick cash for payroll, remodels, inventory, and seasonal swings.',
    summary: 'Restaurants benefit from capital lanes designed around payroll pressure, inventory turns, and working capital consistency.',
    capitalPressures: ['Payroll coverage', 'Inventory replenishment', 'Renovation or expansion', 'Seasonal demand swings'],
    relevantFundingSlugs: ['working-capital', 'business-line-access', 'sba'],
    relatedToolSlugs: [],
    faq: [
      { question: 'Can hospitality businesses use working capital?', answer: 'Yes, especially when the goal is payroll, inventory, or a short-term cash-flow bridge.' },
    ],
  },
  {
    slug: 'medical',
    title: 'Medical',
    description: 'Flexible funding for clinics, service providers, and healthcare practices with recurring revenue and payroll needs.',
    summary: 'Medical businesses need funding that supports payroll, equipment, or working capital without disrupting service delivery.',
    capitalPressures: ['Payroll and staffing', 'Equipment upgrades', 'Practice expansion', 'Insurance and overhead'],
    relevantFundingSlugs: ['working-capital', 'equipment-finance', 'business-line-access'],
    relatedToolSlugs: [],
    faq: [
      { question: 'Is working capital common in healthcare?', answer: 'Often yes, especially for staffing, supplies, and growth initiatives.' },
    ],
  },
  {
    slug: 'professional-services',
    title: 'Professional Services',
    description: 'Capital for service firms managing payroll, growth, and recurring client work without overleveraging the business.',
    summary: 'Professional services firms often need flexible financing for staffing, growth, and operating reserves while they wait for receivables.',
    capitalPressures: ['Payroll resilience', 'Staffing investments', 'Growth capital', 'Cash reserves'],
    relevantFundingSlugs: ['startup-credit-leverage', 'business-line-access', 'term-financing'],
    relatedToolSlugs: [],
    faq: [
      { question: 'What is most helpful for service businesses?', answer: 'The right answer usually depends on revenue consistency, payroll cycles, and whether the capital is for growth or operating cash flow.' },
    ],
  },
  {
    slug: 'ecommerce',
    title: 'Ecommerce',
    description: 'Capital built around inventory turns, seasonality, acquisition spend, and demand spikes.',
    summary: 'Ecommerce operators rely on predictable funding for inventory, ad spend, and working capital as sales cycles fluctuate.',
    capitalPressures: ['Inventory and marketing spend', 'Seasonal surges', 'Cash conversion cycles', 'Fulfillment costs'],
    relevantFundingSlugs: ['working-capital', 'marketplace-capital', 'business-line-access'],
    relatedToolSlugs: [],
    faq: [
      { question: 'What does ecommerce typically need most?', answer: 'Inventory, ad spend, and short-term working capital are usually the biggest drivers.' },
    ],
  },
  {
    slug: 'manufacturing',
    title: 'Manufacturing',
    description: 'Funding for equipment, inventory, hiring, and production scaling in cyclical operations.',
    summary: 'Manufacturers often need more than simple working capital because growth and equipment cycles can be longer and more capital-intensive.',
    capitalPressures: ['Equipment purchases', 'Raw material storage', 'Operational scaling', 'Production capacity'],
    relevantFundingSlugs: ['equipment-finance', 'term-financing', 'business-line-access'],
    relatedToolSlugs: [],
    faq: [
      { question: 'Do manufacturers need longer-term financing?', answer: 'Sometimes. Equipment and capacity investments often pair better with term or asset-backed financing than short-term advances.' },
    ],
  },
  {
    slug: 'automotive',
    title: 'Automotive',
    description: 'Capital for auto businesses balancing inventory, depreciation cycles, and near-term working capital needs.',
    summary: 'Auto businesses often need financing that supports inventory, payroll, and expansion while balancing risk and cash flow.',
    capitalPressures: ['Inventory and floor plan needs', 'Payroll and overhead', 'Expansion and facility upgrades', 'Cash-flow timing'],
    relevantFundingSlugs: ['equipment-finance', 'business-line-access', 'working-capital'],
    relatedToolSlugs: [],
    faq: [
      { question: 'How do auto operators usually fund growth?', answer: 'A mix of business lines, equipment financing, and working capital is common depending on the business model.' },
    ],
  },
  {
    slug: 'real-estate-investors',
    title: 'Real Estate Investors',
    description: 'Capital for acquisitions, rehabs, bridge needs, and asset-backed opportunities in active property markets.',
    summary: 'Real estate investors may need financing aligned to acquisition timing, rehab costs, or bridge gaps between property repositioning and exit.',
    capitalPressures: ['Acquisition financing', 'Refinancing and rehab', 'Property-level cash needs', 'Holding period gaps'],
    relevantFundingSlugs: ['real-estate-capital', 'equipment-finance', 'term-financing'],
    relatedToolSlugs: [],
    faq: [
      { question: 'Is real estate financing different from business funding?', answer: 'Often yes. The deal structure and collateral work heavily into how the capital is framed.' },
    ],
  },
  {
    slug: 'technology',
    title: 'Technology',
    description: 'Funding for software, digital service, and product businesses with recurring revenue and scaling goals.',
    summary: 'Technology businesses often need working capital or term financing that supports hiring, product execution, and operating runway.',
    capitalPressures: ['Staffing and product development', 'Operating runway', 'Client acquisition', 'Growth and infrastructure'],
    relevantFundingSlugs: ['startup-credit-leverage', 'term-financing', 'marketplace-capital'],
    relatedToolSlugs: [],
    faq: [
      { question: 'What financing works for software companies?', answer: 'The most relevant lane depends on whether the need is runway, growth, or balance-sheet support.' },
    ],
  },
  {
    slug: 'saas',
    title: 'SaaS',
    description: 'Capital support for software businesses balancing recurring revenue, hiring, and growth efficiency.',
    summary: 'SaaS operators often need financing that supports infrastructure spending, sales capacity, and operating runway during growth phases.',
    capitalPressures: ['Hiring and product investment', 'Operating runway', 'Sales capacity', 'Customer acquisition'],
    relevantFundingSlugs: ['startup-credit-leverage', 'marketplace-capital', 'term-financing'],
    relatedToolSlugs: [],
    faq: [
      { question: 'Why does SaaS need different capital conversations?', answer: 'Because recurring revenue and growth efficiency often affect the margin for each financing lane.' },
    ],
  },
  {
    slug: 'franchises',
    title: 'Franchises',
    description: 'Funding support for franchise operators balancing launch costs, working capital, and multi-unit growth goals.',
    summary: 'Franchise businesses need capital that supports launch costs, expansion, and working capital during busy ramps.',
    capitalPressures: ['Launch costs', 'Inventory and setup', 'Multi-unit growth', 'Cash-flow ramps'],
    relevantFundingSlugs: ['startup-credit-leverage', 'sba', 'business-acquisition', 'working-capital'],
    relatedToolSlugs: [],
    faq: [
      { question: 'Are franchises easier to finance?', answer: 'The answer depends on the brand, financial profile, and whether you are launching or expanding an existing operation.' },
    ],
  },
];

export function listPartnerFundingPages(): PartnerFundingPage[] {
  const registry = readFundingRegistry();
  const entries = Array.isArray(registry.entries) ? registry.entries : [];

  return entries
    .filter((entry) => typeof entry?.slug === 'string' && entry.slug.trim())
    .map((entry) => ({
      slug: String(entry.slug),
      title: entry.publicName || entry.name || 'Funding Option',
      description: entry.summary || 'Funding option information.',
      summary: entry.summary || 'Funding option information.',
      useCases: Array.isArray(entry.commonUseCases) ? entry.commonUseCases : [],
      relatedIndustrySlugs: industryMap[String(entry.slug)] || ['construction', 'restaurants'],
      relatedToolSlugs: Array.isArray(entry.relatedToolIds) ? entry.relatedToolIds.filter(Boolean).map(String) : [],
      faq: [
        { question: 'Who is this typically best for?', answer: entry.bestFitBorrower?.[0] || 'This capital lane is most useful when the business has a clear use case and repayment source.' },
        { question: 'What should I prepare?', answer: entry.requiredDocuments?.[0] || 'Prepare recent business financials, use-case details, and an outline of the financing need.' },
      ],
    }));
}

export function getPartnerFundingPage(slug: string): PartnerFundingPage | null {
  return listPartnerFundingPages().find((page) => page.slug === slug) ?? null;
}

export function listPartnerIndustryPages(): PartnerIndustryPage[] {
  return defaultIndustries;
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

export async function listPartnerResourcePages(): Promise<ToolRegistryItem[]> {
  return (await getToolsByKind('resource')).slice(0, 10);
}

export async function getPartnerResource(slug: string): Promise<ToolRegistryItem | null> {
  const item = await getToolBySlug(slug);
  if (!item || item.kind !== 'resource') return null;
  return item;
}
