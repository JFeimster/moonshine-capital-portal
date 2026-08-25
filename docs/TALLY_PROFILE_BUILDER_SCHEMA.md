# Tally Profile Builder Schema

The profile-builder flow enriches the **same canonical partner record** created by the Funding Agent application. It does not create a second profile or independently change approval/publication state.

## Match fields

Preferred:

| Intake field | Canonical mapping | Purpose |
| --- | --- | --- |
| `partnerId` | `partnerId` | Preferred immutable lookup key |
| `email` | normalized `email` | Fallback lookup key when partner ID is unavailable |
| `tallySubmissionId` / `submissionId` | `latestTallySubmissionId` | Traceability metadata |

At least `partnerId` or a valid email must be present.

## Enrichment fields consumed when available

- `displayName`
- `fullName`
- `agencyName`
- `title`
- `phoneNumber`
- `shortBio`
- `whyChooseYou`
- `city`
- `state`
- `websiteUrl`
- `industries`
- `fundingTypes`
- `specialties`
- `markets`
- `urgencyCategory`
- `profileImage` / `photoUrl`
- `logoUrl`
- `bookingUrl`
- `primaryCtaLabel`
- `primaryCtaLink`
- `disclosures`

URLs and arrays are normalized at the application boundary.

## Blank-safe update rule

```text
existing trusted value + blank incoming value → preserve existing value
```

Profile enrichment does not intentionally overwrite:

- `partnerId`
- `referralCode`
- persisted `slug`
- `approvalStatus`
- `profileStatus`

The durable adapter resolves the existing partner and preserves canonical identity on routine updates/retries.

## Publication

This endpoint does not publish a partner by itself. It returns the durable record's current approval/profile state. Public eligibility continues to require:

```text
approvalStatus = approved
AND
profileStatus = published
```
