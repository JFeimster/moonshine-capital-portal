import { BrokerProfile } from './types';
import { mockBrokers } from './mock-brokers';

// TODO: Replace with actual Wix CMS API integration
// e.g., fetching from the `brokerProfiles` collection where `approvalStatus = approved` and `isActive = true`

export async function fetchWixBrokers(): Promise<BrokerProfile[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Return only approved and active brokers from mock data
  return mockBrokers.filter(b => b.approvalStatus === 'approved' && b.isActive);
}

export async function fetchWixBrokerBySlug(slug: string): Promise<BrokerProfile | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const broker = mockBrokers.find(b => b.slug === slug && b.approvalStatus === 'approved' && b.isActive);
  return broker || null;
}
