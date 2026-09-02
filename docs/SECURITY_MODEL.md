# SECURITY_MODEL

## Principles
- validate external URLs before redirecting
- do not trust form payloads blindly
- keep public and internal routes separate
- do not auto-publish unreviewed broker data
- keep secrets out of source control

## Current critical surfaces
- Tally intake routes
- `/out` redirect route
- public broker profile data
- future portal/admin auth boundaries

## Controls
- normalize and validate intake fields
- require merge key for record updates
- block invalid or unsafe redirect URLs
- gate public display by approval + status
- keep admin actions separate from public routes

## Future controls
- auth for `/portal`
- stronger auth/role checks for `/admin`
- audit logs for publish actions
- broken link checks
- rate limiting on intake and tracking routes if needed

## Notes
Security here is mostly boring hygiene.
That is exactly why it matters.

## Temporary Access Gate
A lightweight, signed-cookie access gate is currently implemented to protect `/admin` and `/portal` routes.
- This relies on `AUTH_SESSION_SECRET` and `ADMIN_ACCESS_PASSWORD` (and optionally `PORTAL_ACCESS_PASSWORD`).
- **This is a TEMPORARY measure.** It is not the final Funding Agent OS identity system.
- Long-term auth will feature individual identities, fine-grained broker permissions, and proper session lifecycle.
