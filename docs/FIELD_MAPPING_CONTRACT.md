# Canonical Broker / Partner Schema & Field Mapping Contract

This file is the master cross-system contract for partner identity and profile data moving between Tally, Notion CRM, and public rendering.

## Identity contract

`partnerId` / `partner_id` is the immutable cross-system identity.

Matching/upsert order:

1. `partnerId`, when supplied
2. known intake/submission ID
3. normalized `email`
4. otherwise create a new canonical partner

Email is a matching field, not the permanent primary identity. Name, company, email, public slug display inputs, Notion page ID, and later system-specific IDs may change without changing the canonical partner ID.

Once assigned during normal operations, preserve:

- `partnerId`
- `referralCode`
- `slug`

## Intake-source contract

The canonical Funding Agent application route is source-specific and assigns:

```text
partnerType = funding_agent
```

server-side. It does not depend on an applicant-selected partner type.

## Lifecycle fields

Approval and publication remain separate:

```text
approvalStatus = approved | needs_review | suspended | rejected
profileStatus = draft | published | hidden | archived
```

Normal clean Funding Agent application:

```text
approved + published
```

Exception application:

```text
needs_review + draft
```

Public eligibility requires both `approved` and `published`.

## Canonical data model

| Field | Type | Purpose |
| --- | --- | --- |
| `partnerId` | string | Immutable partner identity |
| `referralCode` | string | Persistent attribution identity |
| `slug` | string | Persistent public route identity |
| `partnerType` | string | Intake-source assigned partner class |
| `approvalStatus` | enum | Approval lifecycle |
| `profileStatus` | enum | Publication lifecycle |
| `reviewReason` | string | Exception reason when review is required |
| `fullName` | string | Full name |
| `displayName` | string | Preferred public display name |
| `email` | string | Normalized fallback match/contact field |
| `agencyName` | string | Company/agency |
| `city` | string | City |
| `state` | string | State/region |
| `websiteUrl` | URL | Website |
| `phoneNumber` | string | Phone |
| `shortBio` | string | Public biography |
| `industries` | string[] | Industries served |
| `fundingTypes` | string[] | Funding products |
| `specialties` | string[] | Specialties |
| `markets` | string[] | Markets |
| `profileImage` | URL | Profile/headshot image |
| `logoUrl` | URL | Company logo |
| `bookingUrl` | URL | Booking destination |
| `primaryCtaLabel` | string | CTA label |
| `primaryCtaLink` | URL | CTA destination |
| `disclosures` | string[] | Disclosures |

## Traceability attributes

System/source identifiers are attributes, not canonical identity:

- `notionPageId`
- `tallyFormId`
- `latestTallySubmissionId`
- future `supabaseUserId`
- future `hubspotContactId`

Source timestamps include `initialSubmissionAt`, `latestSubmissionAt`, and `updatedAt`.

## Transformation rules

- Normalize email to trimmed lowercase before matching.
- Normalize supported U.S. state values to two-letter codes.
- Normalize URLs and add a protocol when absent.
- Normalize comma-separated/multi-select values to arrays in the application domain.
- The current Notion CRM stores array-like profile values as comma-separated text; the adapter converts them at the persistence boundary.
- Partial profile enrichment is blank-safe: blank values do not erase existing trusted values.
- Slug generation is deterministic for a new identity; persisted slugs take precedence on retry/enrichment.

## Attribution

Preserve canonical identity through existing tracking:

```text
partner_id
referral_code
source
campaign
utm_source
utm_medium
utm_campaign
```

Continue using the existing `/out` tracking infrastructure rather than creating a parallel attribution system.
