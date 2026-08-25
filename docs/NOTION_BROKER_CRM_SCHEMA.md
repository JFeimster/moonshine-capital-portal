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
| Review Reason | `reviewReason` | Human-readable exception/reconciliation reason |

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
- Why Choose You
- Urgency Category
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

When a partner ID matches, supplied secondary identifiers (email and submission ID) are cross-checked. If a secondary key resolves to another canonical partner, the write is rejected as a conflict instead of corrupting either record.

Profile enrichment uses the same matching hierarchy but is **update-only**: if no existing canonical partner matches, it returns not found rather than creating an orphan record.

## Concurrent-delivery reconciliation

Notion does not provide a uniqueness constraint on text properties. After first-time creation, the adapter re-queries the canonical identity. If concurrent webhook deliveries created duplicate pages, it deterministically keeps the earliest canonical page and marks later same-identity pages:

```text
Approval Status = needs_review
Profile Status = archived
Review Reason = duplicate reconciliation note
```

Records resolving to different canonical partner IDs are treated as conflicts and are not silently merged.

## Lifecycle preservation

Automatic activation may advance `needs_review → approved` and `draft → published`, but routine application retries do not override operator-imposed states such as:

- suspended
- rejected
- hidden
- archived

Likewise, an already approved/published record is not downgraded by a partial retry.

## Publication rule

A durable Notion partner is public only when:

```text
Approval Status = approved
AND
Profile Status = published
```

All other lifecycle combinations remain non-public.
