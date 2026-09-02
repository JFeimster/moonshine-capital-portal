# Tally Funding Agent Application Schema

The canonical live Join form is `rjM6do`.

Raw Tally `FORM_RESPONSE` events enter through `POST /api/webhooks/tally`, where the live Tally question UUIDs are normalized and dispatched to the shared Funding Agent Join service. `POST /api/intake/tally/application` remains a trusted compatibility endpoint for callers that already supply normalized JSON. Both paths execute the same lifecycle logic.

## Applicant fields consumed when available

| Intake field | Canonical mapping | Requirement |
| --- | --- | --- |
| `fullName` | `fullName` / default `displayName` | required for a usable identity record |
| `email` | normalized `email` | required as the deterministic merge key |
| `agencyName` | `agencyName`; defaults to `fullName` at Join when omitted | optional at minimal Join; enrich through Profile Builder |
| `phoneNumber` | `phoneNumber` | optional |
| `city` | `city` | optional |
| `state` | normalized `state` | optional |
| `websiteUrl` | normalized `websiteUrl` | optional |
| `shortBio` | `shortBio` | optional |
| `profileImage` / `photoUrl` | `profileImage` | optional |
| `logoUrl` | `logoUrl` | optional |
| `bookingUrl` | `bookingUrl` | optional |

## Minimal Join contract

The onboarding flow separates identity creation from profile enrichment and approval. The canonical Join form therefore only needs a safe merge identity to create the Funding Agent record:

```text
fullName
email
```

Phone, referral metadata, consent, and source attribution may also be collected by the form, but they are not required for deterministic identity creation.

When `agencyName` is omitted at Join, the service uses `fullName` as a neutral display-safe fallback. The follow-on Profile Builder is expected to replace/enrich that value when the agent supplies an agency or brand name. This keeps Join short without creating a second identity or weakening merge safety.

## Source metadata

When available, persist:

- `tallyFormId` or `formId` → `tallyFormId`
- `tallySubmissionId` or `submissionId` → `latestTallySubmissionId`
- source route → `sourceForm = funding_agent_application`
- initial/latest submission timestamps

## Server-assigned partner type

The applicant does not select a partner type. The Join service always assigns:

```text
partnerType = funding_agent
```

The canonical form ID/source mapping is server-owned. Applicant-supplied partner type is not lifecycle authority.

## Approval and publication gate

A public Join submission is never allowed to self-approve or self-publish. New Funding Agent identities begin as:

```text
approvalStatus = needs_review
profileStatus = draft
reviewReason = Awaiting profile completion and explicit approval
```

The Profile Builder may enrich the existing canonical record, but it does not independently change lifecycle state. Public directory eligibility continues to require:

```text
approvalStatus = approved
AND
profileStatus = published
```

The Notion adapter preserves an already-approved/published lifecycle state when an existing Funding Agent re-submits the Join form, so a repeated identity submission does not demote a previously approved agent.

Identity conflicts and persistence errors are never silently converted into public profiles.

## Canonical identity

The service preserves supplied canonical IDs when present and otherwise provisions deterministic fallback identity from the normalized email for first-time intake:

- `partnerId`
- `referralCode`
- `slug`

Durable upsert resolves by partner ID, known submission ID, normalized email, or creation in that order.
