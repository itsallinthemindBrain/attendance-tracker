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
- Infrastructure: Azure App Service, Blob Storage, Bicep
- CI/CD: GitHub Actions
- Tools: Claude Code, VS Code

## Running Locally
1. Start the API: `dotnet run --project backend/src/API`
2. Start the frontend: `npm run dev`
3. Open http://localhost:5173

## Project Structure
- backend/ — ASP.NET Core solution (API, Core, Infrastructure)
- src/ — React/Vite frontend
- infra/ — Bicep infrastructure-as-code
- .github/workflows/ — CI and CD pipelines
