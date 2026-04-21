# Notion Broker CRM Schema

This document details the database schema for the Notion CRM used by the internal team to manage broker onboarding, reviews, and status.

## Notion Database Properties

| Property Name | Notion Type | Canonical Mapping | Description |
| :--- | :--- | :--- | :--- |
| **Broker Name** | Title | `fullName` | Broker's full name. |
| **Email** | Email | `email` | **(Merge Key)** Broker's contact email. |
| **Agency** | Text | `agencyName` | Broker's agency name. |
| **Status** | Status / Select | (Internal) | Workflow state: `Pending`, `In Review`, `Approved`, `Rejected`. |
| **Date Applied** | Date | (Internal) | Timestamp of the initial application. |
| **State** | Select | `state` | Operating state. |
| **Phone** | Phone | `phoneNumber` | Contact phone number. |
| **Website** | URL | `websiteUrl` | Agency website. |
| **Internal Notes** | Text | (Internal) | Private notes for the review team. |
| **Profile Complete** | Checkbox | (Internal) | Automatically checked when the Profile Builder form is submitted. |
| **Wix ID** | Text | (Internal) | ID of the synchronized Wix CMS record (used for updates). |
| **Slug** | Text | `slug` | Generated URL slug for the public directory. |

## Webhook Triggers
- When **Status** changes to `Approved`, an n8n webhook is triggered to update the corresponding Wix CMS record (`isActive = true`, `approvalStatus = 'approved'`).
- Changes to other fields after approval may also trigger updates to Wix CMS, depending on n8n configuration.
