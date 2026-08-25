import { BrokerProfile } from './types';

export const CAPITAL_BASE_URL = 'https://capital.distilledfunding.com';
export const PARTNER_LEAD_FORM_URL = 'https://tally.so/r/dWvEqN';

export interface AttributionContext {
  source?: string;
  campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export function buildPublicFundingUrl(broker: Pick<BrokerProfile, 'slug' | 'referralCode'>) {
  const url = new URL(`/${broker.slug}`, CAPITAL_BASE_URL);
  if (broker.referralCode) url.searchParams.set('ref', broker.referralCode);
  return url.toString();
}

export function buildPartnerLeadFormUrl(
  broker: Pick<BrokerProfile, 'partnerId' | 'referralCode'>,
  context: AttributionContext = {}
) {
  const url = new URL(PARTNER_LEAD_FORM_URL);
  if (broker.partnerId) url.searchParams.set('partner_id', broker.partnerId);
  if (broker.referralCode) {
    url.searchParams.set('referral_code', broker.referralCode);
    url.searchParams.set('referral_partner', broker.referralCode);
  }
  url.searchParams.set('source', context.source || 'partner_funding_page');
  if (context.campaign) url.searchParams.set('campaign', context.campaign);
  url.searchParams.set('utm_source', context.utm_source || 'partner');
  url.searchParams.set('utm_medium', context.utm_medium || 'referral');
  url.searchParams.set('utm_campaign', context.utm_campaign || context.campaign || 'partner_funding_page');
  return url.toString();
}

export function buildTrackedOutUrl(
  broker: Pick<BrokerProfile, 'slug' | 'partnerId' | 'referralCode'>,
  type: 'apply' | 'website' | 'booking' = 'apply',
  context: AttributionContext = {}
) {
  const url = new URL('/out', CAPITAL_BASE_URL);
  url.searchParams.set('broker', broker.slug);
  url.searchParams.set('type', type);
  url.searchParams.set('source', context.source || 'partner_funding_page');
  if (broker.partnerId) url.searchParams.set('partner_id', broker.partnerId);
  if (broker.referralCode) url.searchParams.set('referral_code', broker.referralCode);
  if (context.campaign) url.searchParams.set('campaign', context.campaign);
  if (context.utm_source) url.searchParams.set('utm_source', context.utm_source);
  if (context.utm_medium) url.searchParams.set('utm_medium', context.utm_medium);
  if (context.utm_campaign) url.searchParams.set('utm_campaign', context.utm_campaign);
  return url.toString();
}

export function appendAttribution(destination: string, values: Record<string, string | null | undefined>) {
  const url = new URL(destination, CAPITAL_BASE_URL);
  ['partner_id', 'referral_code', 'source', 'campaign', 'utm_source', 'utm_medium', 'utm_campaign'].forEach((key) => {
    const value = values[key];
    if (value) url.searchParams.set(key, value);
  });
  return url.toString();
}
