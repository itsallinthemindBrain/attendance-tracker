# Attendance & Training Tracker

## Project Overview
POC replacement for a Power Apps + SharePoint attendance tracker that hit the 5,000 row limit. Built to solve real performance issues with image uploads and data queries.

## Tech Stack
- Backend: ASP.NET Core Web API (Clean Architecture)
- Database: SQLite with EF Core (code-first migrations)
- Image Storage: Local file storage (wwwroot/uploads)
- Frontend: React + Vite
- Hosting: Azure App Service F1 Free tier
- CI/CD: GitHub Actions
- IaC: Bicep

## Project Structure
- backend/ — .NET solution (API, Core, Infrastructure)
- src/ — React/Vite frontend

## Conventions
- Use tabs, single quotes, no semicolons, trailing commas (Prettier)
- Follow Clean Architecture: Core has zero outbound dependencies
- API controllers should be thin — business logic in services
- Use DTOs for API responses, never expose entities directly

## Frontend Standards
- Always build mobile-first responsive layouts
- Minimum supported viewport: 375px (iPhone SE)
- Use CSS media queries: mobile-first (min-width breakpoints)
- Breakpoints: 768px (tablet), 1024px (desktop)
- Minimum touch target size: 44px for all interactive elements
- Test layouts at 375px, 768px, and 1024px widths
- Sidebar must collapse to hamburger menu on mobile
- Cards and grids must stack vertically on mobile
- No horizontal scrolling on any screen size

## Current Phase
Phase 1 — Foundation (repo setup, scaffolding, CI/CD pipeline)
