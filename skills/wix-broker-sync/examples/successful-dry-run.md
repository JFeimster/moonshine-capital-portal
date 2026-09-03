# Successful Dry Run

```text
Run: wix-sync-2026-09-03-001
Mode: dry-run
Scope: partner-101 / alex-rivera
Canonical source: verified
Wix source: live

Record: partner-101 / alex-rivera
- Decision: create proposed
- Eligibility: approval=approved; profile=published; public=yes
- Identity: canonical=partner-101; Wix=not found; match keys=slug
- Payload/delta:
  - title: Alex Rivera; decision=create; reason=required Wix title
  - fullName: Alex Rivera; decision=create; reason=canonical profile
  - publicEmail: alex@example.test; decision=create; reason=normalized email
  - agencyName: Rivera Capital; decision=create; reason=canonical profile
  - state: TX; decision=create; reason=normalized state
  - isActive: true; decision=create; reason=both lifecycle gates pass
- Protected fields: partnerId=partner-101; slug=alex-rivera
- Unmapped canonical fields: partnerId
- Conflicts/warnings: none
- Verification: not run; dry run produced zero writes
```
