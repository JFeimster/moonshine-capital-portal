import type { ToolRegistryItem } from '@/lib/embed-registry';

interface TrackRegistryClickInput {
  item: ToolRegistryItem;
  destination: string;
  request: Request;
}

export interface RegistryClickEvent {
  event: 'registry_click';
  slug: string;
  itemId: string;
  kind: ToolRegistryItem['kind'];
  category: string;
  resourceType: string;
  destination: string;
  timestamp: string;
  referrer: string | null;
  userAgent: string | null;
}

const REGISTRY_CLICK_WEBHOOK_TIMEOUT_MS = 1500;

async function sendRegistryClickWebhook(event: RegistryClickEvent) {
  const webhookUrl = process.env.REGISTRY_CLICK_WEBHOOK_URL;

  if (!webhookUrl) return;

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(event),
      signal: AbortSignal.timeout(REGISTRY_CLICK_WEBHOOK_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.warn('[registry-click-webhook-failed]', {
        status: response.status,
        statusText: response.statusText,
      });
    }
  } catch (error) {
    console.warn('[registry-click-webhook-error]', error);
  }
}

export async function trackRegistryClick({ item, destination, request }: TrackRegistryClickInput) {
  const event: RegistryClickEvent = {
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

  await sendRegistryClickWebhook(event);

  return event;
}
