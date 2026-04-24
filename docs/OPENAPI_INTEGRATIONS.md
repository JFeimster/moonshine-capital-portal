# OPENAPI_INTEGRATIONS

## Purpose
Track the APIs, webhooks, and integration surfaces worth wiring into the portal.

## Near-term stack
- Tally
- Notion API
- n8n webhooks
- Vercel server routes

## Good candidates later
- HubSpot API
- Google Sheets / Drive API
- Bitly or Dub link management API
- Slack / Discord notifications
- email provider API

## Integration priority

### 1. Intake
- Tally webhook → Next.js or n8n
- normalize payload
- persist to Notion

### 2. Tracking
- `/out` route → n8n webhook
- log CTA event
- append to reporting store

### 3. Publishing
- approved broker → optional public publish target
- do not make this the center of the system

### 4. Notifications
- approval/rejection notices
- profile incomplete reminders
- broken-link alerts

## Suggested OpenAPI / machine-readable specs to add later
- `openapi/intake-api.yaml`
- `openapi/tracking-api.yaml`
- `openapi/admin-api.yaml`

## Notes
APIs should support actual operations, not just look impressive in the repo.
