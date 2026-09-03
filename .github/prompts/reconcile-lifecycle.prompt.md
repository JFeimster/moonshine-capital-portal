---
description: "Audit approval, publication, active, broker, and legacy lifecycle values across all partner data boundaries."
name: "Reconcile Lifecycle"
agent: "Data Contract Reviewer"
argument-hint: "Lifecycle transition, route, provider, or fixture to audit"
---
Audit this lifecycle concern: ${input:concern:approval and publication eligibility}.

Check the canonical enums in `lib/partner-contract.ts`, public gates in `lib/status-gating.ts` and `lib/brokers.ts`, Tally intake behavior, Notion persistence, Wix normalization, the JSON schema, and related tests. Use `needs-review-draft.json`, `approved-published.json`, and `wix-lifecycle-conflict.json` when relevant.

Verify that only `approved + published` records reach durable public projection, that enrichment cannot approve or publish, and that Wix legacy values cannot promote a record. Run `node scripts/check-contract-drift.mjs` plus the narrowest lifecycle test.

Return severity-ordered findings, explicit transition invariants, validation results, and unresolved decisions. Do not weaken gates or edit files during review.
