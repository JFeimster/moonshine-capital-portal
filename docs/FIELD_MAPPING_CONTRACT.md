# Canonical Broker Schema & Field Mapping Contract

This document defines the canonical data model for a Broker Profile across the Distilled Funding ecosystem. It acts as the source of truth for integrations moving data between Tally (intake), Notion (CRM), and Wix CMS (public directory).

## Merge Key
The primary identifier for matching records across systems is the **Broker Email (`publicEmail` / `email`)**.
If email is missing or changed, require manual resolution or use an immutable submission/broker ID instead.

## Field Categories

### 1. Internal-Only Fields (Notion CRM)
- `Status` (e.g., Pending, In Review, Approved, Rejected)
- `Internal Notes`
- `Application Date`
- `Tally Submission ID`

### 2. Public-Only Fields (Wix CMS)
- `featuredFlag` (boolean, used for sorting/display)
- `brokerStatus` (e.g., active, hidden)

### 3. Derived/Generated Fields
- `slug`: Generated from `fullName` (e.g., "Jane Doe" -> "jane-doe").
- `primaryCtaLink`: Generated/Sanitized external URL for tracking.

## Canonical Data Model

| Field Name | Type | Description |
| :--- | :--- | :--- |
| `fullName` | String | Broker's full name. |
| `email` | String | Broker's public contact email (Merge Key). |
| `agencyName` | String | Name of the broker's agency. |
| `city` | String | Operating city. |
| `state` | String | Operating state (2-letter abbreviation). |
| `websiteUrl` | String | Agency or broker website URL. |
| `phoneNumber` | String | Public contact phone number. |
| `shortBio` | String | Short professional biography. |
| `whyChooseYou` | String | Value proposition ("Why choose this broker"). |
| `industries` | Array<String> | Target industries. |
| `fundingTypes` | Array<String> | Types of funding offered. |
| `urgencyCategory` | String | Typical speed of funding ('fast', 'standard', 'complex'). |
| `profileImage` | String (URL) | URL to broker's headshot or logo. |
| `primaryCtaLabel`| String | Custom text for primary CTA button. |
| `primaryCtaLink` | String (URL) | Custom destination for primary CTA button. |

## Data Transformation Rules

### 1. Slug Generation
- Source: `fullName`
- Transform: Lowercase, replace spaces with hyphens, remove special characters.
- Example: "John Smith-Doe!" -> `john-smith-doe`

### 2. URL Cleanup
- Source: `websiteUrl`, `primaryCtaLink`, `profileImage`
- Transform: Ensure protocol `https://` is present if missing. Remove trailing slashes.
- Example: "example.com" -> `https://example.com`

### 3. Arrays / Multi-Select Normalization
- Source: `industries`, `fundingTypes` (Tally Multi-Select / Checkboxes)
- Transform: Ensure comma-separated strings are parsed into arrays of trimmed strings.
- Example: "SaaS, Manufacturing , Technology" -> `["SaaS", "Manufacturing", "Technology"]`

### 4. Defaults
- `urgencyCategory`: Default to `"standard"` if not provided.
- `approvalStatus` (Wix): Default to `"pending"` upon initial ingestion until verified.
- `isActive` (Wix): Default to `false` until approved.
