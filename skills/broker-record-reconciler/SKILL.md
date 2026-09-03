---
name: broker-record-reconciler
description: "Reconcile broker records across Tally, Notion, Wix, and local repository data with canonical identity matching, field-level provenance, conflict reporting, lifecycle safeguards, and dry-run output. Use for broker data audits, duplicate detection, cross-system sync planning, CRM reconciliation, import reviews, or authorized record updates."
argument-hint: "Describe the broker records or sources to reconcile and whether to review, dry-run, or apply an authorized change."
---

# Broker Record Reconciler

Reconcile Funding Agent broker records across Tally, the Notion Partners CRM, Wix, and local repository data without silently choosing winners or overwriting trusted values. Produce an auditable report first; mutate external data only when the user explicitly authorizes the exact operation.

## Repository contract

Before operating, confirm this is `moonshine-capital-portal` and read the applicable contracts:

- `docs/FIELD_MAPPING_CONTRACT.md`
- `docs/NOTION_BROKER_CRM_SCHEMA.md`
- `docs/SECURITY_MODEL.md`
- `lib/partner-contract.ts` for field classification and lifecycle behavior
- `lib/field-mapping.ts` for the canonical profile shape
- `lib/tally-webhook.ts` and `lib/intake-normalizers.ts` for Tally mappings
- `lib/notion.ts` or the current Notion adapter for CRM reads and writes
- `lib/wix.ts` for Wix's compatibility projection and fallback behavior

Use `skills/tally-intake-normalizer/SKILL.md` for raw Tally decoding and `skills/notion-broker-crm-operator/SKILL.md` for authorized CRM operations. Do not treat Wix or local mock data as a replacement for the canonical contract.

If a required contract, adapter, environment variable, or source snapshot is unavailable, report the gap and continue only with a clearly bounded comparison. Never guess field names, credentials, records, or endpoint behavior.

## Recommended bundled resources

Keep the skill self-contained and load resources progressively. Add a resource only when it has a concrete consumer in this workflow, and link it from this file so an agent can discover it.

### `references/`

Recommended for stable guidance that is too detailed for this file:

- `references/source-precedence.md` for the authority and freshness rules for Tally, Notion, Wix, and local data.
- `references/conflict-resolution.md` for conflict categories, escalation rules, and examples of non-silent decisions.
- `references/report-schema.md` for the machine-readable dry-run and apply-report contract.

References should explain policy and contracts, not duplicate live application code. Point back to the repository source of truth when a rule is executable or likely to change.

### `scripts/`

Add scripts only when the repository has a stable input and output contract. Useful candidates are:

- `scripts/normalize-records.mjs` for deterministic normalization while retaining raw values.
- `scripts/render-dry-run.mjs` for stable, redacted report output.
- `scripts/diff-reconciliation.mjs` for comparing two report snapshots.

Scripts must default to read-only behavior, accept explicit input paths or flags, avoid credentials in arguments and output, and exit nonzero on malformed input or unresolved safety conditions. Do not create a script that calls live mutation APIs unless the authorization and adapter safeguards are explicit.

### `evals/`

Recommended for regression cases that test the skill's judgment rather than application implementation. Store synthetic, redacted fixtures such as:

- one canonical record matching all four sources;
- mismatched `partnerId` and email resolving to different partners;
- duplicate Notion pages with deterministic earliest-record selection;
- blank-safe enrichment and immutable-field disagreement;
- lifecycle conflicts involving `approved`, `published`, `suspended`, or `archived`;
- unavailable, stale, or Wix-fallback source data;
- a dry run proving that no mutation is attempted.

Each evaluation should define inputs, expected match or conflict category, expected proposed delta, protected fields, and whether writes must remain zero. Never use real broker PII or secrets in evaluation data.

### `examples/`

Recommended for short operator-facing examples that make the output contract easy to follow:

- `examples/review-report.md` for a no-change audit;
- `examples/dry-run-report.md` for field-level proposals and provenance;
- `examples/conflict-report.md` for an identity or lifecycle conflict;
- `examples/apply-verification.md` for a separately reported authorized write and re-fetch result.

