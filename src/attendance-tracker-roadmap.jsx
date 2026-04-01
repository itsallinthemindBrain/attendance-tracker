import { useState } from "react";

const phases = [
  {
    id: 1,
    title: "Foundation",
    duration: "Week 1–2",
    color: "#0ea5e9",
    accent: "#0284c7",
    icon: "🏗️",
    goal: "Project scaffolding, repo setup, CI/CD pipeline",
    tasks: [
      {
        name: "Create GitHub repo",
        detail: "itsallinthemindBrain/attendance-tracker",
        tag: "GitHub",
      },
      {
        name: "Scaffold ASP.NET Core Web API",
        detail: "dotnet new webapi with Clean Architecture structure",
        tag: "Backend",
      },
      {
        name: "Scaffold frontend",
        detail: "Blazor WASM or Razor Pages (your choice)",
        tag: "Frontend",
      },
      {
        name: "Setup CLAUDE.md",
        detail: "Project context for Claude Code in VS Code",
        tag: "Tooling",
      },
      {
        name: "GitHub Actions CI pipeline",
        detail: "Build → Test → Publish on every push to main",
        tag: "CI/CD",
      },
      {
        name: "Bicep IaC for Azure resources",
        detail: "App Service (F1 Free), Blob Storage (5 GB free tier)",
        tag: "Azure",
      },
    ],
  },
  {
    id: 2,
    title: "Core Backend",
    duration: "Week 3–4",
    color: "#8b5cf6",
    accent: "#7c3aed",
    icon: "⚙️",
    goal: "API endpoints for attendance & activity tracking",
    tasks: [
      {
        name: "Design database schema",
        detail:
          "Employees, AttendanceRecords, TrainingActivities, Attachments",
        tag: "Database",
      },
      {
        name: "Setup SQLite + EF Core",
        detail: "Code-first migrations, local DB file — zero cost, no server needed",
        tag: "Database",
      },
      {
        name: "Attendance API endpoints",
        detail: "POST /clock-in, POST /clock-out, GET /attendance/{id}",
        tag: "API",
      },
      {
        name: "Activity/Training API endpoints",
        detail:
          "POST /activities, GET /activities, PATCH /activities/{id}/status",
        tag: "API",
      },
      {
        name: "Image upload endpoint",
        detail: "POST /upload → local wwwroot/uploads (or Azure Blob 5GB free)",
        tag: "API",
      },
      {
        name: "Add Swagger/OpenAPI docs",
        detail: "Auto-generated API documentation for testing",
        tag: "API",
      },
    ],
  },
  {
    id: 3,
    title: "Frontend & UX",
    duration: "Week 5–6",
    color: "#f59e0b",
    accent: "#d97706",
    icon: "🎨",
    goal: "Build the user-facing interface",
    tasks: [
      {
        name: "Login / Auth page",
        detail: "Azure AD or simple JWT auth for POC",
        tag: "Auth",
      },
      {
        name: "Dashboard view",
        detail: "Today's attendance status, pending trainings summary",
        tag: "UI",
      },
      {
        name: "Attendance form",
        detail: "Clock in/out with timestamp and location (optional)",
        tag: "UI",
      },
      {
        name: "Training activity form",
        detail: "Activity details + JPG upload with preview",
        tag: "UI",
      },
      {
        name: "Activity list with status",
        detail: "Pending / Submitted / Approved states with filters",
        tag: "UI",
      },
      {
        name: "Manager approval view",
        detail: "Review submitted proofs, approve/reject with comments",
        tag: "UI",
      },
    ],
  },
  {
    id: 4,
    title: "Deploy & Polish",
    duration: "Week 7–8",
    color: "#10b981",
    accent: "#059669",
    icon: "🚀",
    goal: "Deploy to Azure Free tier with CI/CD",
    tasks: [
      {
        name: "CD pipeline via GitHub Actions",
        detail: "Auto-deploy to App Service F1 on merge to main",
        tag: "CI/CD",
      },
      {
        name: "Future: Deployment slots",
        detail: "Upgrade to Standard tier later for staging/prod swap",
        tag: "Azure",
      },
      {
        name: "Environment configs",
        detail: "Dev / Staging / Prod app settings and secrets",
        tag: "DevOps",
      },
      {
        name: "Health checks & logging",
        detail: "Built-in App Service logs + health endpoint",
        tag: "Ops",
      },
      {
        name: "Image compression middleware",
        detail: "Auto-compress uploaded images server-side",
        tag: "Perf",
      },
      {
        name: "README + architecture docs",
        detail: "Document the full solution for your portfolio",
        tag: "Docs",
      },
    ],
  },
];

