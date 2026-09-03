---
name: wix-broker-sync
description: "Validate and synchronize approved broker profiles from the canonical Moonshine Capital Portal records to the Wix brokerProfiles CMS collection. Use for Wix broker publishing, approved profile sync, CMS field mapping, Wix data validation, dry runs, or post-sync verification."
argument-hint: "Specify the broker record(s), review or dry-run mode, and whether an authorized Wix write is available."
---

# Wix Broker Sync

Validate canonical broker profiles and project them to Wix CMS without making Wix the source of truth. Notion is the operational source of truth; Wix is an optional downstream publishing/read replica.

## When to use

- Validate whether approved broker profiles are ready for Wix.
- Produce a deterministic Wix payload or dry-run report.
- Apply an explicitly authorized Wix CMS synchronization through an available write adapter or connector.
- Re-fetch and verify records after an authorized sync.
- Diagnose field-mapping, lifecycle, identity, URL, or stale-record issues between canonical data and Wix.

## Repository contracts

Before operating, confirm the repository is `moonshine-capital-portal` and read:

- `docs/FIELD_MAPPING_CONTRACT.md` for canonical identity, lifecycle, normalization, and field authority.
- `docs/WIX_BROKERPROFILE_SCHEMA.md` for Wix collection field keys and types.
- `docs/wix-integration.md` for the integration boundary and fallback behavior.
- `lib/partner-contract.ts` for executable lifecycle and field classifications.
- `lib/field-mapping.ts` for the canonical profile shape.
- `lib/wix.ts` to determine the currently available Wix transport.
- `lib/notion.ts` or the current Notion adapter for canonical record reads.

Do not infer field names from a CMS response or invent credentials. If a contract or adapter is unavailable, report the gap and stop before mutation.

## Current adapter boundary

The repository's current `lib/wix.ts` adapter is read-only. It fetches `brokerProfiles` and falls back to local mock data when Wix configuration or the request is unavailable. It does not provide a write operation. Therefore:

- Review and dry-run modes are always valid when canonical input is available.
- Apply mode requires an explicitly available, authorized Wix write connector or a repository write adapter.
- Never claim that a sync was applied by calling the read-only fetch functions.
- Never write directly to Notion as a substitute for Wix synchronization.
- Treat mock or fallback data as unavailable Wix evidence, not as a successful CMS sync.

## Resources

Use these bundled resources when evaluating or explaining a synchronization run:

- [Evaluation validator](./scripts/validate-wix-sync-evals.mjs) to check fixture completeness and enforce zero-write dry-run expectations.
- [Synthetic evaluation cases](./evals/wix-sync-cases.json) for eligibility, identity, normalization, availability, unmapped fields, and verification behavior.
- [Successful dry-run example](./examples/successful-dry-run.md) for a create proposal with zero writes.
- [Blocked profile example](./examples/blocked-profile.md) for lifecycle-gate refusal.
- [Authorized apply example](./examples/authorized-apply-verification.md) for separate apply and live re-fetch verification reporting.

## Eligibility gates

A profile may be proposed for public Wix synchronization only when both canonical gates pass:

```text
approvalStatus = approved
AND
profileStatus = published
```

A record with `approved` but `draft`, `hidden`, or `archived` profile status is not eligible. A record with `needs_review`, `suspended`, or `rejected` approval status is not eligible. Wix `pending` is a legacy compatibility value and never authorizes publication.

Also block or flag a record when:

- `partnerId` or `slug` is missing from a record that should already be persisted.
- Immutable identity fields disagree with the existing Wix record.
- The slug is not stable or is already claimed by another partner.
- Required Wix fields are missing: `fullName`, `agencyName`, `slug`, `shortBio`, `whyChooseYou`, `city`, `state`, and public contact email.
- A URL is unsafe, malformed, or not an absolute HTTP(S) URL after normalization.
- An image uses an unsupported or private scheme such as `wix:image://` in a field expected by the application adapter.
- Canonical data is stale, unavailable, partial in a way that would erase trusted Wix content, or sourced only from a local fallback.

Report blocked records; do not silently omit them from a batch.

## Canonical-to-Wix mapping

Build the payload from the canonical record and use these Wix field keys:

| Canonical field | Wix field | Rule |
| --- | --- | --- |
| `fullName` | `title`, `fullName` | Set both when the Wix title field is required. |
| `email` | `publicEmail` | Normalize trimmed lowercase; expose only the intended public contact value. |
| `agencyName` | `agencyName` | Preserve the canonical value. |
| `slug` | `slug` | Immutable stable URL key; conflict blocks the sync. |
| `shortBio` | `shortBio` | Preserve non-blank canonical text. |
| `whyChooseYou` | `whyChooseYou` | Preserve non-blank canonical text. |
| `city` | `city` | Normalize using the repository rules. |
| `state` | `state` | Normalize to a supported two-letter U.S. code. |
| `websiteUrl` | `websiteUrl` | Normalize to a safe absolute URL. |
| `phoneNumber` | `phoneNumber` | Preserve only if present and validated. |
| `industries` | `industries` | Trim, remove blanks, and preserve canonical array order. |
| `fundingTypes` | `fundingTypes` | Trim, remove blanks, and preserve canonical array order. |
| `urgencyCategory` | `urgencyCategory` | Use the canonical category; do not invent one. |
| `profileImage` | `profileImage` | Use only a browser-safe supported image value. |
| `primaryCtaLabel` | `primaryCtaLabel` | Preserve the canonical label. |
| `primaryCtaLink` | `primaryCtaLink` | Normalize and validate before writing. |
| `approvalStatus` | `approvalStatus` | Write `approved` for an eligible record; do not write legacy `pending`. |
| eligibility result | `isActive` | Set `true` only after both canonical lifecycle gates pass. |
| `featuredFlag` if explicitly modeled | `featuredFlag` | Do not infer or promote featured status during sync. |
| broker operating state if explicitly modeled | `brokerStatus` | Do not use this field to override canonical approval or profile status. |

