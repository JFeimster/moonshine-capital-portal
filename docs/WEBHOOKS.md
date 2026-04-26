# Webhook Integration Flow

This document describes the data flow and integration points between Tally forms, n8n, Notion CRM, and Wix CMS.

## Webhook Endpoints

The ingestion layer provides two primary webhook endpoints to receive data from Tally via n8n.

**IMPORTANT CONTRACT:** These endpoints **DO NOT** accept raw Tally webhooks directly. They expect n8n (or the caller) to have already mapped the raw Tally form keys into the documented `CanonicalBrokerProfile` JSON schema.

1. **`POST /api/intake/tally/application`**
   - **Trigger:** Tally Application form is submitted.
   - **Purpose:** Intake new brokers, create pending Notion CRM record.
   - **Payload Expectation:** Basic profile details (fullName, email, agencyName).

2. **`POST /api/intake/tally/profile`**
   - **Trigger:** Tally Profile Builder form is submitted.
   - **Purpose:** Update the existing Notion CRM record. Notion acts as the primary operational source of truth. Publishing to an optional downstream layer like Wix CMS must be done manually or via a separate explicit step after team review.
   - **Payload Expectation:** Detailed profile data (shortBio, industries, fundingTypes, profileImage).

## Canonical Object Shape

Both endpoints map Tally payloads into a normalized, canonical structure:

```json
{
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "agencyName": "Acme Funding",
  "slug": "jane-doe",
  "state": "CA",
  "websiteUrl": "https://example.com",
  "phoneNumber": "555-1234",
  "shortBio": "Expert in startup capital.",
  "whyChooseYou": "Fast turnarounds.",
  "industries": ["SaaS", "E-commerce"],
  "fundingTypes": ["SBA", "Term Loans"],
  "urgencyCategory": "fast",
  "profileImage": "https://example.com/jane.png",
  "primaryCtaLabel": "Apply Here",
  "primaryCtaLink": "https://apply.example.com"
}
```

## Failure Cases & Expected Responses

- **Missing Email (Merge Key):**
  The system relies on `email` to merge records. If missing, it will return:
  ```json
  { "success": false, "errors": ["Missing or invalid required merge key: email"] }
  ```
- **Validation Errors:**
  If a payload is missing other required fields (e.g., `fullName` or `agencyName` on application), it returns `400 Bad Request`.
- **Downstream Sync Errors:**
  If Notion CRM or Wix CMS fails to update, it returns `500 Internal Server Error` with details.

## Implementation Status (Stubs vs. Live)

- **Ingestion normalizers and validators:** LIVE
- **Next.js API route parsing and structuring:** LIVE
- **Notion CRM Adapter (`upsertNotionCRMRecord`):** STUBBED
- **Wix CMS Adapter (`publishBrokerToWix`):** STUBBED

The downstream adapters are temporarily mocked out pending final API key/ID configurations and `@notionhq/client` or `@wix/sdk` installation.
