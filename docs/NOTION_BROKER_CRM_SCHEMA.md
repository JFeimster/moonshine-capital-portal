# Notion Broker CRM Schema

Canonical durable partner database: **Moonshine Capital Partners CRM**.

## Identity and lifecycle

| Notion Property | Canonical field | Purpose |
| --- | --- | --- |
| Name | `fullName` | Partner display/title record |
| Email | `email` | Normalized fallback match key; not immutable identity |
| Partner ID | `partnerId` | Immutable cross-system identity |
| Referral Code | `referralCode` | Persistent attribution identity |
| Slug | `slug` | Persistent public route identity |
| Partner Type | `partnerType` | `Funding Agent` for canonical Funding Agent intake |
| Approval Status | `approvalStatus` | `approved`, `needs_review`, `suspended`, `rejected` |
| Profile Status | `profileStatus` | `draft`, `published`, `hidden`, `archived` |
| Review Reason | `reviewReason` | Human-readable exception reason |

## Traceability

| Notion Property | Canonical field |
| --- | --- |
| Source Form | `sourceForm` |
| Tally Form ID | `tallyFormId` |
| Tally Submission ID | legacy/current submission reference |
| Latest Tally Submission ID | `latestTallySubmissionId` |
| Initial Submission At | `initialSubmissionAt` |
| Latest Submission At | `latestSubmissionAt` |
| Updated At | `updatedAt` |
| Application Date | initial application timestamp |

## Profile enrichment

The CRM reuses existing fields where possible and stores canonical profile values in:

- Company
- Phone
- Display Name
- City
- State
- Website / Website URL
- Bio
- Photo URL
- Logo URL
- Specialties
- Industries
- Funding Types
- Markets
- Booking URL
- Primary CTA Label
- Primary CTA URL
- Disclosures

Array-like canonical values are stored as comma-separated text in the current Notion schema and normalized back to arrays by the adapter.

## Upsert hierarchy

1. Partner ID
2. Latest Tally Submission ID
3. normalized Email
4. create a new record

Once present, `partnerId`, `referralCode`, and `slug` are preserved during routine retries and profile enrichment.

## Publication rule

A durable Notion partner is public only when:

```text
Approval Status = approved
AND
Profile Status = published
```

All other lifecycle combinations remain non-public.
