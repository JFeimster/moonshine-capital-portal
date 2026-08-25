# Partner Distribution Contract

Track A / Issue #25

## Canonical public referral URL

Every published partner has exactly one shareable funding URL:

`https://capital.distilledfunding.com/<partner-slug>?ref=<referral_code>`

- `slug` is owned by Capital and is not partner-editable.
- `referral_code` is immutable except through an explicit admin migration.
- `partner_id` remains the durable internal identity and must never be derived from the slug or referral code.

Campaign metadata may be added as query parameters without changing partner identity:

- `campaign`
- `utm_source`
- `utm_medium`
- `utm_campaign`

## Lead intake

Canonical partner-attributed client intake:

`https://tally.so/r/dWvEqN`

Partner Command and Capital pre-populate hidden attribution values rather than asking a client to enter a referral identifier:

- `partner_id`
- `referral_code`
- `referral_partner` (legacy compatibility)
- `source`
- `campaign`
- `utm_source`
- `utm_medium`
- `utm_campaign`

## CTA routing

`/out` remains the canonical tracked outbound gateway for public partner-page CTAs. It resolves the partner from the canonical profile, preserves the attribution envelope, and redirects to the partner's configured destination or the canonical attributed Tally intake.

## Ownership

### Capital / moonshine-capital-portal

- slug
- public rendering
- publication gating
- public referral URL
- tracked CTA routing
- public funding-page behavior

### Partner Command / partner-command-center

Partner-editable presentation fields include display name, company, title, photo/logo, bio, specialties, industries, funding types, markets, booking/website/contact values, and CTA preferences.

Partner Command must not mutate:

- `partner_id`
- `referral_code`
- `slug`
- `approval_status`
- `profile_status`

## Widgets and assets

Only real, canonical inventory may be surfaced. Donor mock CDN snippets and stock placeholder assets are not approved distribution products. Partner Command federates actual widget/resource inventory rather than taking ownership of those assets.
