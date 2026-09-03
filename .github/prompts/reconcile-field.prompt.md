---
description: "Trace one field or field group across intake, persistence, adapters, schema, and public projection."
name: "Reconcile Field"
agent: "Data Contract Reviewer"
argument-hint: "Field or group, source system, and expected output"
---
Reconcile this field or field group: ${input:field:enter a field such as specialties, slug, or lifecycle}.

Source system or boundary to emphasize: ${input:source:all boundaries}.
Expected output: ${input:output:findings and a compact field matrix}.

Trace the value through Tally, normalization, Notion, Wix, JSON Schema, `CanonicalBrokerProfile`, `BrokerProfile`, and the public projection where applicable. Check aliases, requiredness, nullability, normalization, persistence loss, and projection loss. Consult [FIELD_MAPPING_CONTRACT.md](../../docs/FIELD_MAPPING_CONTRACT.md) and [contract-decisions.md](../../docs/contract-decisions.md).

Run the narrowest relevant validation. Return current behavior, expected contract, smallest correction, regression test, and documentation impact. Do not edit files unless explicitly requested.
