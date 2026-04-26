import { FullyNormalizedBroker } from './field-mapping';

export interface WixPublishResponse {
  success: boolean;
  wixId?: string;
  error?: string;
}

/**
 * Stub adapter for publishing/updating a BrokerProfile in Wix CMS.
 * Expected to be used by n8n or direct API integration.
 *
 * TODO: Implement direct Wix API integration using @wix/sdk.
 * Currently returns a mock success response to unblock the ingestion pipeline.
 */
export async function publishBrokerToWix(
  brokerData: Partial<FullyNormalizedBroker>
): Promise<WixPublishResponse> {
  console.log(`[STUB] Publishing BrokerProfile to Wix for: ${brokerData.email || 'unknown'}`);

  // Return early if missing merge key
  if (!brokerData.email) {
    return {
      success: false,
      error: 'Missing email (merge key) for Wix CMS publish'
    };
  }

  // TODO: Add live Wix API call here using @wix/sdk
  // Requires: WIX_API_KEY, WIX_SITE_ID

  return {
    success: true,
    wixId: 'stub_wix_id_67890'
  };
}
