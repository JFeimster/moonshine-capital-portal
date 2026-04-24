# Admin / Portal Plan

## Purpose
This document outlines the future plan for authenticated portal and admin surfaces in `moonshine-capital-portal`.

Today, the repo is primarily a public directory and onboarding experience. This file defines how it can evolve into a more operational system without losing its current role.

---

## Current State

The portal currently provides:
- homepage positioning
- public broker directory
- broker profile pages
- onboarding intake
- tracked outbound redirects
- legal pages

What it does **not** yet provide:
- authenticated broker dashboard
- internal approval dashboard
- editing surface for broker profiles
- structured admin review console

---

## Product Direction

There are really two future authenticated surfaces to think about:

### 1. Broker / Partner Portal
This is the broker-facing experience.

Potential capabilities:
- profile status view
- profile editing requests
- onboarding completion progress
- CTA destination management
- contact / listing update submission
- future performance summaries

### 2. Internal Admin Portal
This is the ops / internal team experience.

Potential capabilities:
- application review queue
- approval / rejection actions
- broker record editing
- publishing controls
- visibility toggles
- lead / click analytics review
- sync status monitoring

---

## Recommended Principles

### Keep the public directory separate from the admin surface
Do not let internal workflow complexity leak into the public UX.

### Keep authentication optional until it is truly needed
Do not overbuild a heavy portal before the public-facing directory and onboarding system are stable.

### Reuse the same broker data model
The admin and broker-facing surfaces should extend the same core `BrokerProfile` model and related workflow states.

---

## Recommended Portal Surface

### Route
- `/portal`

### Primary audience
- approved brokers / partners

### Potential sections
- profile summary
- approval / publication status
- profile completeness checklist
- update request form
- CTA link settings
- contact information review
- future performance insights

### Phase 1 version of `/portal`
A simple authenticated page that shows:
- broker status
- whether the profile is live
- what data is missing
- who to contact for updates

---

## Recommended Admin Surface

### Route
- `/admin`

### Primary audience
- Moonshine Capital internal team

### Potential sections
- pending applications
- in-review applications
- approved brokers
- hidden brokers
- rejected applications
- sync and publish actions
- tracking snapshots / top broker clicks

### Phase 1 version of `/admin`
A simple internal dashboard showing:
- broker status buckets
- links to records under review
- lightweight actions for approve / reject / publish

---

## Data / Workflow Needs

### Broker portal needs
- current broker record
- publication status
- profile completeness status
- update-request submission path

### Admin portal needs
- application review state
- onboarding stage
- CRM / Wix sync state
- broker status and active flag
- approval status
- internal notes

---

## Authentication Considerations

Authentication is not yet documented as implemented in this repo.

Possible future options:
- Wix Members / Wix-backed auth
- Clerk
- Auth.js / NextAuth
- Supabase Auth
- custom lightweight admin gate

### Recommended approach
Do not choose auth tooling based on hype.
Choose it based on:
- where broker data actually lives
- how much editing brokers should be allowed to do
- how much internal workflow needs to live inside this repo vs external tools

---

## Recommended Initial Feature Split

### Public site remains responsible for:
- broker discovery
- broker profile presentation
- onboarding entry
- tracked outbound routing

### Broker portal eventually handles:
- status visibility
- update requests
- profile completeness
- light self-service

### Admin eventually handles:
- review workflow
- publication workflow
- analytics review
- operational oversight

---

## Suggested Route Expansion

```text
/portal
/portal/profile
/portal/status
/portal/updates
/admin
/admin/applications
/admin/brokers
/admin/publishing
/admin/analytics
```

These do not need to exist yet, but they are useful as the conceptual expansion map.

---

## Recommended Phase Plan

### Phase 1
Document the workflow only.
Do not build complex auth yet.

### Phase 2
Add placeholder `/portal` and `/admin` pages with clear intent and TODO scope.

### Phase 3
Define access model and auth stack.

### Phase 4
Implement minimal internal admin workflow:
- review queue
- approval actions
- publish toggles

### Phase 5
Implement minimal broker portal workflow:
- status view
- update requests
- profile completeness

---

## Risks to Avoid

- building a full admin system before the public directory is stable
- mixing internal ops UI into public routes
- creating broker-editing capabilities without clear approval controls
- choosing auth infrastructure before the workflow is fully defined

---

## Recommended Next Steps
- keep `/portal` and `/admin` in the scaffold as future routes
- do not treat them as immediate build priorities
- first stabilize the public directory, onboarding, tracking, and data flow
- once broker lifecycle operations become painful enough, promote portal/admin work to active build status
