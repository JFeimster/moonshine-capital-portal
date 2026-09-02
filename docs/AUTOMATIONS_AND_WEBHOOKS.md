# AUTOMATIONS_AND_WEBHOOKS

## Goal
Map the automation layer so intake, routing, resource assignment, and notifications can happen without duct tape.

## Canonical Tally forms

### Public funding intake
1. `dWvEqN` — **Personalized Funding Quote Intake**
   - canonical first-step funding intake
   - captures core business metrics plus attribution/referral hidden fields
   - should normally be the first public funding CTA

2. `w4R2Ad` — **Funding for ANY Reason**
   - canonical broader/full funding application
   - should remain available as the second step and as a direct campaign/referral path

3. `mDEJB5` — **Get a Personalized Funding Quote — No Hard Credit Check**
   - legacy only
   - retain for historical links while removing it from new portal surfaces

### Funding Agent intake
1. `rjM6do` — **Join Moonshine Capital — Funding Agent**
   - canonical identity-creation step
   - normalized payload target: `/api/intake/tally/application`
   - new records initialize as `needs_review` + `draft`
   - no approval/publication authority

2. `9qjWEE` — **Build Your Funding Agent Profile**
   - canonical profile-enrichment step
   - normalized payload target: `/api/intake/tally/profile`
   - must enrich an existing canonical partner only
   - no approval/publication authority

3. `A7edqy` — **Launch Your Agency**
   - post-profile operating-plan step
   - no lifecycle authority

4. `mOe658` — **Join the #1 B2B Funding Platform!**
   - legacy all-in-one Funding Agent form
   - retain for historical links/submissions; do not use as the canonical new-user path

## Core workflows

### 1. Public funding application flow
`dWvEqN` → webhook → n8n → Notion lead record → review / next-step routing

When the review calls for a broader application:
`w4R2Ad` → webhook → n8n → enrich/update the same lead → underwriting/follow-up workflow

The public funding flow is deliberately two-stage. Do not force every applicant into the full form before the initial review.

### 2. Funding Agent join flow
`rjM6do` → webhook → n8n normalization → `/api/intake/tally/application` → canonical Notion partner record (`needs_review` + `draft` for new identities)

The application endpoint owns deterministic identity creation only. A public Join submission cannot self-approve or self-publish. Existing approved/published records remain intact when the same identity re-submits.

### 3. Funding Agent profile-builder flow
`9qjWEE` → webhook → n8n normalization → `/api/intake/tally/profile` → update existing Notion partner record

The profile endpoint must not create an orphan partner and must not independently approve or publish a profile.

### 4. Funding Agent launch-plan flow
`A7edqy` → webhook → n8n → operating-plan / enablement data

This flow may enrich internal operating context but has no approval/publication authority.

### 5. Broker approval flow
Admin action / Notion status change → n8n → publish profile state / send broker update

Public eligibility requires both:

```text
approvalStatus = approved
AND
profileStatus = published
```

### 6. CTA tracking flow
`/out` route → webhook → event log store → reporting layer

## Recommended webhook endpoints
- `/api/intake/tally/application`
- `/api/intake/tally/profile`
- `/out`
- future: canonical public funding-lead intake endpoint if/when the current n8n → Notion lead path is moved behind the app
- future: `/api/admin/publish-broker`
- future: `/api/admin/assign-resources`

## Embed/event-forwarding rule
Use the Tally JavaScript/HTML embed path rather than a bare static iframe whenever forms are embedded in the app. Tally's embed script forwards the parent page and query parameters into matching hidden fields, which preserves `source`, referral, partner and UTM context when those hidden fields exist on the form.

The shared Next.js embed must re-run `Tally.loadEmbeds()` on mount because client-side route transitions can reuse the already-loaded Tally script while inserting a new `data-tally-src` iframe.

Do not treat browser-side form events as lifecycle authority. Submission persistence and approval/publication changes must continue through authenticated webhook/intake routes and the canonical Notion record.

## Event payloads to normalize
- source
- submission type
- Tally form id
- Tally submission id
- email
- partner id / lead id / slug
- referral code / referring partner
- status
- timestamp
- destination URL
- page source
- UTM fields

## Notes
Automations should enforce the system design.
If the workflow allows bad data to glide through just because a webhook technically fired, the automation is still bad.
