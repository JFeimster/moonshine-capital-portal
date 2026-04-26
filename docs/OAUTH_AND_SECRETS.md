# OAUTH_AND_SECRETS

## Purpose
Document how secrets, tokens, and API credentials should be handled for this repo.

## Core rule
Do not hardcode credentials.
Do not bury secrets in markdown examples and then forget about them.

## Likely secrets / env vars
- `NOTION_API_KEY`
- `NOTION_BROKER_DATABASE_ID`
- `N8N_CTA_WEBHOOK_URL`
- `N8N_INTAKE_WEBHOOK_URL`
- `TALLY_APPLICATION_FORM_ID`
- `TALLY_PROFILE_FORM_ID`
- `WIX_API_KEY` (optional later)
- `WIX_SITE_ID` (optional later)

## OAuth candidates later
- Notion OAuth if per-user installs or dynamic workspace connections are needed
- Google OAuth if Sheets/Drive become part of the operational stack later
- HubSpot OAuth if CRM syncing gets added

## Secret handling policy
- local development = `.env.local`
- production = Vercel environment variables
- automation = n8n credentials store
- docs = use placeholders only

## Rotation policy
- rotate exposed tokens immediately
- keep a short env checklist in `/admin/settings` later
- record changes in internal ops notes, not public repo docs

## Notes
For now, keep the stack simple:
Tally + Notion + n8n + Vercel.
Do not introduce OAuth complexity until it solves a real problem.
