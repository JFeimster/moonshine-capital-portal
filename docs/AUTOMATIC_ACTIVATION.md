# Automatic Funding Agent Activation

Batch 2.5 makes durable Notion persistence and automatic activation the default path for the dedicated Funding Agent application endpoint.

## Canonical lifecycle

```text
canonical Funding Agent intake
→ validate
→ partner_type = funding_agent
→ resolve canonical identity
→ durable Notion upsert
→ approved + published (clean submission)
→ public route eligibility
```

Exception path:

```text
malformed input / identity conflict / unsafe persistence condition
→ approval_status = needs_review
→ profile_status = draft
→ review_reason recorded when a safe record can be persisted
```

## Identity rules

- `partner_id` is the immutable cross-system identity.
- `email` is a fallback matching/upsert key, not the permanent identity.
- `referral_code` and `slug` are preserved once assigned.
- `latest_tally_submission_id` is traceability metadata, not partner identity.
- profile enrichment updates the same canonical record and does not blank trusted values.

Matching hierarchy:

1. `partner_id`
2. latest known Tally submission ID
3. normalized email
4. create a new partner

## Intake-source mapping

`POST /api/intake/tally/application` is the dedicated canonical Funding Agent intake endpoint, so it assigns `partner_type = funding_agent` server-side. Applicant-supplied partner type is ignored.

The endpoint accepts pre-normalized JSON and may receive `tallyFormId`/`formId` and `tallySubmissionId`/`submissionId` for traceability. Tally form metadata is not required to determine partner type because the route itself is source-specific.

## Durable source of truth

Notion database: **Moonshine Capital Partners CRM**

Runtime configuration:

- `NOTION_API_KEY`
- `NOTION_BROKER_DATABASE_ID`

Credentials are never committed.

## Publication gating

A durable partner is eligible for the top-level public partner route only when:

```text
approval_status = approved
AND
profile_status = published
```

`needs_review`, `draft`, `hidden`, `suspended`, `rejected`, and `archived` records are not public. Existing Wix directory lookup remains as a compatibility fallback if durable Notion lookup is unavailable.
