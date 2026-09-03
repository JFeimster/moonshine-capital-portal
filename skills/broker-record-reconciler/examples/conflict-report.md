# Conflict Report Example

This fictional run stops because trusted identifiers point to different canonical partners.

```text
Run: reconcile-2026-09-03T121500Z
Mode: dry-run
Sources: Tally=verified, Notion=verified, Wix=verified, local=verified

Record unresolved-cluster-042
- Match: Notion page-042 matched partnerId=partner-042; Tally submission-042 supplied partnerId=partner-042 and email=redacted@example.test; Wix wix-042 matched email but reported partnerId=partner-099
- Decision: conflict
- Fields:
  - partnerId: canonical=partner-042; observed=Wix:partner-099; decision=conflict; reason=immutable identity disagreement
  - email: canonical=redacted@example.test; observed=Tally:redacted@example.test, Wix:redacted@example.test; decision=keep; reason=normalized values agree but cannot resolve the partner ID conflict
- Provenance: Notion page-042, Tally submission-042, Wix wix-042, retrieved 2026-09-03T12:14:00Z
- Lifecycle: canonical approval=approved, profile=published, public=yes; proposed merge blocked
- Protected fields: partnerId, referralCode, slug, approvalStatus, profileStatus
- Conflicts: identity and immutable-field; human review required

Writes: 0 attempted. No records were changed.
```

Do not merge the Wix record, change either partner ID, or archive either record until an operator resolves the identity conflict.
