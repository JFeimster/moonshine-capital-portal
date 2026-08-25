# Tally Funding Agent Application Schema

`POST /api/intake/tally/application` is the dedicated canonical Funding Agent intake endpoint. It accepts normalized JSON produced from the Funding Agent Tally submission (directly or through the existing normalization layer).

## Applicant fields consumed when available

| Intake field | Canonical mapping | Requirement |
| --- | --- | --- |
| `fullName` | `fullName` / default `displayName` | required for automatic activation |
| `email` | normalized `email` | required and format-valid for automatic activation |
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

Track C separates identity creation from profile enrichment. The canonical Join form therefore only needs a safe merge identity to create and activate the Funding Agent record:

```text
fullName
email
```

Phone, referral metadata, consent, and source attribution may also be collected by the form, but they are not required by this endpoint for deterministic identity creation.

When `agencyName` is omitted at Join, the endpoint uses `fullName` as a neutral display-safe fallback. The follow-on Profile Builder is expected to replace/enrich that value when the agent supplies an agency or brand name. This keeps the Join step short without creating a second identity or weakening merge safety.

## Source metadata

When available, persist:

- `tallyFormId` or `formId` → `tallyFormId`
- `tallySubmissionId` or `submissionId` → `latestTallySubmissionId`
- source route → `sourceForm = funding_agent_application`
- initial/latest submission timestamps

## Server-assigned partner type

The applicant does not select a partner type. This route always assigns:

```text
partnerType = funding_agent
```

The route is the stable intake-source discriminator. Future partner forms should use their own explicit source mappings rather than overloading this route.

## Automatic activation

A submission with valid required identity fields and the neutral public-shell defaults proceeds to:

```text
approvalStatus = approved
profileStatus = published
```

Malformed/unsafe submissions that can still be identified safely use:

```text
approvalStatus = needs_review
profileStatus = draft
reviewReason = <exception reason>
```

Identity conflicts and persistence errors are not silently converted into public profiles.

## Canonical identity

The endpoint preserves supplied canonical IDs when present and otherwise provisions deterministic fallback identity from the normalized email for first-time intake:

- `partnerId`
- `referralCode`
- `slug`

Durable upsert then resolves by partner ID, known submission ID, normalized email, or creation in that order.
