import { promises as fs } from 'fs';
import path from 'path';

export type ToolAccessLevel = 'public' | 'portal' | 'admin';
export type ToolStatus = 'draft' | 'active' | 'archived';

export interface ToolRegistryItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  type: 'link' | 'iframe' | 'embed' | 'app' | 'doc' | 'video';
  accessLevel: ToolAccessLevel;
  status: ToolStatus;
  url?: string;
  embedUrl?: string;
  tags?: string[];
}

interface ToolRegistryFile {
  tools: ToolRegistryItem[];
}

async function readRegistryFile(): Promise<ToolRegistryFile> {
  const filePath = path.join(process.cwd(), 'data', 'embeds', 'tool-registry.json');
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content) as ToolRegistryFile;
}

export async function getAllTools(): Promise<ToolRegistryItem[]> {
  const registry = await readRegistryFile();
  return registry.tools ?? [];
}

export async function getActiveTools(): Promise<ToolRegistryItem[]> {
  const tools = await getAllTools();
  return tools.filter((tool) => tool.status === 'active' || tool.status === 'draft');
}

export async function getToolsByAccessLevel(accessLevel: ToolAccessLevel): Promise<ToolRegistryItem[]> {
  const tools = await getAllTools();
  return tools.filter((tool) => tool.accessLevel === accessLevel || tool.accessLevel === 'public');
}

export async function getToolsByCategory(category: string): Promise<ToolRegistryItem[]> {
  const tools = await getAllTools();
  return tools.filter((tool) => tool.category === category);
}

export async function getToolBySlug(slug: string): Promise<ToolRegistryItem | null> {
  const tools = await getAllTools();
  return tools.find((tool) => tool.slug === slug) ?? null;
}
