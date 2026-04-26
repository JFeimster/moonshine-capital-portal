# ADMIN_IA

## Purpose
`/admin` is the internal control plane.

This is where you review submissions, approve brokers, manage publishing states, inspect logs, and keep the system from becoming a landfill.

## Product role
The admin layer exists to control:
- intake review
- broker approval state
- public visibility state
- resource assignment
- publish actions
- logs / operational debugging

## Route tree
- `/admin`
- `/admin/submissions`
- `/admin/brokers`
- `/admin/resources`
- `/admin/logs`
- `/admin/settings`

## Route responsibilities

### `/admin`
Admin dashboard.
Should show:
- pending submissions
- brokers awaiting review
- publish queue
- recent failures
- recent click/activity summary

### `/admin/submissions`
Intake review queue.
Should show:
- application submissions
- profile-builder submissions
- merge state / duplicate detection
- current review status
- approve / reject / request follow-up actions

### `/admin/brokers`
Broker records control layer.
Should show:
- status
- profile completeness
- public visibility
- CTA config summary
- assigned resources / tools
- publish target summary

### `/admin/resources`
Curated resources and tool assignment.
Should show:
- registry list
- visibility rules
- broker assignments
- category controls

### `/admin/logs`
Operational debugging page.
Should show:
- intake event log
- webhook failures
- publish failures
- CTA log stream
- manual retry notes later

### `/admin/settings`
System-level settings.
Examples:
- form IDs
- webhook URLs
- API integration notes
- environment checklist
- access / auth notes later

## MVP components
- `BrokerApprovalQueue`
- `BrokerStatusToggle`
- `SubmissionTable`
- `AdminStatCard`
- `LogTable`
- `PublishActionBar`

## Workflow states
Recommended broker lifecycle:
- `pending`
- `in_review`
- `approved`
- `rejected`
- `published`
- `hidden`

## Notes
The admin layer should reduce tool-switching, not add more.
If an admin still has to bounce blindly between Tally, Notion, Vercel, and random tabs for every decision, the system still sucks.
