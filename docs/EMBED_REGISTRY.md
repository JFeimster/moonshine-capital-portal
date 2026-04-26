# EMBED_REGISTRY

## Purpose
Create a single source of truth for tools, widgets, calculators, apps, GPTs, and external resources that can be surfaced across:
- public broker profiles
- `/portal/tools`
- `/portal/resources`
- `/admin/resources`

## Why this matters
The platform should not just list stale profile info.
It should actually give brokers and visitors useful things to do.

## Registry object
Recommended fields:
- `id`
- `slug`
- `title`
- `description`
- `category`
- `type`
- `url`
- `embedUrl`
- `image`
- `accessLevel` (`public`, `portal`, `admin`)
- `status` (`draft`, `active`, `archived`)
- `tags`
- `assignedBrokers`
- `sortOrder`
- `notes`

## Categories
- calculators
- funding widgets
- lead capture tools
- AI assistants
- GPTs
- content resources
- onboarding resources
- partner utilities

## Types
- `link`
- `iframe`
- `embed`
- `app`
- `doc`
- `video`

## Suggested rendering rules
- public profile = only public + assigned items
- portal = public + portal items
- admin = all items

## Suggested supporting files
- `data/embeds/tool-registry.json`
- `lib/embed-registry.ts`

## Notes
Treat the registry as product infrastructure.
Do not hardcode every tool directly into individual pages like a maniac.
