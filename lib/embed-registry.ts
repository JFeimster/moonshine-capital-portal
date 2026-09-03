import toolRegistryJson from '@/data/embeds/tool-registry.json';

export type ToolAccessLevel = 'public' | 'portal' | 'admin';
export type ToolStatus = 'draft' | 'active' | 'archived';
export type RegistryEntryKind = 'tool' | 'resource';
export type RegistryRenderType = 'iframe' | 'external' | 'internal' | 'download' | 'guide' | 'video' | 'gpt';

export interface BrokerToolAssignment {
  brokerSlug: string;
  featured?: boolean;
  note?: string;
}

export interface ToolRegistryItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  kind: RegistryEntryKind;
  category: string;
  resourceType: string;
  renderType: RegistryRenderType;
  accessLevel: ToolAccessLevel;
  status: ToolStatus;
  url?: string;
  embedUrl?: string;
  icon?: string;
  ctaLabel: string;
  ctaHref?: string;
  tags: string[];
  audience: string[];
  verticals: string[];
  useCases: string[];
  brokerAssignments: BrokerToolAssignment[];
  featured: boolean;
  sortOrder: number;
  estimatedUseTime?: string;
  roleFit?: string[];
  funnelStage?: string;
}

interface ToolRegistryFile {
  tools: ToolRegistryItem[];
}

export interface RegistryStats {
  total: number;
  active: number;
  draft: number;
  archived: number;
  tools: number;
  resources: number;
  embeddable: number;
  assignedToBrokers: number;
  missingDestination: number;
}

export interface RegistryCoverageItem {
  item: ToolRegistryItem;
  destination: string;
  hasDestination: boolean;
  hasBrokerAssignments: boolean;
  missingFields: string[];
  coverageScore: number;
}

function normalizeRegistryItem(item: any, index: number): ToolRegistryItem {
  const normalizedKind = item.kind || (String(item.asset_type || '').toUpperCase() === 'TOOL' ? 'tool' : 'resource');
  const title = item.title || item.name || `Tool ${index + 1}`;
  const slug = item.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const description = item.description || item.problem || item.output_artifact || 'Resource information.';

  return {
    id: item.id || slug,
    slug,
    title,
    description,
    kind: normalizedKind,
    category: item.category || item.partner_channel || item.persona || 'general',
    resourceType: item.resourceType || item.asset_type || 'guide',
    renderType: item.renderType || (item.live_url || item.embedUrl ? 'external' : 'internal'),
    accessLevel: item.accessLevel || 'public',
    status: item.status || (item.build_state === 'live' ? 'active' : 'draft'),
    url: item.url || item.live_url || item.ctaHref,
    embedUrl: item.embedUrl || item.embed_url,
    icon: item.icon,
    ctaLabel: item.ctaLabel || item.cta?.label || item.ctaLabel || 'Learn more',
    ctaHref: item.ctaHref || item.url || item.live_url,
    tags: Array.isArray(item.tags) ? item.tags : [item.persona, item.partner_channel, item.category].filter(Boolean),
    audience: Array.isArray(item.audience) ? item.audience : [item.persona].filter(Boolean),
    verticals: Array.isArray(item.verticals) ? item.verticals : [item.partner_channel].filter(Boolean),
    useCases: Array.isArray(item.useCases) ? item.useCases : [item.problem].filter(Boolean),
    brokerAssignments: Array.isArray(item.brokerAssignments) ? item.brokerAssignments : [],
    featured: Boolean(item.featured),
    sortOrder: typeof item.sortOrder === 'number' ? item.sortOrder : index,
    estimatedUseTime: item.estimatedUseTime,
    roleFit: Array.isArray(item.roleFit) ? item.roleFit : [],
    funnelStage: item.funnelStage || item.category,
  };
}

async function readRegistryFile(): Promise<ToolRegistryFile> {
  const parsed = toolRegistryJson as any;
  const entries = Array.isArray(parsed.entries) ? parsed.entries : Array.isArray(parsed.tools) ? parsed.tools : [];

  return {
    tools: entries.map((item: any, index: number) => normalizeRegistryItem(item, index)),
  };
}

function bySortThenTitle(a: ToolRegistryItem, b: ToolRegistryItem) {
  if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
  return a.title.localeCompare(b.title);
}

function isPubliclyAvailable(item: ToolRegistryItem) {
  return item.status === 'active';
}

function isAssignedToBroker(item: ToolRegistryItem, brokerSlug: string) {
  return item.brokerAssignments.some((assignment) => assignment.brokerSlug === brokerSlug);
}

function sortBrokerAssignedItems(brokerSlug: string) {
  return (a: ToolRegistryItem, b: ToolRegistryItem) => {
    const aAssignment = a.brokerAssignments.find((assignment) => assignment.brokerSlug === brokerSlug);
    const bAssignment = b.brokerAssignments.find((assignment) => assignment.brokerSlug === brokerSlug);
    if (Boolean(aAssignment?.featured) !== Boolean(bAssignment?.featured)) {
      return aAssignment?.featured ? -1 : 1;
    }
    return bySortThenTitle(a, b);
  };
}

