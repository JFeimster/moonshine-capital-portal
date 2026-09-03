# System Runbook: Canonical Tally Ingestion

This runbook covers the current Funding Agent ingestion path.

## Canonical flow

1. A broker submits a canonical Tally form.
2. Tally sends a signed raw `FORM_RESPONSE` directly to `POST /api/webhooks/tally`.
3. The Next.js receiver verifies the HMAC signature and selects the mapping by Tally `formId`.
4. `lib/tally-webhook.ts` normalizes live question UUIDs into the canonical application shape.
5. Funding Agent services enforce identity and lifecycle rules.
6. `lib/notion.ts` creates or enriches the canonical record in the Moonshine Capital Partners CRM.
7. n8n may consume downstream events for orchestration, but it is not required for normalization or canonical persistence.
8. Wix, if used, is downstream compatibility/publishing only.

## Funding Agent lifecycle

### Join — `rjM6do`

New public Join records start:

```text
approvalStatus = needs_review
profileStatus = draft
sourceForm = funding_agent_join
```

Public Join is create-only and cannot mutate an existing canonical identity.

### Profile — `9qjWEE`

Profile submissions enrich an existing canonical record and persist:

```text
sourceForm = funding_agent_profile
```

Public Profile enrichment resolves by normalized email and is allowed only while the record is `needs_review + draft`. It cannot create an orphan record, approve a partner, or publish a profile.

### Public eligibility

```text
approvalStatus = approved
AND
profileStatus = published
```

## Common failures

### 1. Signature rejected

**Symptom:** `401 Invalid Tally webhook signature`.

**Check:**
- Vercel production `TALLY_SIGNING_SECRET` / compatibility `TALLY_WEBHOOK_SECRET`
- the signing secret configured on the Tally webhook
- that the raw request body is being sent unchanged

Do not bypass signature verification in production.

### 2. Unsupported form or mapping drift

**Symptom:** `400 Unsupported or missing Tally form` or a required canonical field is empty.

**Resolution:**
1. Inspect the submission in Tally.
2. Compare the live form/question UUIDs with `TALLY_FORM_MAPPINGS` in `lib/tally-webhook.ts`.
3. Update the checked-in mapping and tests in a focused PR.
4. Do not move normalization into n8n as a workaround.

### 3. Missing merge key

For Funding Agent identity creation/enrichment, normalized email is the public merge key. Trusted internal calls may also resolve by canonical `partnerId` or known submission ID.

If email is missing or invalid, repair the form/mapping first. Do not create a second partner record manually unless canonical identity reconciliation has been performed.

### 4. Notion persistence failure

**Check:**
- Vercel runtime logs
- `NOTION_API_KEY`
- `NOTION_BROKER_DATABASE_ID`
- Notion API/service health
- whether the live CRM still contains the canonical properties documented in `docs/FIELD_MAPPING_CONTRACT.md`

The original Tally submission remains available in Tally for controlled replay/recovery. n8n execution history is not the canonical replay source.

### 5. Identity conflict

If multiple records resolve to different canonical `partnerId` values, the adapter fails with a conflict rather than silently choosing one. Resolve the duplicate records in Notion before replaying the submission.

## Manual recovery

1. Locate the original Tally submission.
2. Identify the canonical partner by `Partner ID`, known submission ID, or normalized email.
3. Inspect the existing Notion lifecycle state before changing anything.
4. Preserve immutable `Partner ID`, `Referral Code`, `Slug`, and initial submission timestamp.
5. Re-enter only missing/corrected values or replay through the trusted intake path.
6. Do not manually mark a partner public unless the operator has explicitly approved the partner and set the profile to `published`.

## Canonical references

- `lib/partner-contract.ts`
- `lib/tally-webhook.ts`
- `lib/intake/funding-agent.ts`
- `lib/notion.ts`
- `docs/FIELD_MAPPING_CONTRACT.md`
- `docs/TALLY_APPLICATION_SCHEMA.md`
