# Tally Profile Builder Form Schema

This document outlines the expected fields from the detailed Tally Profile Builder form. This form is sent to brokers after initial intake to collect the full profile data required for the public directory.

## Expected Form Fields

| Tally Field Label | Tally Field Type | Canonical Mapping | Description |
| :--- | :--- | :--- | :--- |
| **Email Address** | Email | `email` | **(Merge Key)** Used to match this submission to the existing CRM record. |
| **Short Bio** | Long Text | `shortBio` | Professional biography. |
| **Why Choose You?** | Long Text | `whyChooseYou` | Value proposition for potential clients. |
| **Operating City** | Short Text | `city` | Primary city of operation. |
| **Target Industries** | Multiple Choice / Checkboxes | `industries` | Array of target industries (e.g., SaaS, Construction). |
| **Funding Types** | Multiple Choice / Checkboxes | `fundingTypes` | Array of funding specialties. |
| **Funding Speed** | Dropdown | `urgencyCategory` | Typical speed (fast, standard, complex). |
| **Profile Image / Logo** | File Upload | `profileImage` | URL to the uploaded image. |
| **Primary CTA Label** | Short Text | `primaryCtaLabel` | Custom text for the button (Optional). |
| **Primary CTA Link** | Link / URL | `primaryCtaLink` | Where the button should link to (Optional). |

## Notes for Ingestion (n8n Pipeline)
- This payload updates the existing record in Notion CRM.
- It triggers the creation/update of the corresponding Wix CMS `BrokerProfile`.
- File uploads (images) from Tally must be securely accessible or re-hosted if necessary before passing the URL to Wix CMS.