Examples should use fictional values, show redaction where appropriate, and demonstrate both successful reconciliation and safe refusal. Keep them illustrative; the live contracts and adapter behavior remain authoritative.

## Modes

Choose the least invasive mode that satisfies the request:

- **Review:** read available sources and report matches, missing records, duplicates, provenance, conflicts, and lifecycle inconsistencies. Make no changes.
- **Dry run:** calculate the exact proposed merge and field-level delta, including records that would be created, updated, archived, or left unchanged. Make no changes.
- **Apply:** perform only the expressly authorized changes through the existing adapter and validation path, then re-fetch and verify every affected record.

Default to review when the requested mode is ambiguous. A dry run is required before a multi-record or cross-system write. Do not publish, approve, archive, delete, contact, or merge records merely because reconciliation finds a discrepancy.

## Source roles and precedence

Treat the sources according to their role, not just recency:

1. **Notion:** durable operational source of truth for canonical identity, lifecycle, traceability, and persisted broker fields.
2. **Tally:** source evidence for submissions and intake provenance. Raw submissions must be decoded using live UUID and choice mappings.
3. **Wix:** optional downstream compatibility or publishing projection. It may expose legacy values such as `pending`, but it does not define canonical lifecycle state.
4. **Local repository data:** code fixtures, mock brokers, cached exports, or local snapshots used for comparison and regression checks. It is not authoritative unless a contract explicitly says so.

For each field, record the selected value, every observed value, source, source record identifier, observed timestamp when available, normalization applied, and selection reason. Recency alone must not override immutable identity, operator lifecycle state, or a more authoritative source.

## Identity matching

Normalize matching inputs at the adapter boundary:

- email: trim and lowercase;
- state: canonical two-letter code;
- URLs: safe absolute URL with a scheme and one trailing slash removed;
- arrays: trimmed, blank-free canonical arrays;
- Tally choice values: decode from the current form mapping, never from labels alone when UUIDs are available.

Match in this order:

1. trusted `partnerId`;
2. `latestTallySubmissionId` or known Tally submission ID;
3. normalized email;
4. no match, which may become a new canonical record only in an explicitly authorized create operation.

Cross-check secondary identifiers. If one identifier resolves to one canonical partner and another resolves to a different partner, classify the result as an identity conflict and stop that record from being merged. Name, company, slug, Wix `_id`, Notion page ID, and local array position are supporting evidence only, not canonical identity keys.

For concurrent same-identity Notion duplicates, follow the contract: retain the earliest canonical page and flag later pages for human review and archival. Never delete a duplicate automatically.

## Field merge rules

Classify each field before proposing a value:

- **Immutable identity:** `partnerId`, `referralCode`, `slug`. Preserve the existing canonical value; any disagreement is a conflict.
- **Merge keys:** normalized `email`, latest Tally submission ID. Use for matching and traceability; do not casually replace a canonical identity.
- **Lifecycle/internal:** `approvalStatus`, `profileStatus`, `reviewReason`. Preserve operator-imposed states such as `suspended`, `rejected`, `hidden`, and `archived` during routine reconciliation.
- **Public profile:** names, company, contact, location, bio, services, images, disclosures, and CTA fields. Prefer verified canonical Notion values; propose incoming changes only with field-level evidence.
- **Traceability:** `sourceForm`, `tallyFormId`, submission timestamps, `updatedAt`, and `notionPageId`. Add evidence without erasing earlier provenance.

Blank, null, undefined, and empty incoming values are absent and must not erase a trusted value. Do not invent fallback names, agencies, states, URLs, statuses, consent, biographies, categories, or timestamps.

A record is publicly eligible only when `approvalStatus = approved` and `profileStatus = published`. A Wix `pending` value normalizes to `needs_review`; it does not authorize approval. Keep internal review reasons and source identifiers out of public profile output.

## Conflict taxonomy

Report conflicts explicitly and assign one category:

