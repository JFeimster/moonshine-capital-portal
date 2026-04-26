import { BrokerProfile } from './types';
import { fetchWixBrokers, fetchWixBrokerBySlug } from './wix';
import { isEligibleForPublicDisplay } from './status-gating';

export async function getBrokers(): Promise<BrokerProfile[]> {
  const brokers = await fetchWixBrokers();
  // Ensure we only return brokers eligible for public display
  return brokers.filter(isEligibleForPublicDisplay);
}

export async function getBrokerBySlug(slug: string): Promise<BrokerProfile | null> {
  const broker = await fetchWixBrokerBySlug(slug);
  // Ensure the requested broker is eligible for public display
  if (broker && !isEligibleForPublicDisplay(broker)) {
    return null;
  }
  return broker;
}

export async function getFeaturedBrokers(): Promise<BrokerProfile[]> {
  const brokers = await getBrokers();
  return brokers.filter(b => b.featuredFlag ?? b.featuredBroker);
}
