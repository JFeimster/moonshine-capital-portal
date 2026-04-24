# AUTOMATIONS_AND_WEBHOOKS

## Goal
Map the automation layer so intake, routing, resource assignment, and notifications can happen without duct tape.

## Core workflows

### 1. Public funding application flow
Tally form → webhook → n8n → Notion lead record → notification / follow-up

### 2. Broker application flow
Tally broker form → webhook → n8n → Notion broker CRM → status `pending`

### 3. Broker profile-builder flow
Tally profile-builder form → webhook → n8n → update existing Notion broker record → mark `in_review`

### 4. Broker approval flow
Admin action / Notion status change → n8n → publish profile state / send broker update

### 5. CTA tracking flow
`/out` route → webhook → event log store → reporting layer

## Recommended webhook endpoints
- `/api/intake/tally/application`
- `/api/intake/tally/profile`
- `/out`
- future: `/api/admin/publish-broker`
- future: `/api/admin/assign-resources`

## Event payloads to normalize
- source
- submission type
- email
- record id / slug
- status
- timestamp
- destination URL
- page source

## Notes
Automations should enforce the system design.
If the workflow allows bad data to glide through just because a webhook technically fired, the automation is still bad.
