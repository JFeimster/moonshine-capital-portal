# Conflict Resolution

Never silently choose a winner when identity, immutable identity, lifecycle, or duplicate evidence conflicts.

## Conflict categories

- `identity`: trusted identifiers resolve to different canonical partners.
- `immutable-field`: `partnerId`, `referralCode`, or `slug` differs.
- `lifecycle`: approval or profile status differs, or a proposal would override an operator state.
- `value`: non-empty normalized profile values differ.
- `provenance`: submission IDs, form IDs, or timestamps cannot be reconciled.
- `duplicate`: multiple records resolve to one canonical identity.
- `availability`: a source is missing, stale, unreachable, or only available through fallback data.

## Decision rules

1. Stop the affected merge for `identity`, `immutable-field`, and unresolved `duplicate` conflicts.
2. Preserve Notion lifecycle values, especially `suspended`, `rejected`, `hidden`, and `archived`, during routine reconciliation.
3. Keep the earliest canonical Notion page when concurrent same-identity duplicates exist; flag later pages for human review and archival. Do not delete automatically.
4. For ordinary `value` conflicts, show all normalized values and propose a winner using source authority and evidence quality. Require authorization for a non-trivial change.
5. Treat blank, null, undefined, and empty incoming values as absent. They cannot erase trusted data.
6. Treat Wix `pending` as compatibility input for `needs_review`, never as approval.

Every conflict report must include the category, affected record IDs, raw and normalized values where safe, proposed action, protected fields, and the reason no automatic merge occurred.
