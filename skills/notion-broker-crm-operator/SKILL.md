---
name: notion-broker-crm-operator
description: "Review, reconcile, and explicitly operate Moonshine Capital Portal's Notion broker CRM. Use for partner records, intake handling, and publishing-state work; not generic Notion tasks."
---

# Notion Broker CRM Operator

Use this skill for the **Moonshine Capital Partners CRM** in the `moonshine-capital-portal` project. It supports evidence-based record review, reconciliation, and explicitly authorized CRM changes. It is not for generic Notion documentation, research, or unrelated databases.

## Establish the contract

Before reviewing or changing CRM data, confirm the checkout is `moonshine-capital-portal` and read these project documents:

- `docs/NOTION_BROKER_CRM_SCHEMA.md`
- `docs/FIELD_MAPPING_CONTRACT.md`
- `docs/SECURITY_MODEL.md`

If a required contract is absent, stale, or conflicts with the live database schema, report the mismatch and do not guess field mappings or lifecycle behavior.

## Choose the narrowest operation

Start in the least invasive mode that satisfies the request:

- **Review:** inspect schema or records; summarize completeness, status, duplicates, and exceptions. Make no changes.
- **Dry run:** state the exact proposed match, field-level changes, lifecycle effects, and conflicts. Make no changes.
- **Mutation:** create or update only after the user expressly authorizes the specific change. Re-read the affected record afterward and report the result.

Do not contact brokers, publish records, create new external integrations, or change CRM records merely because a record appears incomplete or overdue.

## Identity and reconciliation

Use the canonical match order:

1. `partnerId`
2. latest Tally submission ID
3. normalized email
4. create a new canonical partner only when an authorized intake operation has no match

Treat name, company, public slug inputs, and Notion page ID as non-canonical identifiers. Preserve a persisted `partnerId`, `referralCode`, and `slug` during routine retry and profile-enrichment work.

When a primary key matches but a supplied secondary key resolves to a different canonical partner, stop and present a conflict. Do not merge, overwrite, or choose a winner silently. For first-time concurrent duplicate creation, follow the repository contract: retain the earliest canonical page and flag later same-identity pages for human review and archival rather than deleting them.

Profile enrichment is update-only. If no existing canonical partner matches, return not found instead of creating an orphan profile.

## Field and lifecycle rules

- Normalize email to trimmed lowercase, supported U.S. states to two-letter codes, URLs to safe absolute URLs, and Notion comma-separated values back to arrays at the adapter boundary.
- Keep partial enrichment blank-safe: an empty incoming value must not erase an existing trusted value.
- Keep approval and publication separate. A partner is eligible for public display only when `approvalStatus = approved` and `profileStatus = published`.
- Routine retries must not override operator-imposed `suspended`, `rejected`, `hidden`, or `archived` states, and must not downgrade a complete approved/published record because of a partial payload.
- Keep public display data separate from internal review reasons, lifecycle fields, and traceability metadata.

## Write safeguards

For an authorized write, first show or determine the target record and intended field-level delta. Use the available Notion connector or project adapter; do not bypass validation or write directly to an unrelated store.

Before a publish-related change, verify the public minimums defined by the project contract and confirm that no unsafe URL or internal-only value will be exposed. Preserve `partner_id`, `referral_code`, and supported attribution parameters in the established `/out` tracking flow; do not introduce a parallel attribution system.

After a write, re-fetch the record and report: canonical identity, changed fields, unchanged protected fields, resulting approval/profile statuses, and any remaining review reason or conflict. Never claim a public listing is live unless the actual public source and status gate verify it.

## Reporting

Distinguish verified record values, incoming values, normalized values, proposed changes, completed changes, and unavailable data. Include record/page identifiers only to the degree needed for the user to audit the operation, and do not expose secrets or internal-only data in public-facing output.
