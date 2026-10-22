# Partner CRM activation — `platform-core`

**State:** Application-level production tenant exists. Credentials and live integration test are pending. Code being merged does **not** constitute activation.

## Canonical contract

- Partner applications, membership, lifecycle events: Supabase `platform-core` (`loaowmappekunngjknnx`).
- Production application organization: `Moonshine Capital`, UUID `39d485b4-c1ae-4184-a15c-9db7fbc94606`. Active owner membership verified.
- Existing Notion path: downstream compatibility/projection for partner joins during migration; do not migrate unrelated funding leads or historic applicants.
- `partner-crm-ingest` v2: bearer-authenticated Edge Function invoking transactional `ingest_partner_application` RPC; unique source+submission identity; replay returns `duplicate:true`.
- Server callers: `moonshine-capital-portal` (Tally join `rjM6do`) and `partner-command-center` (Tally join `mOe658`).

## Exact server settings

| Platform | Variable | Value |
| --- | --- | --- |
| Supabase Edge Function secrets | `PARTNER_CRM_ORG_ID` | `39d485b4-c1ae-4184-a15c-9db7fbc94606` |
| Supabase Edge Function secrets | `PARTNER_CRM_INGEST_TOKEN` | High-entropy shared secret; **do not commit** |
| Both Vercel projects, server only | `PARTNER_CRM_INGEST_URL` | `https://loaowmappekunngjknnx.supabase.co/functions/v1/partner-crm-ingest` |
| Both Vercel projects, server only | `PARTNER_CRM_INGEST_TOKEN` | Same shared secret as Supabase |
| `moonshine-capital-portal`, after activation | `PARTNER_CRM_REQUIRED` | `true`, only with verified working credentials |

Supabase management organization `amokoyoaubnwuoekfbax` is **not** the `PARTNER_CRM_ORG_ID` value.

## Activate via authenticated owner CLI / Codex

1. `supabase --help`; `supabase secrets --help`; `vercel env --help`. Verify the intended account/team and existing variable **names** before any write.
2. `supabase secrets list --project-ref loaowmappekunngjknnx`. Set missing Edge Function variables using `supabase secrets set --env-file <secure-temporary-file> --project-ref loaowmappekunngjknnx`. Never paste actual tokens into a PR, source file, or logs.
3. In Vercel team `team_fYzYTSpH5gj1di6KiPHV6tbx`, inspect project environment settings for `moonshine-capital-portal` (`prj_EQrfYjOPHEjm9oGGbLkfpOevUb6q`) and `partner-command-center` (`prj_F1L6UW5jFp6L5Ov8ENwrbfVETDVY`). Add URL and matching server-side token for Production; configure Preview only when intentional. Use an owner-authenticated CLI if the connector returns 403.
4. Redeploy once to pick up the environment variables, then enable `PARTNER_CRM_REQUIRED=true` with a new deployment of the portal only after a verified end-to-end request. Preserve existing Tally HMAC signing credentials.
5. Send a synthetic signed Tally partner-join request through the actual Vercel server route using a verified test harness, or first test the Edge Function directly with a synthetic submission and bearer token. Use an `@example.invalid` email, unique submission ID, and label test data. Replay once with the same ID.
6. Verify exactly one application and event under production org UUID, a duplicate replay receipt, rejection without bearer auth, and that the existing Notion projection still succeeds. No historical migrations.
7. Confirm GitHub checks, squash merge the PR when code is ready, and report deployment separately from confirmed ingestion activation.

## Failure behavior

On the portal, Supabase is written **before** Notion when configured; an upstream failure rejects the webhook so Tally can retry. If Notion later fails, the same submission retries and Supabase returns the original receipt without duplicating the canonical record. With **both** CRM vars absent, the existing Notion intake remains functional until activation. A partial configuration is an error, not silent success. The `PARTNER_CRM_REQUIRED` flag changes missing configuration into a retryable error.

## Permissions blocker

Vercel connector returned 403 reading project environment variables; Supabase connector lacks Edge Function secret-write operations; hosted ChatGPT container has no linked owner CLI credentials. Owner-authenticated local Codex or ChatGPT Work cloud browser is needed for the remaining secret setup. Do not claim the live path is active until a signed submission passes.
