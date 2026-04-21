# Wix CMS BrokerProfile Schema

This document defines the schema for the `brokerProfiles` collection in Wix CMS. This collection is the source of truth for the public-facing Next.js directory.

## Wix CMS Collection Properties

| Field Key | Field Type | Frontend UI Property | Description |
| :--- | :--- | :--- | :--- |
| `title` | Text | (Internal) | Standard Wix title field (usually maps to Full Name). |
| `fullName` | Text | `fullName` | The broker's full name. |
| `publicEmail` | Text | `publicEmail` | **(Merge Key)** The public contact email for the broker. |
| `agencyName` | Text | `agencyName` | The name of the agency. |
| `slug` | Text | `slug` | Unique URL path segment (e.g., `jane-doe`). |
| `shortBio` | Rich Text | `shortBio` | Professional biography. |
| `whyChooseYou` | Rich Text | `whyChooseYou` | Value proposition. |
| `city` | Text | `city` | Operating city. |
| `state` | Text | `state` | Operating state (2 letters). |
| `websiteUrl` | URL | `websiteUrl` | Agency/broker website. |
| `phoneNumber` | Text | `phoneNumber` | Contact phone number. |
| `industries` | Tags / Array | `industries` | List of target industries. |
| `fundingTypes` | Tags / Array | `fundingTypes` | List of funding specialties. |
| `urgencyCategory` | Text | `urgencyCategory` | Typical speed (`fast`, `standard`, `complex`). |
| `profileImage` | Image | `profileImage` | Headshot or logo. |
| `primaryCtaLabel`| Text | `primaryCta.label` | Text for the primary CTA. |
| `primaryCtaLink` | URL | `primaryCta.url` | Destination URL for the primary CTA. |
| `approvalStatus` | Text | `approvalStatus` | System status (`pending`, `approved`, `rejected`). |
| `isActive` | Boolean | `isActive` | Whether the profile is live in the directory. |
| `featuredFlag` | Boolean | `featuredFlag` | If true, prioritizes the broker in search/display. |
| `brokerStatus` | Text | `brokerStatus` | Custom states like `active`, `hidden`, `recruiting`. |

## Frontend Data Mapping Notes
The Next.js frontend fetches records from this collection where `isActive === true` and `approvalStatus === 'approved'`.
The frontend `lib/brokers.ts` (or equivalent) transforms these raw Wix fields into the canonical `BrokerProfile` type defined in `lib/types.ts`.
