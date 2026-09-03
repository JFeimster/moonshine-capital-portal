---
description: "Run a full cross-system contract reconciliation for the Moonshine Capital Portal."
name: "Reconcile Full Contract"
agent: "Data Contract Reviewer"
argument-hint: "Optional focus, source system, or suspected drift"
---
Run a full contract reconciliation for this focus: ${input:focus:all contract layers}.

Review the relevant parts of [FIELD_MAPPING_CONTRACT.md](../../docs/FIELD_MAPPING_CONTRACT.md), [data-model.md](../../docs/data-model.md), [contract-decisions.md](../../docs/contract-decisions.md), the TypeScript contracts, the JSON schema, provider adapters, and nearby tests.

Compare Tally intake, Next.js normalization, Notion persistence, Wix compatibility, and public `BrokerProfile`. Use the checked-in fixtures under `data/contract-fixtures/`. Run `node scripts/check-contract-drift.mjs` and any narrower relevant test.

Return the Data Contract Reviewer format. Report confirmed drift before recommendations, distinguish intentional exceptions from defects, redact sensitive values, and do not edit files.
