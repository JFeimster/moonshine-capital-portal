import { BrokerProfile } from './types';
import { fetchWixBrokers, fetchWixBrokerBySlug } from './wix';

export async function getBrokers(): Promise<BrokerProfile[]> {
  // Here we would normalize the data if the Wix API returned a different shape.
  // For now, our mock data already matches our BrokerProfile type.
  const brokers = await fetchWixBrokers();
  return brokers;
}

export async function getBrokerBySlug(slug: string): Promise<BrokerProfile | null> {
  const broker = await fetchWixBrokerBySlug(slug);
  return broker;
}

export async function getFeaturedBrokers(): Promise<BrokerProfile[]> {
  const brokers = await getBrokers();
  return brokers.filter(b => b.featuredBroker);
}
