# Tally Funding Agent Application Schema

`POST /api/intake/tally/application` is the dedicated canonical Funding Agent intake endpoint. It accepts normalized JSON produced from the Funding Agent Tally submission (directly or through the existing normalization layer).

## Applicant fields consumed when available

| Intake field | Canonical mapping | Requirement |
| --- | --- | --- |
| `fullName` | `fullName` / default `displayName` | required for automatic activation |
| `email` | normalized `email` | required and format-valid for automatic activation |
| `agencyName` | `agencyName` | required for automatic activation |
| `phoneNumber` | `phoneNumber` | optional |
| `city` | `city` | optional |
| `state` | normalized `state` | optional |
| `websiteUrl` | normalized `websiteUrl` | optional |
| `shortBio` | `shortBio` | optional |
| `profileImage` / `photoUrl` | `profileImage` | optional |
| `logoUrl` | `logoUrl` | optional |
| `bookingUrl` | `bookingUrl` | optional |

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

A submission with valid required fields proceeds to:

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
