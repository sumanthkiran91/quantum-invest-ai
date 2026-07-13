# Implementation Plan

## Phase 1: Foundation

- Inspect design references.
- Create product and design documentation.
- Create `AGENTS.md`.
- Scaffold Next.js App Router with TypeScript and Tailwind CSS.
- Add reusable base components and theme tokens.
- Add mock-data guardrails and a foundation landing screen.
- Install dependencies and run lint/build checks.

## Phase 2: Global Dashboard

- Build shared navigation and dashboard layout.
- Add industry selector, compact market overview, mock market timing logic, movers, and supporting cards.
- Keep all data mock and clearly labelled.

## Phase 3: Watchlist

- Build local-storage watchlist state.
- Add tabs, filters, sorting, add/remove, limits, and account switcher.
- Add empty, loading, and error states.

## Phase 4: Investment Details

- Build reusable asset route.
- Add trend filters, AI insight, deterministic scenario planner, news, key data, events, related assets, and feature locks.

## Phase 5: Prototype Auth

- Add local login/register, demo accounts, onboarding, logout, forgotten-password demo, and upgrade demo.

## Phase 6: Feedback and Release

- Add global feedback button and local feedback storage.
- Add admin-style viewer, README, `.gitignore`, `.env.example`, Vercel config, GitHub/Vercel instructions, and preview deployment after authorization.