export function groupRegistryItemsBy(items: ToolRegistryItem[], field: 'category' | 'resourceType' | 'renderType' | 'funnelStage') {
  return items.reduce<Record<string, ToolRegistryItem[]>>((groups, item) => {
    const key = field === 'funnelStage' ? item.funnelStage || 'general' : item[field] || 'uncategorized';
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {});
}

export function getRegistryDestination(item: ToolRegistryItem) {
  return item.ctaHref || item.url || item.embedUrl || '#';
}

export function getRegistryTrackedHref(item: ToolRegistryItem) {
  return `/go/${item.slug}`;
}

export function getRegistryCoverage(items: ToolRegistryItem[]): RegistryCoverageItem[] {
  return items.map((item) => {
    const destination = getRegistryDestination(item);
    const missingFields = [
      !item.description ? 'description' : null,
      !item.ctaLabel ? 'ctaLabel' : null,
      item.tags.length === 0 ? 'tags' : null,
      item.audience.length === 0 ? 'audience' : null,
      item.verticals.length === 0 ? 'verticals' : null,
      item.useCases.length === 0 ? 'useCases' : null,
      destination === '#' ? 'destination' : null,
    ].filter(Boolean) as string[];

    const coverageScore = Math.max(0, 100 - missingFields.length * 15 - (item.brokerAssignments.length === 0 ? 10 : 0));

    return {
      item,
      destination,
      hasDestination: destination !== '#',
      hasBrokerAssignments: item.brokerAssignments.length > 0,
      missingFields,
      coverageScore,
    };
  });
}

export async function getAllRegistryItems(): Promise<ToolRegistryItem[]> {
  const registry = await readRegistryFile();
  return (registry.tools ?? []).sort(bySortThenTitle);
}

export async function getAllTools(): Promise<ToolRegistryItem[]> {
  return getAllRegistryItems();
}

export async function getActiveTools(): Promise<ToolRegistryItem[]> {
  const items = await getAllRegistryItems();
  return items.filter(isPubliclyAvailable);
}

export async function getToolsByAccessLevel(accessLevel: ToolAccessLevel): Promise<ToolRegistryItem[]> {
  const items = await getActiveTools();
  return items.filter((item) => item.accessLevel === accessLevel || item.accessLevel === 'public');
}

export async function getToolsByKind(kind: RegistryEntryKind): Promise<ToolRegistryItem[]> {
  const items = await getActiveTools();
  return items.filter((item) => item.kind === kind);
}

export async function getToolsByCategory(category: string): Promise<ToolRegistryItem[]> {
  const items = await getActiveTools();
  return items.filter((item) => item.category === category);
}

export async function getFeaturedRegistryItems(limit?: number): Promise<ToolRegistryItem[]> {
  const items = await getActiveTools();
  const featured = items.filter((item) => item.featured);
  return typeof limit === 'number' ? featured.slice(0, limit) : featured;
}

export async function getFeaturedResources(limit?: number): Promise<ToolRegistryItem[]> {
  const resources = await getToolsByKind('resource');
  const featured = resources.filter((item) => item.featured);
  return typeof limit === 'number' ? featured.slice(0, limit) : featured;
}

export async function getToolBySlug(slug: string): Promise<ToolRegistryItem | null> {
  const items = await getAllRegistryItems();
  return items.find((item) => item.slug === slug) ?? null;
}

export async function getToolsForBroker(brokerSlug: string): Promise<ToolRegistryItem[]> {
  const items = await getActiveTools();
  return items
    .filter((item) => item.kind === 'tool')
    .filter((item) => isAssignedToBroker(item, brokerSlug))
    .sort(sortBrokerAssignedItems(brokerSlug));
}

export async function getResourcesForBroker(brokerSlug: string): Promise<ToolRegistryItem[]> {
  const items = await getActiveTools();
  return items
    .filter((item) => item.kind === 'resource')
    .filter((item) => isAssignedToBroker(item, brokerSlug))
    .sort(sortBrokerAssignedItems(brokerSlug));
}

export async function getToolsForVertical(vertical: string): Promise<ToolRegistryItem[]> {
  const items = await getActiveTools();
  return items.filter((item) => item.verticals.includes(vertical));
}

export async function getToolsForAudience(audience: string): Promise<ToolRegistryItem[]> {
  const items = await getActiveTools();
  return items.filter((item) => item.audience.includes(audience));
}

export async function getRegistryStats(): Promise<RegistryStats> {
  const items = await getAllRegistryItems();

  return {
    total: items.length,
    active: items.filter((item) => item.status === 'active').length,
    draft: items.filter((item) => item.status === 'draft').length,
    archived: items.filter((item) => item.status === 'archived').length,
    tools: items.filter((item) => item.kind === 'tool').length,
    resources: items.filter((item) => item.kind === 'resource').length,
    embeddable: items.filter((item) => Boolean(item.embedUrl)).length,
    assignedToBrokers: items.filter((item) => item.brokerAssignments.length > 0).length,
    missingDestination: items.filter((item) => !item.url && !item.embedUrl && !item.ctaHref).length,
  };
}
