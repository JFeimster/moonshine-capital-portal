import { NextRequest, NextResponse } from 'next/server';
import { getBrokerBySlug } from '@/lib/brokers';
import { sanitizeUrl } from '@/lib/utils';
import { appendAttribution, buildPartnerLeadFormUrl } from '@/lib/distribution';

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

  let destinationUrl: string;

  if (type === 'website' && broker.websiteUrl) {
    destinationUrl = sanitizeUrl(broker.websiteUrl);
  } else if (type === 'booking' && broker.bookingUrl) {
    destinationUrl = sanitizeUrl(broker.bookingUrl);
  } else if (broker.primaryCta?.url || broker.primaryCtaLink) {
    destinationUrl = sanitizeUrl(broker.primaryCta?.url || broker.primaryCtaLink);
  } else {
    destinationUrl = buildPartnerLeadFormUrl(broker, {
      source,
      campaign: searchParams.get('campaign') || undefined,
      utm_source: searchParams.get('utm_source') || undefined,
      utm_medium: searchParams.get('utm_medium') || undefined,
      utm_campaign: searchParams.get('utm_campaign') || undefined
    });
  }

  if (destinationUrl === '#') {
    destinationUrl = `/${brokerSlug}`;
  }

  const attributedDestination = appendAttribution(destinationUrl, {
    partner_id: broker.partnerId || searchParams.get('partner_id'),
    referral_code: broker.referralCode || searchParams.get('referral_code'),
    source,
    campaign: searchParams.get('campaign'),
    utm_source: searchParams.get('utm_source'),
    utm_medium: searchParams.get('utm_medium'),
    utm_campaign: searchParams.get('utm_campaign')
  });

  console.log('[Tracking Event]', {
    event: 'cta_click',
    broker: brokerSlug,
    partnerId: broker.partnerId || null,
    referralCode: broker.referralCode || null,
    type,
    source,
    campaign: searchParams.get('campaign'),
    destinationUrl: attributedDestination,
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get('user-agent') || 'unknown',
    referrer: request.headers.get('referer') || 'unknown',
  });

  return NextResponse.redirect(attributedDestination);
}
