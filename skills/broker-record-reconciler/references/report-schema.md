# Reconciliation Report Schema

Reports should be deterministic, redacted, and separable into proposal and result. The following JSON shape is the recommended interchange contract:

```json
{
  "runId": "reconcile-2026-09-03T120000Z",
  "mode": "review",
  "generatedAt": "2026-09-03T12:00:00Z",
  "sources": {
    "tally": { "status": "verified", "retrievedAt": "2026-09-03T11:59:00Z" },
    "notion": { "status": "verified", "retrievedAt": "2026-09-03T11:59:10Z" },
    "wix": { "status": "fallback", "retrievedAt": "2026-09-03T11:59:20Z" },
    "local": { "status": "verified", "retrievedAt": "2026-09-03T11:59:30Z" }
  },
  "records": [
    {
      "clusterId": "cluster-001",
      "canonicalPartnerId": "redacted-partner-id",
      "decision": "unchanged",
      "matches": [{ "key": "partnerId", "source": "notion", "recordId": "redacted-page-id" }],
      "fields": [{
        "name": "email",
        "canonical": "redacted@example.com",
        "observed": [{ "source": "tally", "value": "redacted@example.com", "recordId": "redacted-submission" }],
        "decision": "keep",
        "reason": "normalized values agree"
      }],
      "provenance": [{ "source": "notion", "recordId": "redacted-page-id", "observedAt": "2026-09-03T11:59:10Z", "normalizations": ["email-lowercase"] }],
      "lifecycle": { "approvalStatus": "needs_review", "profileStatus": "draft", "public": false },
      "protectedFields": ["partnerId", "referralCode", "slug", "approvalStatus", "profileStatus"],
      "conflicts": []
    }
  ],
  "writes": { "attempted": 0, "completed": 0 },
  "exceptions": []
}
```

## Requirements

- `mode` is `review`, `dry-run`, or `apply`.
- Source status is `verified`, `stale`, `fallback`, `unavailable`, or `not-requested`.
- Each field decision includes canonical value, observed source values, decision, and reason.
- Apply reports add adapter response IDs, changed fields, verification time, and residual exceptions separately from the proposal.
- Redact secrets and unnecessary personal data. Do not include raw webhook payloads in ordinary reports.