The following canonical values have no current Wix collection field in the documented schema: `partnerId`, `referralCode`, `displayName`, `title` as a distinct profile field, `specialties`, `markets`, `logoUrl`, `bookingUrl`, `disclosures`, review fields, and traceability metadata. Report these as unmapped fields and retain them in the canonical source; never concatenate them into an unrelated public field without an explicit contract change.

## Modes

Use the least invasive mode that satisfies the request:

- **Review:** inspect canonical records, Wix availability/schema, eligibility, identity matches, unmapped fields, and conflicts. Make no changes.
- **Dry run:** produce the exact normalized Wix payload and field-level create/update delta. Make no changes. Default when the user has not explicitly authorized a write.
- **Apply:** write only the named records through the available authorized Wix adapter or connector, then re-fetch every affected record and verify the result.

A multi-record apply requires a completed dry run and explicit authorization for the listed scope. An authorization to approve or publish in Notion is not automatically authorization to write Wix.

## Procedure

1. **Scope the run.** Record the requested broker identifiers, mode, source snapshot, Wix collection, and write authorization. Use `partnerId` first; use a stable `slug` or normalized email only to locate a canonical record.
2. **Load contracts.** Read the repository documents and adapter files listed above before fetching records.
3. **Read canonical data.** Read approved canonical records from Notion or the current canonical application service. Do not use Wix or local mock data as the canonical input.
4. **Check identity.** Match an existing Wix record by `partnerId` if the collection supports it, otherwise by stable `slug` and then normalized public email. If identifiers point to different records, classify an identity conflict and stop that record.
5. **Normalize.** Apply repository normalization for email, state, URL, arrays, text, and image values. Preserve raw values in the report and never use blank incoming values to erase trusted values.
6. **Validate eligibility.** Apply both lifecycle gates and the required-field, uniqueness, URL, image, and freshness checks. A failed gate produces `blocked`, not an empty or partially active Wix record.
7. **Build the dry-run delta.** Compare the normalized canonical projection with the existing Wix record. Identify create, update, unchanged, blocked, unmapped, and conflict outcomes. Protect immutable identity and lifecycle fields.
8. **Show the proposal.** Present the exact Wix field payload, changed fields, unchanged protected fields, unmapped canonical fields, source provenance, and any warnings. State that no writes occurred.
9. **Apply only when authorized.** Use the existing write adapter or authorized Wix connector. Do not bypass validation, lifecycle checks, URL sanitization, or the `/out` attribution flow. Do not delete or archive an existing Wix record automatically because canonical data is missing.
10. **Verify.** Re-fetch each changed Wix record using the adapter, compare all mapped fields, confirm `approvalStatus = approved` and `isActive = true`, verify slug and identity, and record the verification timestamp. If the read is fallback or unavailable, report verification as incomplete.
11. **Report exceptions.** Separate completed writes from failed, blocked, stale, unavailable, fallback, unmapped, and conflicting records. Never call a record published unless the canonical gates and a live Wix re-fetch both verify it.

## Required report shape

```text
Run: <id and timestamp>
Mode: review | dry-run | apply
Scope: <partner IDs/slugs or batch description>
Canonical source: verified | unavailable | stale | fallback
Wix source: live | unavailable | fallback

Record: <partnerId and slug, or unresolved identifier>
- Decision: unchanged | create proposed | update proposed | applied | blocked | conflict | unavailable
- Eligibility: approval=<...>; profile=<...>; public=<yes/no>
- Identity: canonical=<...>; Wix=<...>; match keys=<...>
- Payload/delta:
  - <wixField>: <normalized value>; decision=<create/update/keep>; reason=<...>
- Protected fields: <immutable identity and lifecycle values>
- Unmapped canonical fields: <fields retained outside Wix>
- Conflicts/warnings: <category and explanation>
- Verification: <status and timestamp>
```

For apply mode, report the proposal and actual result separately. Include adapter response IDs only when needed for audit, and redact secrets and unnecessary personal data.

## Safety and attribution

- Keep Wix API keys, bearer tokens, webhook secrets, and raw sensitive contact data out of output.
- Keep `partnerId`, `referralCode`, and supported attribution parameters intact in canonical records and CTA destinations.
- Do not replace an attributed `/out` route with an untracked URL merely because Wix has a direct CTA field.
- Keep review reasons, internal statuses, source IDs, and Notion metadata out of public Wix fields.
- Do not approve, publish, contact, delete, or merge a broker as a side effect of synchronization.

## Completion checks

The operation is complete only when:

- Every requested record is classified as eligible, blocked, conflict, unavailable, or processed.
- Every mapped Wix field has a normalization and provenance decision.
- Unmapped canonical fields are explicitly reported and preserved in the canonical source.
- No unauthorized write occurred.
- Every authorized write has a live re-fetch verification, or is explicitly marked unverifiable.
- Immutable identity and canonical lifecycle values remain protected.
- Relevant tests pass, especially `__tests__/fetchWixBrokers.test.ts`, `__tests__/fetchWixBrokerBySlug.test.ts`, `__tests__/partner-contract.test.ts`, and the applicable data-validation tests. For implementation changes, run the narrow test first, then `pnpm typecheck`, and broaden to `pnpm test` when shared adapters or contracts change.
