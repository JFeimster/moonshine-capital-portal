# AUTOMATIONS_AND_WEBHOOKS

## Goal
Map intake, persistence, routing, and downstream automation without duplicating canonical field logic across tools.

## Canonical Tally forms

### Public funding intake
1. `dWvEqN` — **Personalized Funding Quote Intake**
   - canonical first-step funding intake
   - captures core business metrics plus attribution/referral hidden fields
   - normally the first public funding CTA

2. `w4R2Ad` — **Funding for ANY Reason**
   - canonical broader/full funding application
   - remains available as Step 2 and as a direct campaign/referral path

3. `mDEJB5` — **Get a Personalized Funding Quote — No Hard Credit Check**
   - legacy only

### Funding Agent intake
1. `rjM6do` — **Join Moonshine Capital — Funding Agent**
   - canonical identity-creation step
   - new identities initialize as `needs_review` + `draft`
   - no approval/publication authority

2. `9qjWEE` — **Build Your Funding Agent Profile**
   - canonical profile-enrichment step
   - must enrich an existing canonical partner only
   - no approval/publication authority

3. `A7edqy` — **Launch Your Agency**
   - post-profile operating-plan step
   - no lifecycle authority

4. `mOe658` — **Join the #1 B2B Funding Platform!**
   - legacy all-in-one Funding Agent form

## Canonical ingestion boundary

All four active funding/agent forms send raw `FORM_RESPONSE` events to:

```text
POST /api/webhooks/tally
```

The Next.js/Vercel receiver owns:

```text
raw Tally payload
→ signature verification
→ form allowlist
→ UUID/label normalization
→ canonical service dispatch
→ Notion persistence
```

This makes normalization versioned, tested code beside the schemas and lifecycle rules instead of a second mapping layer in n8n.

## Core workflows

### 1. Public funding application flow

```text
dWvEqN
→ /api/webhooks/tally
→ Funding Leads upsert
→ review / next-step routing
```

When a broader application is appropriate:

```text
w4R2Ad
→ /api/webhooks/tally
→ enrich/update the same Funding Lead when session_id is preserved
→ underwriting/follow-up workflow
```

Without `session_id`, a form/submission-scoped external key is used rather than guessing that two submissions belong to the same business.

### 2. Funding Agent Join

```text
rjM6do
→ /api/webhooks/tally
→ shared Funding Agent Join service
→ canonical Notion partner record
```

A public Join submission cannot self-approve or self-publish. Existing approved/published records remain intact when the same identity re-submits.

### 3. Funding Agent Profile

```text
9qjWEE
→ /api/webhooks/tally
→ shared Funding Agent Profile service
→ update existing canonical partner
```

The profile service does not create orphan partners and cannot independently change lifecycle state.

### 4. Funding Agent launch plan

`A7edqy` remains a post-profile operating-plan workflow with no approval/publication authority. It is not yet dispatched by the canonical raw receiver and can remain a downstream automation surface until an explicit operating-plan destination is implemented.

### 5. Broker approval flow

Operator/admin action or explicit Notion lifecycle change controls publication.

Public eligibility requires:

```text
approvalStatus = approved
AND
profileStatus = published
```

### 6. CTA tracking flow

`/out` remains the canonical tracked redirect boundary.

## n8n role

n8n is optional downstream orchestration, not the canonical normalization engine.

Good n8n uses after persistence include:

- internal notifications
- applicant/broker follow-up sequences
- document request workflows
- CRM/lender handoffs
- enrichment
- retry queues
- scheduled operational reporting

If n8n is used, it should consume canonical IDs/state rather than recreate Tally field mappings.

## Endpoints

- `POST /api/webhooks/tally` — canonical raw Tally receiver
- `POST /api/intake/tally/application` — trusted normalized Funding Agent Join compatibility endpoint
- `POST /api/intake/tally/profile` — trusted normalized profile compatibility endpoint
- `/out` — tracked redirect boundary
- future: explicit admin publication/resource assignment endpoints as the admin surface matures

## Embed/event-forwarding rule

The shared Tally embed forwards browser lifecycle events for analytics/app signaling and re-runs `Tally.loadEmbeds()` on mount for Next.js client navigation.

Browser events are not persistence or lifecycle authority. Canonical writes originate from the signed server-side webhook path.

## Event data worth preserving

- Tally form ID
- Tally submission/event ID
- canonical partner/lead ID
- source/referral/partner attribution
- session ID where available
- page source
- UTM fields
- canonical lifecycle/review state
- timestamps

Do not store a complete raw funding payload in a broadly accessible audit/event field when a minimal redacted envelope is sufficient.
