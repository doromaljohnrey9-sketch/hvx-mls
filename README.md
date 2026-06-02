# HVX (HEMS Past-Exam Video Explainer Learning System MVP)

HVX transitions a manual process—teachers sending individual past-exam solution videos via KakaoTalk—into an automated, secure, and searchable sub-module within the existing HEMS ecosystem.

The primary goal is to **allow approved students to easily find and watch necessary exam videos while strictly preventing external content leakage.**

## 📋 Executive Summary

- **Objective:** Automate, secure, and organize exam solution videos.
- **Security:** "Approved students only" access model. No video download capabilities.
- **Priority:** CEO Matt (Target Launch: Tuesday, June 9, 2026).
- **Hard Deadline:** Friday, June 5, 2026.

## 🎯 Scope: MVP

- **In-Scope:** User access control, video search/filtering, metadata management, and responsive playback.
- **Out of Scope (Phase 3):** AI recommendation engines, auto-tagging, weak-point analysis, automated reports.

## 👥 User Roles & Permissions

1. **Pending:** Default state for self-signed-up students; restricted from accessing any videos.
2. **Student:** Approved users who can search and play videos.
3. **Teacher / Branch Admin:** Can approve/reject/block students and manage video data for their specific branch.
4. **Super Admin:** Global management rights across all branches.

## 📅 5-Day Work Breakdown Structure (WBS)

| Day | Focus Area | Key Deliverables |
| --- | --- | --- |
| **Day 1** | **Foundation** | Data model normalization (DB design); Role/permission policy mapping; Student + Admin screen wireframing. |
| **Day 2** | **Auth & Approval** | Student self-registration (defaulting to pending); Secure hashed password login; Teacher/Admin student management dashboard. |
| **Day 3** | **Search & Playback** | Metadata filter search; Mobile/Tablet-first responsive video player; Restricted video URL structures. |
| **Day 4** | **Admin Features** | Video uploading (files + external URLs); Metadata entry with duplicate alerts; Visibility toggles (`Public`/`Private`/`Hidden`). |
| **Day 5** | **Migration & QA** | Bulk Excel upload (~600 legacy videos); Verification of completion statuses; Internal QA and final deployment. |

## ✅ Core Acceptance Criteria

- 🔒 **Security First:** Unapproved students have zero access. No video download capabilities exposed.
- **Search & Usability:** Fluid search by school name and problem number (Tablet/Mobile-first).
- **Admin Control:** Visibility toggles, bulk-import via Excel.
- **Localization:** All user-facing UI labels must be rendered in **Korean**.

---

## Technical Foundation

Built on **NextBase** (Next.js 16, Supabase, Drizzle ORM).

### Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Auth & Database:** Supabase (email/password, OAuth), PostgreSQL
- **ORM:** Drizzle ORM
- **UI:** Shadcn/ui, Radix, Tailwind CSS v4
- **State:** TanStack React Query, Zustand
- **Docs:** VitePress

## Quick Start

```bash
pnpm install
cp .env.example .env
# Configure environment variables
pnpm db:push
pnpm start:development
```

## Documentation

- **[VitePress Docs](./docs/overview.md)** — Strategy, UI patterns, and API reference.
- **[AGENTS.md](./AGENTS.md)** — Developer reference for the starter foundation.
