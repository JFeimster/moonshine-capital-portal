# Source Precedence

Use source role and contract authority before recency when reconciling broker records.

| Source | Role | Preferred fields | Limits |
| --- | --- | --- | --- |
| Notion Partners CRM | Durable operational source of truth | Canonical identity, lifecycle, persisted profile, traceability | Must be read and written through the project adapter |
| Tally | Intake evidence and submission provenance | Form ID, submission ID, submitted profile values, timestamps | Decode raw payloads with live UUID and choice mappings; cannot self-approve or publish |
| Wix | Optional downstream compatibility or publishing projection | Public projection and compatibility fields | Does not define canonical lifecycle; normalize `pending` to `needs_review` |
| Local repository data | Fixtures, mocks, exports, or snapshots for comparison | Regression and gap detection | Not authoritative unless a project contract explicitly says so |

## Selection rules

1. Establish the Notion record and canonical `partnerId` when available.
2. Use Tally to explain intake provenance and propose missing or newer profile evidence.
3. Compare Wix and local values against the canonical record; do not promote them solely because they are newer.
4. Preserve operator-imposed lifecycle states and immutable identity fields.
5. Record every observed value, source record ID, retrieval time, normalization, and selection reason.

Missing, stale, fallback, or unreachable sources are availability findings, not permission to guess or overwrite. A source snapshot must be labeled with its retrieval timestamp and whether it was live, cached, fixture, or fallback data.
