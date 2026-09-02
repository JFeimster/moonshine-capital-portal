# Tally Profile Builder Schema

The canonical live Profile Builder is `9qjWEE`. It enriches the **same canonical partner record** created by Funding Agent Join. It does not create a second profile or independently change approval/publication state.

Raw Tally `FORM_RESPONSE` events enter through `POST /api/webhooks/tally`, where the live Tally question UUIDs and option IDs are normalized into canonical enrichment fields. `POST /api/intake/tally/profile` remains a trusted compatibility endpoint for already-normalized callers. Both paths use the same update-only profile service.

## Match fields

Preferred:

| Intake field | Canonical mapping | Purpose |
| --- | --- | --- |
| `partnerId` | `partnerId` | Preferred immutable lookup key when forwarded in the Tally hidden field |
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

The raw Tally adapter decodes current multi-select option UUIDs into stable labels before these fields reach the application service. URLs and arrays are normalized again at the application boundary.

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

The Profile Builder does not publish a partner by itself. It returns the durable record's current approval/profile state. Public eligibility continues to require:

```text
approvalStatus = approved
AND
profileStatus = published
```
