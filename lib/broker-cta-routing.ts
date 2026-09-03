import type { BrokerProfile } from './types';

export type BrokerCtaType = 'apply' | 'booking' | 'website';

function getCtaNode(broker: BrokerProfile, type: BrokerCtaType) {
  if (type === 'apply') return broker.primaryCta;
  if (type === 'booking') return broker.secondaryCta;
  return undefined;
}

export function buildBrokerCtaHref(
  broker: BrokerProfile,
  type: BrokerCtaType,
  source: string,
) {
  const cta = getCtaNode(broker, type);
  const registrySlug = cta?.registrySlug?.trim();

  if (registrySlug) {
    return `/go/${encodeURIComponent(registrySlug)}`;
  }

  const params = new URLSearchParams({
    broker: broker.slug,
    type,
    source,
  });

  return `/out?${params.toString()}`;
}
