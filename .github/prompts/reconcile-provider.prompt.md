---
description: "Review one provider boundary for field mapping, normalization, fallback, identity, and lifecycle drift."
name: "Reconcile Provider Boundary"
agent: "Data Contract Reviewer"
argument-hint: "Provider and boundary, such as Tally to Notion or Wix to BrokerProfile"
---
Review this provider boundary: ${input:boundary:Tally to Next.js, Next.js to Notion, or Wix to BrokerProfile}.

Implementation changes allowed: ${input:changes:no, review only}.
Validation scope: ${input:validation:narrowest relevant check}.

Compare the provider shape with the canonical contract and public projection. Check field names and types, aliases, requiredness, blank handling, URL and array normalization, identity matching, lifecycle translation, fallback behavior, stale data, and sensitive-data exposure. Read [FIELD_MAPPING_CONTRACT.md](../../docs/FIELD_MAPPING_CONTRACT.md), [data-model.md](../../docs/data-model.md), and [contract-decisions.md](../../docs/contract-decisions.md).

Use a redacted fixture when one applies. Run the requested validation scope, never call live provider APIs without explicit permission, and return the standard reviewer findings with concrete file references.
