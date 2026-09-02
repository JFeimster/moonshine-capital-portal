# Webhook Integration Flow

## Canonical raw Tally receiver

Use:

```text
POST /api/webhooks/tally
```

This is the canonical receiver for raw Tally `FORM_RESPONSE` events. Tally sends the raw JSON body directly to the Next.js/Vercel application; n8n is not required for field normalization or canonical persistence.

The receiver:

1. requires `application/json`
2. verifies the Tally HMAC signature against `TALLY_SIGNING_SECRET` (with `TALLY_WEBHOOK_SECRET` retained as a migration fallback)
3. allowlists the canonical form IDs
4. maps live Tally question UUIDs/labels into stable semantic fields
5. dispatches to the existing canonical Funding Agent services or Funding Leads persistence
6. returns an error rather than silently accepting unsupported forms or failed persistence

### Canonical form dispatch

| Tally form | Purpose | Destination |
| --- | --- | --- |
| `rjM6do` | Funding Agent Join | shared Funding Agent Join service → Partners CRM |
| `9qjWEE` | Funding Agent Profile | shared profile-enrichment service → existing Partners CRM record |
| `dWvEqN` | Step 1 funding intake | Funding Leads upsert |
| `w4R2Ad` | Step 2/full funding application | Funding Leads upsert |

The Funding Agent Join/Profile paths reuse the same business logic as the trusted normalized endpoints. There is only one lifecycle implementation.

## Trusted compatibility endpoints

These routes remain available for already-normalized trusted callers:

- `POST /api/intake/tally/application`
- `POST /api/intake/tally/profile`

They continue to use `TALLY_WEBHOOK_SECRET` through the existing trusted-adapter authentication contract. They are **not** the raw Tally webhook URL.

## Funding Agent lifecycle boundary

### Join

A new Join submission creates/reconciles identity as:

```text
approvalStatus = needs_review
profileStatus = draft
```

The public Join form cannot self-approve or self-publish. Existing operator-controlled approved/published states are preserved when the same canonical identity re-submits.

### Profile

Profile enrichment is update-only. It must match an existing canonical partner and cannot independently change approval/publication state.

Public eligibility remains:

```text
approvalStatus = approved
AND
profileStatus = published
```

## Funding Leads persistence

`dWvEqN` and `w4R2Ad` persist to the existing Notion **Funding Leads** database configured by:

```text
NOTION_API_KEY
NOTION_FUNDING_LEADS_DB_ID
```

`External Lead ID` is the idempotent external key.

- If a `session_id` is present, both funding stages resolve to `tally-session:<session_id>` so Step 2 can enrich the same lead.
- Otherwise the receiver uses `tally:<formId>:<submissionId>` to avoid accidental cross-business merging.
- Replayed webhook events do not create duplicate records.
- Identity conflicts return `409` instead of overwriting another applicant.

The full `w4R2Ad` Tally form currently collects DOB and residential-address data. Those fields are intentionally **not mapped into the Funding Leads projection** by this receiver. The Notion lead record only receives operational fields needed for funding review, attribution, and workflow state.

## Safe audit data

Funding Leads `API Payload` stores only a small audit envelope such as:

```json
{
  "source": "tally",
  "form_id": "dWvEqN",
  "submission_id": "sub_...",
  "webhook_event_id": "evt_...",
  "stage": "funding_intake",
  "external_lead_id": "tally-session:..."
}
```

Do not persist the complete raw Tally webhook payload into Notion.

## n8n role

n8n remains useful **after canonical persistence** for automation such as:

- notifications
- follow-up sequences
- document requests
- external CRM/lender handoffs
- enrichment
- retry/orchestration workflows

It is not part of the required normalization path.

## Failure responses

- `415` — non-JSON request
- `401` — invalid/missing Tally signature
- `400` — malformed JSON, unsupported form, or incomplete canonical data
- `404` — Funding Agent profile submitted without a matching canonical partner
- `409` — canonical identity conflict
- `503` — required persistence configuration/downstream storage unavailable
- `500` — unexpected processing failure

Detailed adapter/storage errors are logged server-side; public webhook responses do not expose secrets, database IDs, or internal configuration values.
