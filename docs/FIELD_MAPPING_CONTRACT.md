# Canonical Broker / Partner Schema & Field Mapping Contract

This is the master cross-system contract for Funding Agent identity and profile data moving from Tally through the Next.js application layer into Notion. Optional downstream adapters consume this contract; they do not redefine it.

## Architecture

```text
Tally FORM_RESPONSE
  → POST /api/webhooks/tally
  → UUID-based normalization
  → Funding Agent application services
  → Notion Partners CRM
```

- Next.js/Vercel owns canonical normalization and lifecycle rules.
- Notion is the operational source of truth.
- n8n is optional downstream orchestration only.
- Wix is optional downstream compatibility/publishing only.

## Identity contract

`partnerId` is the immutable cross-system identity.

Matching/upsert order:

1. `partnerId`, when supplied by a trusted caller
2. known Tally submission ID
3. normalized `email`
4. otherwise create a new canonical identity when creation is allowed

Public raw Tally Profile submissions do not get to assert `partnerId`; they resolve by normalized email and may enrich only a `needs_review + draft` record.

Once assigned during normal operations, preserve:

- `partnerId`
- `referralCode`
- `slug`

Email is a merge/contact field, not the permanent primary identity.

## Lifecycle contract

Canonical approval states:

```text
approved | needs_review | suspended | rejected
```

Canonical profile states:

```text
draft | published | hidden | archived
```

A new public Funding Agent Join submission begins as:

```text
approvalStatus = needs_review
profileStatus = draft
```

The public Profile Builder enriches that existing record but cannot approve or publish it. Approval/publication is an explicit operator-controlled transition.

Public directory eligibility requires both:

```text
approvalStatus = approved
AND
profileStatus = published
```

Downstream Wix or other adapters may normalize legacy values such as `pending → needs_review`, but they may not introduce a competing lifecycle vocabulary.

## Form/source contract

| Tally form | Role | `sourceForm` | Lifecycle authority |
| --- | --- | --- | --- |
| `rjM6do` | Funding Agent Join / identity creation | `funding_agent_join` | creates `needs_review + draft`; cannot self-approve/publish |
| `9qjWEE` | Funding Agent Profile enrichment | `funding_agent_profile` | enrichment only; cannot create orphan records or change lifecycle |
| `A7edqy` | Agency launch/operating plan | separate operating-plan workflow | none |

The raw Tally mapping is keyed by live question UUIDs in `lib/tally-webhook.ts`.

## Canonical field groups

The executable field classification lives in `lib/partner-contract.ts`.

### Immutable/persistent identity
- `partnerId`
- `referralCode`
- `slug`

### Merge keys
- normalized `email`
- `latestTallySubmissionId`

### Lifecycle/internal
- `approvalStatus`
- `profileStatus`
- `reviewReason`

### Public profile
- `fullName`
- `displayName`
- `agencyName`
- `title`
- `city`
- `state`
- `websiteUrl`
- `phoneNumber`
- `shortBio`
- `whyChooseYou`
- `industries`
- `fundingTypes`
- `specialties`
- `markets`
- `profileImage`
- `logoUrl`
- `bookingUrl`
- `primaryCtaLabel`
- `primaryCtaLink`
- `disclosures`

### Server-assigned
- `partnerType` (`funding_agent` for the Funding Agent Join flow)

### Traceability
- `sourceForm`
- `tallyFormId`
- `latestTallySubmissionId`
- `initialSubmissionAt`
- `latestSubmissionAt`
- `updatedAt`
- `notionPageId`

## Live Notion Partners CRM projection

The live `Moonshine Capital Partners CRM` data source was reconciled against the application contract on 2026-09-02. The app writes the following canonical properties:

| App field | Notion property |
| --- | --- |
| `fullName` | `Name` |
| `email` | `Email` |
| `agencyName` | `Company` |
| `phoneNumber` | `Phone` |
| `partnerId` | `Partner ID` |
| `referralCode` | `Referral Code` |
| `slug` | `Slug` |
| `partnerType` | `Partner Type` |
| `approvalStatus` | `Approval Status` |
| `profileStatus` | `Profile Status` |
| `reviewReason` | `Review Reason` |
| `sourceForm` | `Source Form` |
| `tallyFormId` | `Tally Form ID` |
| `latestTallySubmissionId` | `Latest Tally Submission ID` |
| `initialSubmissionAt` | `Initial Submission At` |
| `latestSubmissionAt` | `Latest Submission At` |
| `updatedAt` | `Updated At` |
| `displayName` | `Display Name` |
| `city` | `City` |
| `state` | `State` |
| `websiteUrl` | `Website URL` |
| `shortBio` | `Bio` |
| `whyChooseYou` | `Why Choose You` |
| `urgencyCategory` | `Urgency Category` |
| `profileImage` | `Photo URL` |
| `logoUrl` | `Logo URL` |
| `specialties` | `Specialties` |
| `industries` | `Industries` |
| `fundingTypes` | `Funding Types` |
| `markets` | `Markets` |
| `bookingUrl` | `Booking URL` |
| `primaryCtaLabel` | `Primary CTA Label` |
| `primaryCtaLink` | `Primary CTA URL` |
| `disclosures` | `Disclosures` |

The Notion adapter converts array-like profile fields to comma-separated text at the persistence boundary and converts them back to arrays when reading.

## Transformation rules

- Normalize email to trimmed lowercase before matching.
- Normalize supported U.S. states to two-letter codes.
- Normalize URLs and add a protocol when absent.
- Normalize Tally choice/multi-choice values to canonical labels/arrays.
- Partial profile enrichment is blank-safe: blank values do not erase existing trusted values.
- Persisted `partnerId`, `referralCode`, `slug`, and initial submission time win over later retries/enrichment.
- Existing non-default lifecycle state is preserved during ordinary enrichment.

## Attribution and CTA routing

Preserve partner/source attribution using:

```text
partner_id
referral_code
source
campaign
utm_source
utm_medium
utm_campaign
```

Broker CTAs prefer `/go/[registry-slug]` only when a stable registry-backed destination is explicitly assigned. Otherwise the existing attributed `/out?...` route remains the compatibility path so partner attribution is not discarded.
