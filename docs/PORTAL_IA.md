# PORTAL_IA

## Purpose
`/portal` is the internal operating layer for brokers and partners.

This is not a public marketing surface.
This is where a broker logs in to access tools, resources, profile controls, and performance visibility.

## Product role
The portal should feel like a command center, not a brochure.

Core value:
- access useful tools
- manage profile/resource visibility
- grab links and assets
- view tracked clicks and activity
- get onboarding steps and next actions

## Route tree
- `/portal`
- `/portal/tools`
- `/portal/resources`
- `/portal/profile`
- `/portal/tracking`
- `/portal/settings`

## Route responsibilities

### `/portal`
Portal home / dashboard.
Should show:
- welcome state
- profile completion state
- featured tools
- recent clicks / activity summary
- next recommended action

### `/portal/tools`
Curated utilities brokers can actually use.
Examples:
- funding widgets
- calculators
- qualifying tools
- AI assistants / GPT links
- embedded Vercel apps

### `/portal/resources`
Resource library for brokers.
Examples:
- scripts
- email templates
- social assets
- docs
- partner links
- videos

### `/portal/profile`
Broker-facing profile management view.
Should show:
- public profile preview
- profile completion checklist
- bio / positioning fields
- resource slots
- selected tools
- CTA configuration

### `/portal/tracking`
Broker-facing tracking view.
Should show:
- outbound click summary
- top CTA by source
- recent click log
- destination breakdown
- later: attributed conversions

### `/portal/settings`
Internal broker settings layer.
Examples:
- profile visibility
- contact preferences
- notification settings
- API / webhook keys later if needed

## MVP components
- `PortalShell`
- `PortalStatCard`
- `PortalSection`
- `ToolCard`
- `ResourceCard`
- `ProfileCompletionCard`
- `TrackingTable`

## Empty-state philosophy
Every portal page should still feel useful when empty.
Examples:
- suggest tools to add
- suggest profile actions
- link to onboarding/profile-builder step
- surface docs/resources instead of blank tables

## Data dependencies
Portal should eventually read from:
- Notion CRM / broker record
- embed registry
- resource registry
- CTA tracking logs

## Notes
Build `/portal` as the operator layer of Funding Agent OS.
It should add utility, not just aesthetics.
