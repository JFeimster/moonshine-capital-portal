import { NextRequest, NextResponse } from 'next/server';
import { getBrokerBySlug } from '@/lib/brokers';
import { sanitizeUrl } from '@/lib/utils';
import { trackBrokerCtaClick } from '@/lib/tracking';

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
    destinationUrl = sanitizeUrl(broker.websiteUrl);
  } else {
    // Default to primary CTA
    destinationUrl = sanitizeUrl(broker.primaryCta?.url || broker.primaryCtaLink || broker.websiteUrl);
  }

  if (destinationUrl === '#') {
    destinationUrl = `/directory/${brokerSlug}`;
  }

  const payload = {
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
  console.log('[Tracking Event]', payload);

  // Send to tracking webhook asynchronously without blocking response
  void trackBrokerCtaClick(payload);

  return NextResponse.redirect(new URL(destinationUrl, request.url));
}
