import { FullyNormalizedBroker, InternalStatus } from './field-mapping';

export interface NotionAdapterResponse {
  success: boolean;
  notionId?: string;
  error?: string;
}

/**
 * Stub adapter for upserting a CRM record in Notion.
 * Expected to be used by n8n or direct API integration.
 *
 * TODO: Implement direct Notion API integration.
 * Currently returns a mock success response to unblock the ingestion pipeline.
 */
export async function upsertNotionCRMRecord(
  brokerData: Partial<FullyNormalizedBroker>,
  status: InternalStatus = 'pending'
): Promise<NotionAdapterResponse> {
  console.log(`[STUB] Upserting Notion CRM Record for: ${brokerData.email || 'unknown'} with status ${status}`);

  // Return early if missing merge key
  if (!brokerData.email) {
    return {
      success: false,
      error: 'Missing email (merge key) for Notion CRM upsert'
    };
  }

  // TODO: Add live Notion API call here using @notionhq/client
  // Requires: NOTION_API_KEY, NOTION_BROKER_DATABASE_ID

  return {
    success: true,
    notionId: 'stub_notion_id_12345'
  };
}
