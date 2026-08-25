# Partner Command ↔ Capital Profile Contract

## Canonical ownership

`moonshine-capital-portal` owns the public Capital surface:

- public partner identity and profiles
- co-branded funding pages
- directory / industries / funding-type discovery
- partner-specific lead capture
- public slug and publication eligibility
- tracked public CTA routing
- Tally application/profile intake contracts

`partner-command-center` owns the authenticated operating environment and may manage partner-editable profile configuration. It does not publish partners directly.

## Identity contract

Canonical identity supports:

```text
partner_id
referral_code
slug
full_name
display_name
email
phone
company_name
title
profile_status
approval_status
partner_type
specialties
industries
funding_types
markets
bio
photo_url
logo_url
booking_url
primary_cta
disclosures
created_at
updated_at
published_at
```

The TypeScript implementation currently uses camelCase equivalents at application boundaries.

## Write rules

1. Normalize email before using it as the current merge key.
2. Preserve an existing `partner_id`, `referral_code`, and slug when supplied.
3. Deterministic fallback IDs make retries converge instead of minting duplicates.
4. Profile enrichment must not overwrite trusted data with blank values.
5. Application/profile intake never implies approval.
6. Approval never bypasses the existing public-display gating rules.
7. Capital owns slug/publication; Partner Command may request profile changes but cannot force publication.

## Attribution contract

Public partner flows should preserve when present:

```text
partner_id
referral_code
source
campaign
utm_source
utm_medium
utm_campaign
```

Existing `/out` routing remains the canonical tracked CTA gateway. Future attribution enrichment should extend it rather than create a second tracking stack.

## Public route contract

Target:

```text
capital.distilledfunding.com/<partner-slug>
```

The top-level dynamic route delegates to the existing `/directory/[slug]` renderer so the established approval/activity/visibility checks remain authoritative. Pending or otherwise ineligible partners must not render publicly.

## Deployment safety

Automatic Vercel Git deployments are disabled in `vercel.json`. GitHub Actions is the pull-request validation gate. Production deployment is an explicit release action only after validation and an intentional production-enable decision.

## Current productionization blocker

`lib/notion.ts` is still a stub. The deterministic identity and provisioning contract is implemented, but durable CRM persistence is not production-complete until the live Notion adapter and credentials are wired.
