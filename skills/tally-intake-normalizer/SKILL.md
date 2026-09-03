---
name: tally-intake-normalizer
description: >-
  Convert Tally submissions into the canonical BrokerProfile or onboarding
  schema without inventing missing values. Use when mapping Tally form payloads,
  FORM_RESPONSE webhooks, Join applications, Profile Builder enrichment,
  question UUIDs, choice IDs, or onboarding intake fields.
metadata:
  short-description: 'Normalize Tally submissions into canonical broker intake data without fabricating values'
---

# Tally Intake Normalizer

Convert a Tally submission into the repository's canonical intake shape while preserving source fidelity. The normalizer may clean, validate, decode, and classify values; it must never guess values that the submission does not provide.

## Source of truth

Read these before changing mappings:

- `lib/tally-webhook.ts` for live form IDs, question UUIDs, choice IDs, and hidden-field aliases.
- `lib/intake-normalizers.ts` for shared normalization behavior.
- `lib/field-mapping.ts` for `CanonicalBrokerProfile`.
- `lib/intake/funding-agent.ts` for Join/Profile lifecycle and persistence behavior.
- `docs/TALLY_APPLICATION_SCHEMA.md` and `docs/TALLY_PROFILE_BUILDER_SCHEMA.md` for the external contract.
- `lib/validation.ts` for required fields and validation errors.

Use `lib/types.ts` and `data/schemas/broker-profile.schema.json` when the output is a public `BrokerProfile` rather than an operational onboarding record.

## Workflow

### 1. Identify the submission path

Determine whether the input is:

- A raw `FORM_RESPONSE` event: parse Tally metadata, resolve UUIDs and option IDs, then produce the normalized service payload.
- An already-normalized compatibility payload: do not decode labels again; normalize at the application boundary.
- A Join/Application submission (`rjM6do`): create the minimum canonical identity when allowed.
- A Profile Builder submission (`9qjWEE`): enrich an existing canonical identity only.

If the form ID is unknown, stop and report it. Do not infer a mapping from a question label when an executable UUID mapping exists.

### 2. Preserve provenance

Carry source metadata when present:

- `formId` -> `tallyFormId`
- `submissionId` -> `latestTallySubmissionId`
- Join -> `sourceForm = funding_agent_join`
- Profile -> `sourceForm = funding_agent_profile`
- submission timestamps -> `initialSubmissionAt`, `latestSubmissionAt`, or `updatedAt` according to whether this is creation or enrichment

Keep hidden `partner_id` as context only. It is not proof that a public respondent owns an existing profile.

### 3. Map fields conservatively

Map only fields defined by the target schema. The usual canonical fields are:

- Identity: `fullName`, `displayName`, `email`, `partnerId`, `referralCode`, `slug`
- Organization: `agencyName`, `companyName`, `title`
- Contact/location: `phoneNumber`, `city`, `state`, `markets`
- Profile: `shortBio`, `whyChooseYou`, `profileImage`, `logoUrl`, `disclosures`
- Services: `industries`, `fundingTypes`, `specialties`, `urgencyCategory`
- Links/CTA: `websiteUrl`, `bookingUrl`, `primaryCtaLabel`, `primaryCtaLink`

For a missing field, omit it or use the schema's empty collection representation only when the target contract requires an array. Never manufacture a name, agency, location, bio, category, URL, status, or consent value.

### 4. Apply repository normalizers

Use the shared helpers rather than local variants:

- `normalizeEmail`: trim and lowercase email before matching or persistence.
- `normalizeUrl`: trim, add `https://` when no scheme is supplied, remove one trailing slash, and return `undefined` for blank input.
- `normalizeArray`: accept a string or array, split comma-separated strings, trim entries, and discard empty entries.
- `normalizeState`: accept a recognized full state name or two-letter code; return an empty value for unknown states.
- `generatePartnerId`, `generateReferralCode`, and `generatePartnerSlug`: generate deterministic identity values only for a permitted first-time Join or a trusted caller. Do not regenerate persisted identity on Profile enrichment.

Do not silently coerce arbitrary objects, invalid URLs, unknown state codes, or unrecognized choice IDs into plausible strings.

### 5. Enforce lifecycle rules

For public Join:

- Required identity inputs are `fullName` and a valid normalized `email`.
- Server owns `partnerType = funding_agent`.
- New records begin `approvalStatus = needs_review` and `profileStatus = draft`.
- Set the review reason to the repository's explicit awaiting-review reason.
- Public create-only mode must not mutate an existing identity.

For public Profile enrichment:

- Require a valid email or a trusted canonical `partnerId` according to the caller path.
- Resolve the existing record; do not create an orphan record.
- Public enrichment is allowed only for `needs_review + draft` records.
- Do not approve, publish, suspend, reject, archive, or otherwise alter lifecycle state.
- Do not overwrite `partnerId`, `referralCode`, persisted `slug`, or initial submission time.

For blank-safe updates, treat blank strings, `null`, `undefined`, and empty arrays as absent. Preserve the existing trusted value instead of replacing it with absence.

### 6. Validate the result

Before returning or persisting:

- Confirm required identity fields and validation errors using `lib/validation.ts`.
- Confirm all decoded choice values came from the current form mapping.
- Confirm normalized arrays contain no blank entries.
- Confirm state is a recognized canonical code when supplied.
- Confirm URL fields are normalized and no invented fallback URL was added.
- Confirm public eligibility remains exactly `approvalStatus = approved` and `profileStatus = published`.
- Confirm retrying the same submission preserves deterministic identity and traceability.

Return structured validation errors and the source metadata needed for review. Never hide an unmapped or ambiguous field by guessing.

## Tests to add or update

Keep tests focused in `__tests__/intake-normalizers.test.ts`, `__tests__/tally-webhook.test.ts`, or the relevant intake service test. Cover:

1. UUID and choice-ID decoding for each live form path.
2. Email, URL, array, and state normalization.
3. Missing values staying absent rather than becoming invented values.
4. Join lifecycle defaults and deterministic identity generation.
5. Profile enrichment matching, blank-safe merging, and lifecycle protection.
6. Unknown form IDs, question IDs, or choice IDs producing an explicit error or ignored unmapped field according to the existing parser contract.
7. Duplicate delivery preserving identity and source traceability.

Run the narrow relevant Vitest file first, then the full test suite when mapping or shared normalization behavior changes.

## Completion criteria

The task is complete only when the implementation:

- uses the current executable Tally mapping;
- produces `CanonicalBrokerProfile`-compatible onboarding data or a schema-valid `BrokerProfile` projection;
- preserves missing values and existing trusted data;
- keeps server-owned identity and lifecycle fields protected;
- records form/submission provenance; and
- has focused tests demonstrating the above behavior.
