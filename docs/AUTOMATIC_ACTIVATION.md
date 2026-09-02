# Funding Agent Activation and Publication

Durable Notion persistence is the default path for Funding Agent Join/Profile intake. Public activation is an explicit lifecycle decision, not a side effect of submitting a public form.

## Canonical lifecycle

```text
Funding Agent Join
→ verify + normalize
→ partner_type = funding_agent
→ resolve/create canonical identity
→ durable Notion upsert
→ approval_status = needs_review
→ profile_status = draft
→ profile enrichment
→ explicit operator/admin review
→ approved + published when appropriate
→ public route eligibility
```

A Tally Join or Profile submission cannot directly grant `approved` or `published` state.

## Identity rules

- `partner_id` is the immutable cross-system identity.
- `email` is a fallback matching/upsert key, not the permanent identity.
- `referral_code` and `slug` are preserved once assigned.
- `latest_tally_submission_id` is traceability metadata, not partner identity.
- profile enrichment updates the same canonical record and does not blank trusted values.
- an already approved/published partner is not demoted when that same canonical identity re-submits Join.

Matching hierarchy:

1. `partner_id`
2. latest known Tally submission ID
3. normalized email
4. create a new partner for Join only

Profile enrichment uses the same matching hierarchy but is update-only and cannot create an orphan partner.

## Intake-source mapping

Raw Tally `FORM_RESPONSE` events use:

```text
POST /api/webhooks/tally
```

The receiver verifies the Tally HMAC signature, normalizes the live form UUIDs, then dispatches:

- `rjM6do` → Funding Agent Join service
- `9qjWEE` → Funding Agent Profile service

Trusted callers with already-normalized JSON may continue using:

- `POST /api/intake/tally/application`
- `POST /api/intake/tally/profile`

Both paths reuse the same shared lifecycle services.

## Durable source of truth

Notion database: **Moonshine Capital Partners CRM**

Runtime configuration:

- `NOTION_API_KEY`
- `NOTION_BROKER_DATABASE_ID`

Credentials are never committed.

## Publication gating

A durable partner is eligible for a public partner route only when:

```text
approval_status = approved
AND
profile_status = published
```

`needs_review`, `draft`, `hidden`, `suspended`, `rejected`, and `archived` records are not public. Existing Wix lookup remains an optional compatibility fallback; it does not own canonical lifecycle state.
