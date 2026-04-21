import { BrokerProfile } from './types';

/**
 * Defines the safe states a broker can be in during their lifecycle.
 *
 * Flow:
 * applied -> profile_pending -> under_review -> approved -> published
 *
 * - `applied`: Initial application received, waiting for profile details.
 * - `profile_pending`: (Same as above, alternate internal naming).
 * - `under_review`: Full profile received, team is reviewing.
 * - `approved`: Team approved the broker, but maybe not live yet.
 * - `rejected`: Team denied the broker.
 * - `published`: Approved AND explicitly marked active/live in Wix.
 */
export type SafeBrokerState =
  | 'applied'
  | 'profile_pending'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'published';

/**
 * Validates if a given broker profile is strictly eligible for public display.
 *
 * Rules for public display:
 * 1. approvalStatus must be exactly 'approved'.
 * 2. isActive must be exactly true.
 * 3. brokerStatus must not be 'hidden' (optional explicit check).
 *
 * @param broker The broker profile to validate.
 * @returns boolean indicating if the broker can be publicly displayed.
 */
export function isEligibleForPublicDisplay(broker: Pick<BrokerProfile, 'approvalStatus' | 'isActive' | 'brokerStatus'>): boolean {
  if (!broker) return false;

  const isApproved = broker.approvalStatus === 'approved';
  const isActive = broker.isActive === true;
  const isNotHidden = broker.brokerStatus !== 'hidden';

  return isApproved && isActive && isNotHidden;
}
