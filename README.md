# Attendance & Training Tracker

## Overview
A POC web application built to replace a laggy Power Apps + SharePoint attendance tracker that hit the 5,000 row list view threshold. Built with modern tools on Azure's free tier.

## Problem
- Power Apps attendance tracker became slow due to SharePoint's 5,000 item limit
- Image uploads (training proof) were laggy due to base64 encoding through connectors
- No CI/CD pipeline — manual deployments

## Solution
- ASP.NET Core Web API with Clean Architecture
- SQLite database (no row limits, zero cost)
- Direct file upload for images (no base64 overhead)
- React + Vite frontend
- GitHub Actions CI/CD pipeline
- Azure App Service (F1 Free tier) with Bicep IaC

## Tech Stack
- Backend: ASP.NET Core 9, EF Core, SQLite
- Frontend: React, Vite
- Infrastructure: Azure App Service, Bicep
- CI/CD: GitHub Actions

## Running Locally
1. Start the API: `dotnet run --project backend/src/API`
2. Start the frontend: `npm run dev`
3. Open http://localhost:5173

Default admin account: `admin@attendance.local` / `Admin123!`

## Project Structure
- `backend/src/API/` — ASP.NET Core controllers, Program.cs
- `backend/src/Core/` — Entities, DTOs, interfaces (zero outbound dependencies)
- `backend/src/Infrastructure/` — EF Core, services, migrations
- `backend/tests/` — xUnit unit tests
- `src/` — React/Vite frontend
- `infra/` — Bicep infrastructure-as-code
- `.github/workflows/` — CI (`ci.yml`) and CD (`cd.yml`) pipelines

## Running Tests
```bash
dotnet test backend/AttendanceTracker.sln
```

## Phase Roadmap

### Completed
- **Phase 1** — Foundation: Clean Architecture scaffold, EF Core + SQLite, CI/CD pipeline, Bicep IaC
- **Phase 2** — Core features: ASP.NET Identity auth, clock in/out, employee management, training submissions with image upload
- **Phase 3** — Hardening: unit tests (29), CI gates CD, lint validation

### Upcoming
- **Phase 4** — Manager view: role-based UI, manager approval workflow for training submissions
- **Phase 5** — Production: migrate to Azure SQL, deployment slots, rate limiting on auth endpoints

## Known Limitations
- **Cold start**: F1 free tier has no always-on — first request after idle takes ~5–10 seconds
- **Single instance only**: SQLite is local to the app service instance; do not scale out horizontally
- **Default admin**: `admin@attendance.local` / `Admin123!` is seeded on first run — replace before any real production use
