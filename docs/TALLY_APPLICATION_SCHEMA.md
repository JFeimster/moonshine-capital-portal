# Tally Application Form Schema

This document outlines the expected fields from the initial Tally Application form (the onboarding intake). This form is typically shorter to reduce friction, focusing on essential details to qualify a broker.

## Expected Form Fields

| Tally Field Label | Tally Field Type | Canonical Mapping | Description |
| :--- | :--- | :--- | :--- |
| **Full Name** | Short Text | `fullName` | The broker's full name. |
| **Email Address** | Email | `email` | The broker's contact email. **(Merge Key)** |
| **Agency Name** | Short Text | `agencyName` | The name of the broker's agency or company. |
| **Operating State** | Dropdown / Short Text | `state` | Primary state of operation (2-letter abbreviation preferred). |
| **Website URL** | Link / URL | `websiteUrl` | Agency or personal website URL (Optional). |
| **Phone Number** | Phone | `phoneNumber` | Contact phone number (Optional). |

## Notes for Ingestion (n8n Pipeline)
- This payload creates the initial record in Notion CRM with a "Status" of "Pending".
- No Wix CMS record is created at this stage.