const architecture = {
  layers: [
    {
      name: "Frontend",
      color: "#0ea5e9",
      items: ["Blazor WASM / Razor Pages", "Responsive UI", "Image Upload Component"],
    },
    {
      name: "API Layer",
      color: "#8b5cf6",
      items: ["ASP.NET Core Web API", "JWT Authentication", "Swagger Docs"],
    },
    {
      name: "Services",
      color: "#f59e0b",
      items: ["Attendance Service", "Training Service", "Blob Storage Service"],
    },
    {
      name: "Data & Storage",
      color: "#10b981",
      items: ["SQLite (EF Core)", "Local File / Blob Storage (5GB free)", "App Service Logs"],
    },
    {
      name: "Infrastructure",
      color: "#ef4444",
      items: [
        "Azure App Service (F1 Free)",
        "Bicep IaC",
        "GitHub Actions CI/CD",
      ],
    },
  ],
};

const tagColors = {
  GitHub: { bg: "#1a1a2e", text: "#e2e8f0" },
  Backend: { bg: "#1e1b4b", text: "#c4b5fd" },
  Frontend: { bg: "#172554", text: "#93c5fd" },
  Tooling: { bg: "#1c1917", text: "#fdba74" },
  "CI/CD": { bg: "#052e16", text: "#86efac" },
  Azure: { bg: "#0c4a6e", text: "#7dd3fc" },
  Database: { bg: "#3b0764", text: "#d8b4fe" },
  API: { bg: "#4a044e", text: "#f0abfc" },
  Auth: { bg: "#431407", text: "#fed7aa" },
  UI: { bg: "#713f12", text: "#fde68a" },
  DevOps: { bg: "#064e3b", text: "#6ee7b7" },
  Ops: { bg: "#1e3a5f", text: "#93c5fd" },
  Perf: { bg: "#7f1d1d", text: "#fca5a5" },
  Docs: { bg: "#1a1a2e", text: "#cbd5e1" },
};

