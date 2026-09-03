# Dry-Run Example

This fictional run proposes a profile update without writing to any source.

```text
Run: reconcile-2026-09-03T120000Z
Mode: dry-run
Sources: Tally=verified, Notion=verified, Wix=verified, local=not-requested

Record partner-017
- Match: partnerId matched Notion page-017; email matched Tally submission-017
- Decision: update proposed
- Fields:
  - shortBio: canonical="Equipment finance advisor"; observed=Tally:"Equipment and invoice finance advisor"; decision=propose; reason=Tally contains a newer non-empty profile value
  - websiteUrl: canonical="https://example.test"; observed=Tally:"https://example.test"; decision=keep; reason=normalized values agree
- Provenance: Notion page-017 at 2026-09-03T11:59:10Z; Tally submission-017 at 2026-09-03T11:59:00Z; URL normalized to absolute form
- Lifecycle: approval=needs_review, profile=draft, public=no
- Protected fields: partnerId, referralCode, slug, approvalStatus, profileStatus
- Conflicts: none

Writes: 0 attempted. No records were changed.
```

The proposed bio still requires explicit authorization before an apply operation. The draft record is not publicly eligible because it is not approved and published.
