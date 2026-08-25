# Partner Command ↔ Capital Profile Contract

Status: Batch 2 foundation for the canonical broker / agency / partner architecture in `JFeimster/partner-command-center` Issue #25.

## Ownership boundary

### Partner Command (`partner-command-center`)

Authenticated partner configuration and operating context may manage/edit:

```text
display_name
company_name
title
photo_url
logo_url
bio
specialties
industries
funding_types
markets
booking_url
primary_cta
contact details
CTA preferences
```

Partner Command does **not** become the public renderer and does not independently publish a partner.

### Capital (`moonshine-capital-portal`)

Capital remains authoritative for:

```text
partner_id
referral_code
slug
public rendering
publication eligibility
publication status
tracked public CTA behavior
public directory/discovery
```

Approval and publication gating are authoritative on the Capital side.

## Canonical identity envelope

External/API representation SHOULD prefer snake_case:

```json
{
  "partner_id": "prt_example",
  "referral_code": "MCEXAMPLE",
  "slug": "jane-partner-abc12",
  "full_name": "Jane Partner",
  "display_name": "Jane Partner",
  "email": "jane@example.com",
  "phone": "+1...",
  "company_name": "Partner Capital LLC",
  "title": "Funding Partner",
  "profile_status": "pending_review",
  "approval_status": "pending",
  "partner_type": "funding_partner",
  "specialties": [],
  "industries": [],
  "funding_types": [],
  "markets": [],
  "bio": "...",
  "photo_url": "https://...",
  "logo_url": "https://...",
  "booking_url": "https://...",
  "primary_cta": {
    "label": "Apply for Funding",
    "url": "https://..."
  },
  "disclosures": [],
  "updated_at": "2026-08-25T00:00:00.000Z"
}
```

The current TypeScript implementation uses camelCase equivalents (`partnerId`, `referralCode`, `displayName`, etc.). Boundary adapters are responsible for explicit mapping; do not create duplicate semantic fields merely because casing differs.

## Lifecycle

Canonical lifecycle target:

```text
application_received
→ pending_review
→ approved
→ profile_incomplete
→ ready_to_publish
→ published
→ suspended
→ archived
```

Current legacy internal/public status fields remain in place for backward compatibility. Migration must be explicit and must not weaken `isEligibleForPublicDisplay()`.

## Write rules

1. **Merge by canonical identity.** Existing intake currently uses normalized email as the CRM merge key. Once durable storage supports canonical IDs, `partner_id` becomes the preferred immutable cross-system identifier.
2. **Preserve IDs.** Never replace an existing `partner_id`, `referral_code`, or reserved slug with newly generated values on a routine profile update.
3. **No blank overwrites.** Partial Partner Command/profile-builder updates must not erase trusted values with empty strings or empty arrays.
4. **Capital owns slug/publication.** Partner Command may request a display/profile change but must not independently assign a conflicting slug or force public status.
5. **Approval is explicit.** An application or enrichment submission is never equivalent to approval.
6. **Publication is explicit.** Approved does not automatically mean published unless the publication workflow says so.
7. **Audit timestamps.** Writes should update `updated_at`; first creation should preserve `created_at`; public activation should set `published_at` once authoritative.

## Attribution contract

Every public profile/funding flow should preserve when present:

```text
partner_id
referral_code
source
campaign
utm_source
utm_medium
utm_campaign
```

Partner Command may generate/copy links and campaign parameters. Capital owns the public route and tracked CTA behavior. Existing `/out` tracking should be reused instead of creating another attribution stack.

Example public handoff:

```text
app.distilledfunding.com
→ partner copies share URL / campaign link
→ capital.distilledfunding.com/<partner-slug>?utm_source=partner&utm_campaign=...
→ user submits / clicks CTA
→ partner_id + referral_code + campaign metadata preserved
```

## Public-read rule

A partner record supplied by Partner Command is not automatically public. Capital public reads continue to enforce approval/activity/visibility gating. Pending, rejected, suspended, hidden, or otherwise ineligible records must return no public profile.

## Failure / conflict handling

- A missing merge key is a rejected write, not a new anonymous partner.
- Conflicting immutable IDs require manual/operator review; do not silently mint a second partner.
- Slug collision handling must be deterministic or collision-safe.
- Failed persistence must return an error and remain retryable/idempotent.
- Downstream publication failure must not change an applicant into `published`.

## Deployment safety

Automatic Vercel Git deployments are intentionally disabled in `vercel.json` while this foundation is being productionized. GitHub Actions is the validation gate for pull requests. A production deployment should be an explicit release action after CI passes and the production gate is intentionally enabled; branch commits must not generate preview-deployment churn.

## Current implementation limitation

`lib/notion.ts` is presently a stub. Therefore the interface and deterministic identity foundation exist, but the application does not yet have durable production CRM upserts. Wiring the real persistence adapter is required before this contract is considered production-complete.
