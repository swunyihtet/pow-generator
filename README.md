# 🚀 Proof of Work (PoW) Generator

**Transform your GitHub trajectory into a high-performance digital identity.**

PoW Generator is a cinematic, multi-tenant portfolio engine designed for developers who build in public. It treats your career as a series of **Verified Missions**, automating the extraction of your real-world output and presenting it in a "Restricted Access" cyberpunk aesthetic.

---

## 🕹️ Core Features

- **Multi-Tenant Protocol:** Supports dynamic `/:username` routing for unique, isolated professional dossiers.
- **GitHub Sync Engine:** One-click ingestion of repositories, star counts, and tech stacks via Supabase Edge Functions.
- **Identity Hub:** A secure `/admin` Command Center to curate your bio, career timeline, and project visibility.
- **Asset Sovereignty:** Direct native hosting for profile avatars and CVs via Supabase Storage.
- **Persistent Personalization:** Save your preferred "Overclock Mode" (aesthetic theme) to the database.
- **Automated Intelligence:** Real-time calculation of career statistics (Years of Mastery, Mission Count).

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite + Tailwind CSS + Framer Motion
- **Backend:** Supabase (Auth, Database, Edge Functions, Storage)
- **Deployment:** Vercel (Optimized for SPA Routing)

---

## 📡 Quick Start Guide

### 1. Database Setup (Supabase)
Run the migration scripts in the `supabase/migrations` directory to initialize the following tables:
- `profiles`, `portfolios`, `projects`, `experience`, `education`

### 2. Sync Engine Configuration
Deploy the `sync-github-repos` Edge Function and set the following secrets in Supabase:
- `GITHUB_TOKEN`: Your GitHub Personal Access Token (PAT).

### 3. Vercel Deployment
Import this repository into Vercel and add your Supabase credentials as environment variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 🛰️ Operational Status

**Status:** `STABLE // ALPHA_PROTOCOL_COMPLETE`
**Architect:** [Parvix AI](https://openclaw.ai)
