# Page Inventory

## Purpose
This document inventories the current and recommended pages for `moonshine-capital-portal`.

It is meant to provide a quick page-level view of:
- what exists now
- what each page does
- what is recommended next
- how each page supports the overall portal strategy

This file is complementary to:
- `docs/route-map.md`
- `docs/full-scaffold.md`

---

## Current Pages

| Route | Status | Role | Notes |
|---|---|---|---|
| `/` | existing | Homepage / positioning | Explains the directory and features selected partners |
| `/directory` | existing | Directory index | Main searchable/filterable broker directory |
| `/directory/[slug]` | existing | Broker profile page | Individual broker landing page with CTA routing |
| `/onboarding` | existing | Partner onboarding | Tally-powered onboarding flow |
| `/terms` | existing | Legal | Terms of Service |
| `/privacy` | existing | Legal | Privacy Policy |
| `/out` | existing | Infrastructure | Tracked redirect route |

---

## Current Page Roles

### Homepage (`/`)
**Job:**
- establish positioning
- explain why the directory exists
- feature brokers
- route users into the directory

### Directory (`/directory`)
**Job:**
- help users browse partners
- expose filters and faceted discovery
- serve as the primary discovery surface

### Broker Profile (`/directory/[slug]`)
**Job:**
- sell the credibility and fit of a broker
- present industries, specialties, contact info, and CTA options
- support tracked outbound routing

### Onboarding (`/onboarding`)
**Job:**
- recruit brokers / partners
- capture intake information
- move applicants into review workflow

### Terms (`/terms`)
**Job:**
- legal coverage
- disclaimers

### Privacy (`/privacy`)
**Job:**
- privacy disclosure
- data-handling explanation

### Out (`/out`)
**Job:**
- centralize tracked CTA redirects
- preserve click-routing control

---

## Recommended Next Pages

### High-priority public pages
| Route | Priority | Purpose |
|---|---|---|
| `/about` | high | Explain Moonshine Capital Portal and the directory mission |
| `/contact` | high | Give users and partners a direct contact page |
| `/faq` | high | Answer common founder / broker questions |
| `/apply` | high | Introduce an application or lead-intake route for funding seekers |

### SEO / taxonomy pages
| Route | Priority | Purpose |
|---|---|---|
| `/industries` | medium | Industry landing hub |
| `/industries/[slug]` | medium | Industry-specific discovery page |
| `/funding-types` | medium | Funding-type hub |
| `/funding-types/[slug]` | medium | Funding-type-specific directory view |
| `/states` | medium | State hub |
| `/states/[slug]` | medium | State-specific landing page |
| `/compare/[slug]` | medium | Comparison landing pages for SEO / conversion |

### Future product pages
| Route | Priority | Purpose |
|---|---|---|
| `/portal` | lower | Future authenticated broker / partner experience |
| `/admin` | lower | Future internal review / ops surface |

---

## Suggested Page Hierarchy

```text
/
/directory
/directory/[slug]
/onboarding
/terms
/privacy
/out
/about
/contact
/faq
/apply
/industries
/industries/[slug]
/funding-types
/funding-types/[slug]
/states
/states/[slug]
/compare/[slug]
/portal
/admin
```

---

## Page Strategy by Audience

### Founders / operators
Best pages:
- `/`
- `/directory`
- `/directory/[slug]`
- `/faq`
- `/apply`
- future industry and funding-type pages

### Prospective brokers / partners
Best pages:
- `/onboarding`
- `/about`
- `/contact`
- future `/portal`

### Internal / ops team
Best pages:
- `/out`
- future `/admin`
- future `/portal`

---

## Recommended Build Sequence

### Phase 1
- `/about`
- `/contact`
- `/faq`
- `/apply`

### Phase 2
- `/industries`
- `/industries/[slug]`
- `/funding-types`
- `/funding-types/[slug]`
- `/states`
- `/states/[slug]`

### Phase 3
- `/compare/[slug]`
- `/portal`
- `/admin`

---

## Notes
- `docs/route-map.md` should remain the more route-strategy-oriented file
- this file should remain more inventory-oriented and easy to scan
- new page proposals should support directory discovery, onboarding, tracking, or future Funding Agent OS evolution
