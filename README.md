# Moonshine Capital Portal

Moonshine Capital Portal is the Next.js front-end layer for a broker directory, partner onboarding flow, and the future Funding Agent OS experience.

It provides an operator-focused capital marketplace built on a strong, dark neo-brutalist aesthetic.

## 🚀 Purpose

Founders often lose weeks pitching to banks that will never approve them. This directory connects business owners directly with vetted capital allocators, brokers, and specialized lenders who underwrite fast and move money efficiently.

In the long term, this codebase is evolving into the front-end for **Funding Agent OS**—a comprehensive operating system for broker discovery, partner recruitment, lead routing, and multi-vertical funding.

## 🏗️ Architecture & Data Flow

This application uses a modular, decoupled architecture where Next.js acts as the presentation and routing layer.

**Data Flow:**
1. **Intake:** Partners apply via Tally embed (`/onboarding`).
2. **Review:** Applications are reviewed and managed externally.
3. **Storage (Source of Truth):** Approved broker profiles are stored in Wix CMS.
4. **Presentation:** The Next.js app fetches approved, active brokers from Wix CMS via the `lib/wix.ts` integration layer.
5. **Analytics & Routing:** High-intent clicks are tracked through a structured CTA model, paving the way for advanced lead routing.

**Current State:**
A mock data fallback (`lib/mock-brokers.ts`) is currently in place for local development and build verification when live Wix API credentials are not provided.

## 🗺️ Current Routes

- `/` — Homepage / Positioning layer. Introduces the marketplace and highlights featured partners.
- `/directory` — The core broker directory. Features client-side filtering by State, Industry, Funding Type, and Urgency.
- `/directory/[slug]` — Individual broker profile pages. Designed as high-conversion SEO landing pages with distinct CTAs and tracked nodes.
- `/onboarding` — Partner onboarding page featuring a Tally form placeholder.

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Dark Neo-brutalist theme)
- **CMS / Backend:** Wix CMS (via REST API)
- **Intake:** Tally Forms
- **Deployment:** Vercel

## ⚙️ Environment Variables

To run the app with live Wix data, provide the following environment variables:

```env
WIX_API_URL=https://your-wix-site.com/_functions/api
WIX_API_KEY=your_wix_api_key
```

*Note: If these are not provided, the app will safely fall back to local mock data.*

## 🛣️ Next Milestones

- **Live Wix CMS Wiring:** Finalize the Wix API endpoint structure and swap out mock data entirely in production.
- **Advanced CTA Tracking:** Connect the structured `CTANode` tracking IDs to PostHog, Segment, or Google Analytics.
- **Multi-Vertical Support:** Clone or adapt the directory structure to support specific funnels for Trucking, E-commerce, Real Estate, and Contractor funding.
- **Funding Agent OS Expansion:** Introduce authenticated broker views, agent dashboards, and dynamic lead routing.
