import { NextRequest, NextResponse } from 'next/server';
import { getBrokerBySlug } from '@/lib/brokers';
import { sanitizeUrl } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const brokerSlug = searchParams.get('broker');
  const type = searchParams.get('type') || 'apply';
  const source = searchParams.get('source') || 'unknown';

  if (!brokerSlug) {
    return NextResponse.redirect(new URL('/directory', request.url));
  }

  const broker = await getBrokerBySlug(brokerSlug);

  if (!broker) {
    return NextResponse.redirect(new URL('/directory', request.url));
  }

  // Determine destination URL
  let destinationUrl = '/directory'; // Default fallback

  if (type === 'website' && broker.websiteUrl) {
    destinationUrl = sanitizeUrl(broker.websiteUrl, '/directory');
  } else {
    // Default to primary CTA
    destinationUrl = sanitizeUrl(broker.primaryCta?.url || broker.primaryCtaLink || broker.websiteUrl || '#', '/directory');
  }

  const trackingPayload = {
    event: 'cta_click',
    broker: brokerSlug,
    type,
    source,
    destinationUrl,
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get('user-agent') || 'unknown',
    referrer: request.headers.get('referer') || 'unknown',
  };

  // Log event (MVP)
  console.log('[Tracking Event]', trackingPayload);

  // Send to n8n webhook if configured
  if (process.env.N8N_CTA_WEBHOOK_URL) {
    // Fire and forget, don't await the webhook to prevent blocking the redirect
    fetch(process.env.N8N_CTA_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(trackingPayload),
      // Adding a signal/timeout isn't strictly necessary since we aren't awaiting it,
      // but standard fetch fire-and-forget is non-blocking to the rest of execution.
    }).catch((error) => {
      console.error('[Tracking Error] Failed to send webhook:', error);
    });
  }

  if (destinationUrl === '#' || destinationUrl === '/directory') {
    return NextResponse.redirect(new URL(`/directory/${brokerSlug}`, request.url));
  }

  return NextResponse.redirect(destinationUrl);
}
