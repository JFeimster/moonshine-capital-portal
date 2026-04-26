# Onboarding Flow

## Purpose
This document defines the current and recommended onboarding flow for `moonshine-capital-portal`.

The onboarding flow is the intake path for prospective brokers or partners who want to be listed in the public directory. It should stay simple on the front end, operationally clear for internal review, and structured enough to support later automation.

---

## Current Flow Summary

The repo currently includes a public onboarding route:
- `/onboarding`

That route is designed to:
- recruit prospective brokers / partners
- explain the listing process
- embed a Tally intake form
- move applicants into an external review workflow

---

## Current High-Level Flow

```text
Prospective broker visits /onboarding
   ↓
Reads positioning and qualification copy
   ↓
Completes Tally intake form
   ↓
Submission enters internal review workflow
   ↓
If qualified, broker is advanced for profile completion
   ↓
Detailed profile data is collected
   ↓
Approved broker profile is read via Next.js directly or published to Wix CMS (if optional adapter used)
   ↓
Profile appears in the public directory
```

---

## Current Likely Stages

### Stage 1 — Initial intake
**Entry point:** `/onboarding`

**Goal:**
Capture the minimum information needed to determine if the broker should move forward.

**Likely fields:**
- full name
- email
- agency name
- operating state
- website URL
- phone number

This aligns with the current Tally application schema doc.

### Stage 2 — Internal review
**Goal:**
Decide whether the broker should proceed toward a public profile.

**Typical review decisions:**
- pending
- in review
- approved
- rejected

This maps into the Notion CRM workflow.

### Stage 3 — Profile builder / enrichment
**Goal:**
Collect the full data required for the public-facing broker profile.

**Likely fields:**
- short bio
- why choose you
- city
- industries
- funding types
- urgency category
- profile image
- primary CTA label
- primary CTA link

This aligns with the current profile-builder schema doc.

### Stage 4 — Publish to public directory
**Goal:**
Make the broker live on Vercel/Next.js (optionally syncing to a Wix CMS replica).

**Requirements before publish:**
- approved status
- active flag
- usable slug
- at least one valid CTA or contact route

---

## Current Systems Involved

### Front-end
- `app/onboarding/page.tsx`
- `components/TallyEmbedSection.tsx`

### Intake layer
- Tally form submission

### Internal ops layer
- Notion CRM or equivalent review system

### Public publishing layer
- Vercel/Next.js
- `lib/brokers.ts`
- `lib/notion.ts` (future direct sync)
- `lib/wix.ts` (optional)

---

## Recommended Flow Detail

### 1. Prospect discovery
Prospective broker reaches `/onboarding` from:
- website nav
- partner invite
- outbound email
- direct referral

### 2. Intake submission
User submits the short Tally application form.

**Desired outcome:**
Create an internal record with status `Pending`.

### 3. Internal qualification review
Internal team reviews:
- professionalism
- relevancy
- capital specialties
- website / credibility
- fit for directory listing

### 4. Profile builder sent
Qualified broker receives the detailed profile builder form.

### 5. Profile enrichment submitted
Detailed content is captured and mapped into the canonical broker profile data structure.

### 6. Approval + sync
Approved record is marked active in Notion (and optionally synced to Wix CMS) with:
- `approvalStatus = approved`
- `isActive = true`

### 7. Public listing goes live
Broker appears in:
- homepage featured areas if flagged
- `/directory`
- `/directory/[slug]`

---

## Recommended Status Model

A practical status set for onboarding:
- `pending`
- `in_review`
- `approved`
- `rejected`
- `needs_profile_builder`
- `ready_to_publish`
- `published`

These do not all need to be public-facing. Most belong to the internal review workflow.

---

## Recommended Data Handoff Points

### Intake form → CRM
Create the initial broker record.

### CRM → profile builder
Trigger detailed profile collection.

### Profile builder → CRM / publishing layer
Merge enriched data into the canonical broker record.

### Approved record → Public Directory
Record becomes visible through Next.js (or is pushed to Wix CMS if the adapter is running).

---

## Failure / Edge Cases

Handle these gracefully:
- partial or incomplete intake submission
- duplicate email / duplicate broker
- missing slug
- invalid website or CTA link
- approved broker without enough public content
- broken file upload or profile image URL

---

## Recommended Future Automation

### Phase 1
- keep the current Tally → review → publish flow documented
- keep review status explicit in internal systems

### Phase 2
- add `docs/broker-profile-schema.md` only if the Wix schema doc is ever renamed or consolidated
- automate Tally → Notion CRM creation
- automate profile-builder follow-up after approval

### Phase 3
- add `/api/onboarding-submit`
- add webhook handling for intake and enrichment events
- standardize merge rules using email or immutable broker ID

### Phase 4
- support authenticated broker onboarding dashboard
- support editing / updating profile data from a future `/portal`

---

## Recommended Next Steps
- keep `/onboarding` as the single public entry point for new broker applications
- use `docs/TALLY_APPLICATION_SCHEMA.md` and `docs/TALLY_PROFILE_BUILDER_SCHEMA.md` as the schema references
- use `docs/NOTION_BROKER_CRM_SCHEMA.md` for internal review-state planning
- keep the publishing handoff aligned with `docs/WIX_BROKERPROFILE_SCHEMA.md`