function Tag({ label }) {
  const style = tagColors[label] || { bg: "#334155", text: "#e2e8f0" };
  return (
    <span
      style={{
        background: style.bg,
        color: style.text,
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "10px",
        fontWeight: 600,
        letterSpacing: "0.5px",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function PhaseCard({ phase, isActive, onClick }) {
  const active = isActive;
  return (
    <div
      onClick={onClick}
      style={{
        background: active
          ? `linear-gradient(135deg, ${phase.color}15, ${phase.color}08)`
          : "#0f0f17",
        border: `1px solid ${active ? phase.color + "60" : "#1e1e2e"}`,
        borderRadius: "12px",
        padding: "20px",
        cursor: "pointer",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {active && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "4px",
            height: "100%",
            background: phase.color,
            borderRadius: "4px 0 0 4px",
          }}
        />
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "24px" }}>{phase.icon}</span>
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: phase.color,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
              }}
            >
              Phase {phase.id}
            </div>
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                color: "#e2e8f0",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {phase.title}
            </div>
          </div>
        </div>
        <span
          style={{
            background: phase.color + "20",
            color: phase.color,
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 600,
          }}
        >
          {phase.duration}
        </span>
      </div>
      <p
        style={{
          color: "#94a3b8",
          fontSize: "13px",
          margin: "0 0 16px 0",
          paddingLeft: "34px",
        }}
      >
        {phase.goal}
      </p>
      {active && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            paddingLeft: "34px",
          }}
        >
          {phase.tasks.map((task, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                padding: "10px 12px",
                background: "#0a0a12",
                borderRadius: "8px",
                border: "1px solid #1a1a2e",
              }}
            >
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "4px",
                  border: `2px solid ${phase.color}50`,
                  flexShrink: 0,
                  marginTop: "1px",
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      color: "#e2e8f0",
                      fontSize: "13px",
                      fontWeight: 600,
                    }}
                  >
                    {task.name}
                  </span>
                  <Tag label={task.tag} />
                </div>
                <div
                  style={{
                    color: "#64748b",
                    fontSize: "12px",
                    marginTop: "3px",
                  }}
                >
                  {task.detail}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ArchDiagram() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {architecture.layers.map((layer, i) => (
        <div key={i}>
          <div
            style={{
              background: `linear-gradient(90deg, ${layer.color}18, transparent)`,
              border: `1px solid ${layer.color}30`,
              borderRadius: "10px",
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              style={{
                width: "120px",
                flexShrink: 0,
                fontSize: "12px",
                fontWeight: 700,
                color: layer.color,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {layer.name}
            </div>
            <div
              style={{
                display: "flex",
                gap: "8px",
                flexWrap: "wrap",
                flex: 1,
              }}
            >
              {layer.items.map((item, j) => (
                <span
                  key={j}
                  style={{
                    background: layer.color + "15",
                    color: "#cbd5e1",
                    padding: "5px 12px",
                    borderRadius: "6px",
                    fontSize: "12px",
                    fontWeight: 500,
                    border: `1px solid ${layer.color}20`,
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          {i < architecture.layers.length - 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "2px 0",
              }}
            >
              <div
                style={{
                  width: "2px",
                  height: "14px",
                  background: "linear-gradient(to bottom, #334155, #1e293b)",
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ComparisonTable() {
  const rows = [
    { metric: "5,000 row limit", powerApps: "Yes (SharePoint)", custom: "No limit (SQLite)" },
    { metric: "Image upload speed", powerApps: "Slow (base64 + connector)", custom: "Fast (direct file upload)" },
    { metric: "Offline support", powerApps: "Limited", custom: "PWA capable" },
    { metric: "Deployment", powerApps: "Manual publish", custom: "CI/CD via GitHub Actions" },
    { metric: "Cost", powerApps: "$20/user/month", custom: "Free (F1 + SQLite + Blob 5GB)" },
    { metric: "Customization", powerApps: "Low-code constraints", custom: "Full control" },
  ];

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "separate",
          borderSpacing: "0",
          fontSize: "13px",
        }}
      >
        <thead>
          <tr>
            {["", "Power Apps + SharePoint", "ASP.NET Core + Azure"].map(
              (h, i) => (
                <th
                  key={i}
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    color: i === 2 ? "#10b981" : i === 1 ? "#f59e0b" : "#94a3b8",
                    fontWeight: 700,
                    fontSize: "11px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    borderBottom: "1px solid #1e1e2e",
                    background: "#0a0a12",
                  }}
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td
                style={{
                  padding: "10px 14px",
                  color: "#cbd5e1",
                  fontWeight: 600,
                  borderBottom: "1px solid #111119",
                }}
              >
                {row.metric}
              </td>
              <td
                style={{
                  padding: "10px 14px",
                  color: "#f59e0b",
                  borderBottom: "1px solid #111119",
                }}
              >
                {row.powerApps}
              </td>
              <td
                style={{
                  padding: "10px 14px",
                  color: "#10b981",
                  borderBottom: "1px solid #111119",
                }}
              >
                {row.custom}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AttendanceTrackerRoadmap() {
  const [activePhase, setActivePhase] = useState(1);
  const [activeTab, setActiveTab] = useState("roadmap");

  const tabs = [
    { id: "roadmap", label: "Roadmap" },
    { id: "architecture", label: "Architecture" },
    { id: "comparison", label: "Why Migrate?" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#09090f",
        color: "#e2e8f0",
        fontFamily: "'DM Sans', sans-serif",
        padding: "32px 24px",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div style={{ maxWidth: "780px", margin: "0 auto 32px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#0ea5e9",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            POC Project Plan
          </span>
        </div>
        <h1
          style={{
            fontSize: "28px",
            fontWeight: 700,
            margin: "0 0 6px 0",
            background: "linear-gradient(135deg, #e2e8f0, #94a3b8)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.2,
          }}
        >
          Attendance & Training Tracker
        </h1>
        <p
          style={{
            color: "#64748b",
            fontSize: "14px",
            margin: 0,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          ASP.NET Core · SQLite · Azure App Service (Free) · GitHub Actions
        </p>
      </div>

      {/* Tabs */}
      <div style={{ maxWidth: "780px", margin: "0 auto 24px" }}>
        <div
          style={{
            display: "flex",
            gap: "4px",
            background: "#0f0f17",
            padding: "4px",
            borderRadius: "10px",
            border: "1px solid #1e1e2e",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: "10px 16px",
                background:
                  activeTab === tab.id
                    ? "linear-gradient(135deg, #1e293b, #0f172a)"
                    : "transparent",
                color: activeTab === tab.id ? "#e2e8f0" : "#64748b",
                border:
                  activeTab === tab.id
                    ? "1px solid #334155"
                    : "1px solid transparent",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s ease",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "780px", margin: "0 auto" }}>
        {activeTab === "roadmap" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {phases.map((phase) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                isActive={activePhase === phase.id}
                onClick={() =>
                  setActivePhase(activePhase === phase.id ? null : phase.id)
                }
              />
            ))}

            <div
              style={{
                marginTop: "12px",
                padding: "16px 20px",
                background: "linear-gradient(135deg, #10b98115, #10b98108)",
                border: "1px solid #10b98130",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#10b981",
                  marginBottom: "6px",
                }}
              >
                End Result
              </div>
              <div style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.6 }}>
                A fully deployed attendance & training tracker on Azure App
                Service (Free tier) with CI/CD, SQLite database, image uploads,
                and a clean architecture — ready to demo, add to your
                portfolio, and upgrade to paid tiers when needed.
              </div>
            </div>
          </div>
        )}

        {activeTab === "architecture" && (
          <div>
            <div
              style={{
                marginBottom: "20px",
                padding: "14px 18px",
                background: "#0f0f17",
                borderRadius: "10px",
                border: "1px solid #1e1e2e",
                fontSize: "13px",
                color: "#94a3b8",
                lineHeight: 1.6,
              }}
            >
              Clean layered architecture — each layer only talks to the one
              below it. Frontend calls the API, API uses services, services
              access data stores. Infrastructure is managed entirely through
              Bicep + GitHub Actions.
            </div>
            <ArchDiagram />

            <div
              style={{
                marginTop: "20px",
                padding: "16px 18px",
                background: "#0f0f17",
                borderRadius: "10px",
                border: "1px solid #1e1e2e",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "#8b5cf6",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                }}
              >
                Project Structure
              </div>
              <pre
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "12px",
                  color: "#94a3b8",
                  margin: 0,
                  lineHeight: 1.8,
                  overflowX: "auto",
                }}
              >
{`attendance-tracker/
├── src/
│   ├── API/                    # ASP.NET Core Web API
│   │   ├── Controllers/
│   │   ├── Middleware/
│   │   └── Program.cs
│   ├── Core/                   # Domain models & interfaces
│   │   ├── Entities/
│   │   ├── Interfaces/
│   │   └── DTOs/
│   ├── Infrastructure/         # EF Core, Blob Storage impl
│   │   ├── Data/
│   │   ├── Services/
│   │   └── Migrations/
│   └── Web/                    # Blazor / Razor Pages frontend
├── infra/
│   ├── main.bicep
│   ├── modules/
│   └── prod.bicepparam
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── cd.yml
├── CLAUDE.md
└── README.md`}
              </pre>
            </div>
          </div>
        )}

        {activeTab === "comparison" && (
          <div>
            <div
              style={{
                marginBottom: "20px",
                padding: "14px 18px",
                background: "#0f0f17",
                borderRadius: "10px",
                border: "1px solid #1e1e2e",
                fontSize: "13px",
                color: "#94a3b8",
                lineHeight: 1.6,
              }}
            >
              Here's why migrating from the current Power Apps + SharePoint
              setup to a custom ASP.NET Core solution solves the problems
              you've been experiencing.
            </div>
            <ComparisonTable />

            <div
              style={{
                marginTop: "20px",
                padding: "16px 18px",
                background: "linear-gradient(135deg, #ef444415, #ef444408)",
                border: "1px solid #ef444430",
                borderRadius: "12px",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#ef4444",
                  marginBottom: "6px",
                }}
              >
                The Core Problem
              </div>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: "13px",
                  lineHeight: 1.6,
                }}
              >
                Your current app hit SharePoint's 5,000 item list view
                threshold — that's a hard platform limitation. SQLite has no
                such constraint and handles your POC scale easily. Combined
                with local file storage for images, you eliminate the base64
                encoding overhead that causes upload lag — all at zero cost
                on Azure's Free tier.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
