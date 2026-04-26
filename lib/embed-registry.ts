import { promises as fs } from 'fs';
import path from 'path';

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

async function readRegistryFile(): Promise<ToolRegistryFile> {
  const filePath = path.join(process.cwd(), 'data', 'embeds', 'tool-registry.json');
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content) as ToolRegistryFile;
}

function bySortThenTitle(a: ToolRegistryItem, b: ToolRegistryItem) {
  if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
  return a.title.localeCompare(b.title);
}

function isPubliclyAvailable(item: ToolRegistryItem) {
  return item.status === 'active';
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

export async function getToolBySlug(slug: string): Promise<ToolRegistryItem | null> {
  const items = await getAllRegistryItems();
  return items.find((item) => item.slug === slug) ?? null;
}

export async function getToolsForBroker(brokerSlug: string): Promise<ToolRegistryItem[]> {
  const items = await getActiveTools();
  return items
    .filter((item) => item.brokerAssignments.some((assignment) => assignment.brokerSlug === brokerSlug))
    .sort((a, b) => {
      const aAssignment = a.brokerAssignments.find((assignment) => assignment.brokerSlug === brokerSlug);
      const bAssignment = b.brokerAssignments.find((assignment) => assignment.brokerSlug === brokerSlug);
      if (Boolean(aAssignment?.featured) !== Boolean(bAssignment?.featured)) {
        return aAssignment?.featured ? -1 : 1;
      }
      return bySortThenTitle(a, b);
    });
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

export function getRegistryDestination(item: ToolRegistryItem) {
  return item.ctaHref || item.url || item.embedUrl || '#';
}
