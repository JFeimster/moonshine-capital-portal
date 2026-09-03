# Contract Decisions

This log records intentional cross-system differences so they are not mistaken for accidental drift.

## `specialties` to `fundingSpecialties`

- Canonical field: `specialties`.
- Public projection: `fundingSpecialties`.
- Reason: the public profile model uses the more descriptive name while the Notion and intake contract retain the established CRM field name.
- Requirement: projection code must copy the normalized string array without changing labels or order.

## `agencyName` to `companyName`

- Canonical field: `agencyName`.
- Public compatibility alias: `companyName`.
- Reason: older public consumers use `companyName`.
- Requirement: `companyName` is derived and must never become an identity or merge key.

## Wix `pending` lifecycle value

- Provider value: `pending`.
- Canonical value: `needs_review`.
- Reason: Wix is a downstream compatibility adapter and has a legacy vocabulary.
- Requirement: the adapter may normalize the value, but Wix cannot approve or publish a profile.

## Durable public projection defaults

- Durable Notion records are projected with canonical public eligibility only after the Notion query has applied the approved/published gate.
- The projection may provide UI-safe defaults such as `Funding Advisor`, `standard`, and empty arrays for absent optional profile values.
- These defaults are presentation fallbacks, not claims about the underlying CRM record.

## `title` projection-only field

- Canonical shape: `title` is accepted by `CanonicalBrokerProfile` and `BrokerProfile`.
- Persistence behavior: the current Notion adapter does not write or read a dedicated title property.
- Reason: the public UI can use the safe `Funding Advisor` fallback without requiring a new CRM column.
- Requirement: do not treat the field as a merge key or infer it from the Notion page title. Add an explicit Notion mapping before making it a durable user-entered value.

## `notionPageId` adapter metadata

- Representation: `notionPageId` is returned from the Notion page envelope (`page.id`).
- Reason: it identifies the provider page and is not a user-managed database property.
- Requirement: keep it outside the Notion property map and never expose it as a public identity field.