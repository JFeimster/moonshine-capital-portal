# Tally Funding Agent Application Schema

The canonical live Funding Agent Join form is `rjM6do`; the canonical Profile enrichment form is `9qjWEE`.

Raw Tally `FORM_RESPONSE` events enter through `POST /api/webhooks/tally`, where live Tally question UUIDs are normalized and dispatched to the shared Funding Agent services. `POST /api/intake/tally/application` and `/api/intake/tally/profile` remain trusted compatibility endpoints for callers that already supply normalized JSON. Both raw and compatibility paths execute the same domain lifecycle services.

## Minimal Join contract — `rjM6do`

The public Join step creates identity only. Required merge/identity inputs are:

```text
fullName
email
```

Phone, referral metadata, consent, and attribution may also be collected. `agencyName` is optional at Join and falls back to `fullName` until Profile enrichment.

Server-owned Join values:

```text
partnerType = funding_agent
sourceForm = funding_agent_join
approvalStatus = needs_review
profileStatus = draft
```

The applicant cannot select `partnerType` or lifecycle state.

## Profile contract — `9qjWEE`

Profile enrichment may populate:

- `displayName`
- `agencyName`
- `city`
- `state`
- `shortBio`
- `whyChooseYou`
- `profileImage`
- `websiteUrl`
- `bookingUrl`
- `fundingTypes`
- `industries`
- `markets`
- `primaryCtaLabel`
- `primaryCtaLink`

The raw Profile webhook persists:

```text
sourceForm = funding_agent_profile
```

A public Profile submission resolves by normalized email and can enrich only an existing `needs_review + draft` record. Hidden `partner_id` is attribution/context, not proof of profile ownership. The Profile form cannot create an orphan record, approve a partner, or publish a profile.

## Canonical Tally UUID mapping

`lib/tally-webhook.ts` is the executable source for live form IDs, question UUIDs, choice IDs, and hidden-field aliases. Labels are compatibility aliases; UUIDs are the stable mapping keys.

## Source metadata

Persist when available:

- `tallyFormId` / `formId` → `Tally Form ID`
- `tallySubmissionId` / `submissionId` → `Latest Tally Submission ID`
- Join → `sourceForm = funding_agent_join`
- Profile → `sourceForm = funding_agent_profile`
- `initialSubmissionAt` for first canonical creation
- `latestSubmissionAt` / `updatedAt` for subsequent intake activity

## Approval and publication gate

Public Tally forms never self-approve or self-publish.

New identity:

```text
approvalStatus = needs_review
profileStatus = draft
reviewReason = Awaiting profile completion and explicit approval
```

Public directory eligibility requires:

```text
approvalStatus = approved
AND
profileStatus = published
```

Existing non-default lifecycle state is preserved during ordinary blank-safe enrichment. Approved/published/hidden/suspended/rejected/archived records require a trusted update path rather than the public Profile form.

## Canonical identity

For first-time Join, the service provisions deterministic values from normalized email when not supplied by a trusted caller:

- `partnerId`
- `referralCode`
- `slug`

Persistence resolves by canonical partner ID, known submission ID, normalized email, or creation when allowed. Once persisted, `partnerId`, `referralCode`, `slug`, and the initial submission timestamp are preserved across retries/enrichment.

See `docs/FIELD_MAPPING_CONTRACT.md` and `lib/partner-contract.ts` for the full cross-system contract.
