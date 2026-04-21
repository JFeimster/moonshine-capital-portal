# System Runbook: Ingestion Pipeline

This document details the operational procedures, failure cases, and manual recovery paths for the Distilled Funding Broker Ingestion Pipeline.

## General Flow
1. Broker submits Tally form (Application or Profile Builder).
2. Tally triggers a webhook to n8n (or directly to our endpoints).
3. `POST /api/intake/tally/*` normalizes data and validates required fields.
4. Next.js backend attempts to upsert into Notion CRM.
5. Next.js backend attempts to upsert into Wix CMS.

## Common Failures

### 1. Missing Merge Key (`email`)
- **Symptom:** The webhook returns a `400 Bad Request` with `"Missing or invalid required merge key: email"`.
- **Cause:** Tally form was modified or the payload structure changed, dropping the email field.
- **Resolution:**
  1. Inspect the raw Tally submission in Tally's dashboard.
  2. Verify the email field mapping in n8n or Tally webhook configuration.
  3. Manually insert the record into Notion CRM using the provided data if necessary.

### 2. Validation Errors
- **Symptom:** The webhook returns `400 Bad Request` citing a missing `fullName` or `agencyName`.
- **Cause:** A required field was bypassed or mapping is incorrect.
- **Resolution:** Similar to missing email, inspect the raw payload, update the Tally form to strictly require the field, and manually rescue the data into Notion CRM.

### 3. Downstream API Failures (Notion/Wix)
- **Symptom:** Webhook returns `500 Internal Server Error` with `Failed to ingest into CRM` or `Failed to process downstream updates`.
- **Cause:** Notion/Wix APIs are down, rate-limited, or credentials (API keys) are invalid/expired.
- **Resolution:**
  1. Check Vercel logs for explicit error messages from the adapters.
  2. Check status pages for Notion API or Wix API.
  3. Verify `NOTION_API_KEY`, `WIX_API_KEY`, etc. in Vercel environment variables.
  4. (Recovery) The payload is lost by the frontend. Rely on n8n execution history to replay the webhook once resolved.

## Manual Recovery Path

If an automatic ingestion fails and cannot be replayed from n8n:
1. Locate the submission in the Tally dashboard.
2. Open Notion CRM.
3. Manually create a new row using the `email` as the Merge Key.
4. Fill in the data (Full Name, Agency Name, etc.).
5. If the profile was meant to be published to Wix, log into the Wix Dashboard.
6. Find the `brokerProfiles` collection and manually create the entry. Note: Make sure the `approvalStatus` and `isActive` flags match the intended state.
