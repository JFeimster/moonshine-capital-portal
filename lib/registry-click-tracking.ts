import type { ToolRegistryItem } from '@/lib/embed-registry';

interface TrackRegistryClickInput {
  item: ToolRegistryItem;
  destination: string;
  request: Request;
}

export function trackRegistryClick({ item, destination, request }: TrackRegistryClickInput) {
  const event = {
    event: 'registry_click',
    slug: item.slug,
    itemId: item.id,
    kind: item.kind,
    category: item.category,
    resourceType: item.resourceType,
    destination,
    timestamp: new Date().toISOString(),
    referrer: request.headers.get('referer') || null,
    userAgent: request.headers.get('user-agent') || null,
  };

  console.info('[registry-click]', event);

  return event;
}