- `identity`: identifiers point to different canonical partners;
- `immutable-field`: partner ID, referral code, or slug disagrees;
- `lifecycle`: systems disagree about approval/publication or an update would override an operator state;
- `value`: non-empty normalized field values disagree;
- `provenance`: timestamps, form IDs, or submission IDs cannot be reconciled;
- `duplicate`: multiple records resolve to the same canonical identity;
- `availability`: a source is missing, stale, unreachable, or only represented by a local fallback.

Do not resolve an identity, immutable-field, lifecycle, or duplicate conflict silently. For ordinary profile value conflicts, show all values and the proposed winner with the reason; require authorization when the change is not an obvious blank-safe normalization.

## Procedure

1. **Scope the run.** List sources, record filters, time window, requested mode, and whether the user authorized writes.
2. **Load contracts.** Read the mapping and lifecycle rules before reading or writing records.
3. **Fetch evidence.** Capture source records with stable IDs and retrieval timestamps. Distinguish live data from fixtures, cached data, fallback responses, and unavailable sources.
4. **Normalize.** Apply repository normalizers without fabricating values. Preserve raw values alongside normalized values for auditability.
5. **Cluster identities.** Apply the canonical match order and cross-check secondary identifiers. Split ambiguous clusters into conflicts.
6. **Build field decisions.** For every cluster, compare canonical fields, classify differences, select a value only when rules support it, and attach provenance.
7. **Render dry-run output.** Show proposed creates, updates, unchanged protected fields, lifecycle impact, conflicts, unavailable sources, and confidence or evidence notes. State explicitly that no writes occurred.
8. **Apply only if authorized.** Use existing adapters, validation, and tracking contracts. Never write directly to a different store or bypass lifecycle guards.
9. **Verify.** Re-fetch changed records, compare them with the proposed delta, confirm immutable fields and lifecycle states, and report any residual conflicts or partial failures.

## Required report shape

Use a stable report that can be reviewed or diffed:

```text
Run: <id and timestamp>
Mode: review | dry-run | apply
Sources: Tally=<status>, Notion=<status>, Wix=<status>, local=<status>

Record <canonical identity or unresolved cluster>
- Match: <keys and source record IDs>
- Decision: unchanged | update proposed | created proposed | conflict | unavailable
- Fields:
  - <field>: canonical=<value>; observed=<source:value>; decision=<keep/propose/conflict>; reason=<...>
- Provenance: <source, record ID, timestamp, normalization>
- Lifecycle: approval=<...>, profile=<...>, public=<yes/no>
- Protected fields: <unchanged identity/lifecycle fields>
- Conflicts: <category and explanation>
```

For apply mode, append the actual result separately from the proposal: changed fields, unchanged protected fields, resulting statuses, adapter response IDs, verification timestamp, and remaining exceptions. Never report a record as published unless the canonical source and both status gates verify it.

## Safety and privacy

Keep API keys, webhook secrets, tokens, raw personal data, and unnecessary contact details out of reports and logs. Redact sensitive values while retaining enough identity evidence for an operator to audit the match. Do not expose internal Notion IDs, review reasons, or provenance metadata in public-facing output.

## Tests and completion

For implementation changes, add focused tests near the affected behavior, especially in `__tests__/partner-identity.test.ts`, `__tests__/partner-contract.test.ts`, `__tests__/notion-persistence.test.ts`, `__tests__/fetchWixBrokers.test.ts`, or the relevant adapter test. Cover:

1. canonical identity matching and mismatched secondary keys;
2. normalization with raw-value and provenance preservation;
3. blank-safe field merging;
4. lifecycle and immutable-field protection;
5. duplicate detection and deterministic earliest-record handling;
6. dry-run output with no mutation;
7. unavailable source and partial-failure reporting;
8. post-write re-fetch verification for authorized changes.

Run the narrow relevant test first, then `pnpm typecheck`, and broaden to `pnpm test` or `pnpm check` when shared contracts or adapters change.

The reconciliation is complete only when every source is labeled as verified, unavailable, stale, or fallback; every matched field has provenance; every conflict is explicit; dry-run output is deterministic; no unauthorized write occurred; and any authorized write was re-fetched and verified.
