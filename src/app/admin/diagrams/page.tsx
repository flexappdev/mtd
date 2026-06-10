import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Diagrams",
  description: "Editorial system diagrams for the MTD codebase.",
};

// MTD dark-mode tokens — mirrors the abc-diagrams style guide but swaps
// the ABC teal accent for MTD's emerald #10b981.
const T = {
  paper: "#0c0a09",
  paper2: "#1c1917",
  ink: "#fafaf9",
  ink90: "#e7e5e4",
  muted: "#a8a29e",
  hairline: "#44403c",
  hairlineStrong: "#57534e",
  accent: "#10b981",
  accentSoft: "rgba(16, 185, 129, 0.18)",
  accentInk: "#0c0a09",
};

type SectionProps = {
  num: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  callout?: string;
};

function Section({ num, title, subtitle, children, callout }: SectionProps) {
  return (
    <section className="rounded-lg border border-zinc-800 bg-[#1c1917] p-6">
      <header className="mb-6 flex items-baseline justify-between gap-4">
        <div>
          <div className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">
            Diagram {num}
          </div>
          <h2 className="mt-1 text-2xl font-normal text-zinc-100" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
            {title}
          </h2>
          <p className="mt-1 text-xs text-zinc-400">{subtitle}</p>
        </div>
        {callout && (
          <p
            className="hidden max-w-xs text-sm italic text-zinc-300 sm:block"
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            “{callout}”
          </p>
        )}
      </header>
      <div className="overflow-x-auto">{children}</div>
    </section>
  );
}

function Arrowhead() {
  return (
    <defs>
      <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M0 0 L8 4 L0 8 z" fill={T.ink} />
      </marker>
      <marker id="arrow-accent" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
        <path d="M0 0 L8 4 L0 8 z" fill={T.accent} />
      </marker>
    </defs>
  );
}

function ArchitectureDiagram() {
  return (
    <svg viewBox="0 0 960 360" width="100%" style={{ maxWidth: 960, fontFamily: "Inter, sans-serif" }} aria-label="MTD architecture">
      <Arrowhead />
      {/* Browser */}
      <g>
        <rect x="40" y="160" width="120" height="48" rx="8" fill="none" stroke={T.ink} strokeWidth="2" />
        <text x="100" y="184" textAnchor="middle" fontSize="14" fill={T.ink}>Browser</text>
        <text x="100" y="200" textAnchor="middle" fontSize="11" fill={T.muted}>moroccotopdestinations.com</text>
      </g>
      {/* proxy.ts */}
      <g>
        <rect x="220" y="160" width="120" height="48" rx="8" fill={T.accentSoft} stroke={T.accent} strokeWidth="2" />
        <text x="280" y="184" textAnchor="middle" fontSize="14" fontWeight="600" fill={T.accent}>proxy.ts</text>
        <text x="280" y="200" textAnchor="middle" fontSize="11" fill={T.muted} fontFamily="'JetBrains Mono', monospace">middleware</text>
      </g>
      {/* App router */}
      <g>
        <rect x="400" y="160" width="160" height="48" rx="8" fill="none" stroke={T.ink} strokeWidth="2" />
        <text x="480" y="184" textAnchor="middle" fontSize="14" fill={T.ink}>Next 16 App Router</text>
        <text x="480" y="200" textAnchor="middle" fontSize="11" fill={T.muted}>51 routes</text>
      </g>
      {/* Supabase */}
      <g>
        <rect x="620" y="40" width="160" height="48" rx="8" fill="none" stroke={T.ink} strokeWidth="2" />
        <text x="700" y="64" textAnchor="middle" fontSize="14" fill={T.ink}>Supabase</text>
        <text x="700" y="80" textAnchor="middle" fontSize="11" fill={T.muted} fontFamily="'JetBrains Mono', monospace">tciqizkis…</text>
      </g>
      {/* MongoDB */}
      <g>
        <rect x="620" y="160" width="160" height="48" rx="8" fill="none" stroke={T.ink} strokeWidth="2" />
        <text x="700" y="184" textAnchor="middle" fontSize="14" fill={T.ink}>MongoDB Atlas</text>
        <text x="700" y="200" textAnchor="middle" fontSize="11" fill={T.muted} fontFamily="'JetBrains Mono', monospace">cluster0 · MSTRAVELDB</text>
      </g>
      {/* S3 */}
      <g>
        <rect x="620" y="280" width="160" height="48" rx="8" fill="none" stroke={T.ink} strokeWidth="2" />
        <text x="700" y="304" textAnchor="middle" fontSize="14" fill={T.ink}>S3 (com27)</text>
        <text x="700" y="320" textAnchor="middle" fontSize="11" fill={T.muted}>media assets</text>
      </g>
      {/* Vercel host group */}
      <g>
        <rect x="200" y="120" width="380" height="120" rx="8" fill="none" stroke={T.hairline} strokeWidth="1" strokeDasharray="4 4" />
        <text x="220" y="138" fontSize="10" fontFamily="'JetBrains Mono', monospace" fill={T.muted}>VERCEL · mtd-rose.vercel.app</text>
      </g>
      {/* Arrows */}
      <line x1="160" y1="184" x2="216" y2="184" stroke={T.ink} strokeWidth="2" markerEnd="url(#arrow)" />
      <line x1="340" y1="184" x2="396" y2="184" stroke={T.accent} strokeWidth="4" markerEnd="url(#arrow-accent)" />
      <line x1="560" y1="180" x2="616" y2="80" stroke={T.ink} strokeWidth="2" markerEnd="url(#arrow)" />
      <line x1="560" y1="184" x2="616" y2="184" stroke={T.ink} strokeWidth="2" markerEnd="url(#arrow)" />
      <line x1="560" y1="200" x2="616" y2="304" stroke={T.ink} strokeWidth="2" markerEnd="url(#arrow)" />
      {/* Annotation */}
      <g>
        <path d="M 280 156 C 320 120, 360 96, 440 80" stroke={T.muted} strokeWidth="1" fill="none" strokeDasharray="2 4" />
        <text x="448" y="80" fontFamily="'Instrument Serif', Georgia, serif" fontStyle="italic" fontSize="14" fill={T.ink90}>
          The gate.
        </text>
      </g>
    </svg>
  );
}

function AuthFlowDiagram() {
  return (
    <svg viewBox="0 0 960 400" width="100%" style={{ maxWidth: 960, fontFamily: "Inter, sans-serif" }} aria-label="MTD auth flow">
      <Arrowhead />
      {/* Swimlanes */}
      <g>
        <line x1="160" y1="40" x2="160" y2="360" stroke={T.hairline} strokeWidth="1" />
        <line x1="400" y1="40" x2="400" y2="360" stroke={T.hairline} strokeWidth="1" />
        <line x1="640" y1="40" x2="640" y2="360" stroke={T.hairline} strokeWidth="1" />
        <text x="80" y="32" fontSize="11" fontFamily="'JetBrains Mono', monospace" textAnchor="middle" fill={T.muted}>Browser</text>
        <text x="280" y="32" fontSize="11" fontFamily="'JetBrains Mono', monospace" textAnchor="middle" fill={T.muted}>proxy.ts</text>
        <text x="520" y="32" fontSize="11" fontFamily="'JetBrains Mono', monospace" textAnchor="middle" fill={T.muted}>Supabase</text>
        <text x="800" y="32" fontSize="11" fontFamily="'JetBrains Mono', monospace" textAnchor="middle" fill={T.muted}>App Router</text>
      </g>
      {/* Steps */}
      <g>
        <rect x="20" y="64" width="120" height="36" rx="8" fill="none" stroke={T.ink} strokeWidth="2" />
        <text x="80" y="86" textAnchor="middle" fontSize="13" fill={T.ink}>GET /admin</text>
      </g>
      <line x1="140" y1="82" x2="216" y2="82" stroke={T.ink} strokeWidth="2" markerEnd="url(#arrow)" />
      <g>
        <rect x="220" y="64" width="160" height="36" rx="8" fill="none" stroke={T.ink} strokeWidth="2" />
        <text x="300" y="86" textAnchor="middle" fontSize="13" fill={T.ink}>updateSession()</text>
      </g>
      <line x1="380" y1="82" x2="456" y2="82" stroke={T.ink} strokeWidth="2" markerEnd="url(#arrow)" />
      <g>
        <rect x="460" y="64" width="160" height="36" rx="8" fill="none" stroke={T.ink} strokeWidth="2" />
        <text x="540" y="86" textAnchor="middle" fontSize="13" fill={T.ink}>auth.getSession()</text>
      </g>
      <line x1="540" y1="100" x2="540" y2="148" stroke={T.ink} strokeWidth="2" markerEnd="url(#arrow)" />
      <g>
        <rect x="460" y="148" width="160" height="36" rx="8" fill={T.accentSoft} stroke={T.accent} strokeWidth="2" />
        <text x="540" y="170" textAnchor="middle" fontSize="13" fontWeight="600" fill={T.accent}>email ∈ ALLOWED?</text>
      </g>
      {/* Branch yes */}
      <line x1="620" y1="166" x2="696" y2="166" stroke={T.accent} strokeWidth="4" markerEnd="url(#arrow-accent)" />
      <g>
        <rect x="700" y="148" width="160" height="36" rx="8" fill={T.accentSoft} stroke={T.accent} strokeWidth="2" />
        <text x="780" y="170" textAnchor="middle" fontSize="13" fill={T.accent}>render /admin</text>
      </g>
      {/* Branch no */}
      <line x1="460" y1="166" x2="384" y2="166" stroke={T.ink} strokeWidth="2" markerEnd="url(#arrow)" />
      <g>
        <rect x="220" y="148" width="160" height="36" rx="8" fill="none" stroke={T.ink} strokeWidth="2" />
        <text x="300" y="170" textAnchor="middle" fontSize="13" fill={T.ink}>307 → /login</text>
      </g>
      <line x1="220" y1="166" x2="144" y2="166" stroke={T.ink} strokeWidth="2" markerEnd="url(#arrow)" />
      <g>
        <rect x="20" y="148" width="120" height="36" rx="8" fill="none" stroke={T.ink} strokeWidth="2" />
        <text x="80" y="170" textAnchor="middle" fontSize="13" fill={T.ink}>Login form</text>
      </g>
      {/* env guard caption */}
      <g>
        <path d="M 300 184 C 240 220, 200 240, 160 264" stroke={T.muted} strokeWidth="1" fill="none" strokeDasharray="2 4" />
        <text x="40" y="284" fontFamily="'Instrument Serif', Georgia, serif" fontStyle="italic" fontSize="14" fill={T.ink90}>
          When env is empty, the gate
        </text>
        <text x="40" y="304" fontFamily="'Instrument Serif', Georgia, serif" fontStyle="italic" fontSize="14" fill={T.ink90}>
          returns 503 instead of 500.
        </text>
      </g>
      {/* dev bypass */}
      <g>
        <rect x="220" y="320" width="160" height="32" rx="8" fill="none" stroke={T.hairline} strokeWidth="1" strokeDasharray="2 4" />
        <text x="300" y="340" textAnchor="middle" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill={T.muted}>mtd-dev-bypass=1 (dev only)</text>
      </g>
    </svg>
  );
}

function RouteMapDiagram() {
  const groups = [
    { id: "public", label: "Public", count: 33, x: 80, color: T.ink, fill: "none" },
    { id: "admin", label: "Admin (gated)", count: 6, x: 320, color: T.accent, fill: T.accentSoft },
    { id: "api", label: "API", count: 8, x: 560, color: T.ink, fill: "none" },
    { id: "auth", label: "Auth", count: 4, x: 800, color: T.ink, fill: "none" },
  ];
  const examples: Record<string, string[]> = {
    public: ["/", "/places/cities", "/lists/top100", "/wiki", "/moroccai", "/morocco/[slug]"],
    admin: ["/admin", "/admin/cms", "/admin/cms/[key]", "/admin/mongo", "/admin/s3", "/admin/diagrams"],
    api: ["/api/mtd/health", "/api/mtd/destinations", "/api/morocco/[slug]", "/api/videos", "/api/apps", "/api/github", "/api/prompts", "/api/morocco"],
    auth: ["/login", "/auth/callback", "/auth/error", "/_not-found"],
  };
  return (
    <svg viewBox="0 0 960 400" width="100%" style={{ maxWidth: 960, fontFamily: "Inter, sans-serif" }} aria-label="MTD route map">
      {/* Root */}
      <g>
        <rect x="400" y="40" width="160" height="40" rx="8" fill="none" stroke={T.ink} strokeWidth="2" />
        <text x="480" y="64" textAnchor="middle" fontSize="14" fill={T.ink}>moroccotopdestinations.com</text>
      </g>
      {groups.map((g) => (
        <g key={g.id}>
          <line x1="480" y1="80" x2={g.x + 80} y2="120" stroke={T.hairline} strokeWidth="1" />
          <rect x={g.x} y="120" width="160" height="40" rx="8" fill={g.fill} stroke={g.color} strokeWidth="2" />
          <text x={g.x + 80} y="138" textAnchor="middle" fontSize="13" fontWeight="600" fill={g.color}>{g.label}</text>
          <text x={g.x + 80} y="152" textAnchor="middle" fontSize="11" fill={T.muted} fontFamily="'JetBrains Mono', monospace">{g.count} routes</text>
          {examples[g.id].map((ex, i) => (
            <text key={ex} x={g.x + 80} y={184 + i * 18} textAnchor="middle" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill={T.muted}>
              {ex}
            </text>
          ))}
        </g>
      ))}
      {/* Annotation */}
      <g>
        <path d="M 400 140 C 380 220, 360 280, 320 340" stroke={T.muted} strokeWidth="1" fill="none" strokeDasharray="2 4" />
        <text x="40" y="376" fontFamily="'Instrument Serif', Georgia, serif" fontStyle="italic" fontSize="14" fill={T.ink90}>
          Only the admin branch carries the accent — the gate is the point.
        </text>
      </g>
    </svg>
  );
}

function DataModelDiagram() {
  const cols = [
    { id: "mtd_destinations", x: 40, y: 56, refs: ["region"], count: 14 },
    { id: "mtd_regions", x: 40, y: 200, refs: [], count: 5 },
    { id: "mtd_hotels", x: 280, y: 40, refs: ["dest"], count: 20 },
    { id: "mtd_sights", x: 280, y: 120, refs: ["dest"], count: 20 },
    { id: "mtd_restaurants", x: 280, y: 200, refs: ["dest"], count: 9 },
    { id: "mtd_videos", x: 280, y: 280, refs: ["dest"], count: 12 },
    { id: "mtd_lists", x: 560, y: 40, refs: [], count: 18 },
    { id: "mtd_wiki", x: 560, y: 120, refs: ["dest?"], count: 8 },
    { id: "mtd_guides", x: 560, y: 200, refs: [], count: 10 },
  ];
  return (
    <svg viewBox="0 0 800 360" width="100%" style={{ maxWidth: 800, fontFamily: "Inter, sans-serif" }} aria-label="MTD data model">
      <Arrowhead />
      {cols.map((c) => {
        const isAccent = c.id === "mtd_destinations";
        return (
          <g key={c.id}>
            <rect
              x={c.x}
              y={c.y}
              width="200"
              height="56"
              rx="8"
              fill={isAccent ? T.accentSoft : "none"}
              stroke={isAccent ? T.accent : T.ink}
              strokeWidth="2"
            />
            <text x={c.x + 16} y={c.y + 24} fontSize="13" fontFamily="'JetBrains Mono', monospace" fontWeight={isAccent ? 600 : 400} fill={isAccent ? T.accent : T.ink}>
              {c.id}
            </text>
            <text x={c.x + 16} y={c.y + 44} fontSize="11" fill={T.muted}>
              {c.count} seed docs{c.refs.length ? ` · refs ${c.refs.join(", ")}` : ""}
            </text>
          </g>
        );
      })}
      {/* Lines from destinations to dependent collections */}
      <line x1="240" y1="84" x2="276" y2="68" stroke={T.accent} strokeWidth="2" markerEnd="url(#arrow-accent)" />
      <line x1="240" y1="84" x2="276" y2="148" stroke={T.accent} strokeWidth="2" markerEnd="url(#arrow-accent)" />
      <line x1="240" y1="84" x2="276" y2="228" stroke={T.accent} strokeWidth="2" markerEnd="url(#arrow-accent)" />
      <line x1="240" y1="84" x2="276" y2="308" stroke={T.accent} strokeWidth="2" markerEnd="url(#arrow-accent)" />
      {/* Region link */}
      <line x1="140" y1="200" x2="140" y2="116" stroke={T.ink} strokeWidth="2" markerEnd="url(#arrow)" />
      {/* Annotation */}
      <g>
        <path d="M 144 56 C 200 32, 280 28, 360 24" stroke={T.muted} strokeWidth="1" fill="none" strokeDasharray="2 4" />
        <text x="368" y="28" fontFamily="'Instrument Serif', Georgia, serif" fontStyle="italic" fontSize="14" fill={T.ink90}>
          Destinations is the spine.
        </text>
      </g>
    </svg>
  );
}

function DeployPipelineDiagram() {
  const steps = [
    { id: "edit", label: "Local edit", x: 40, accent: false },
    { id: "commit", label: "git commit", x: 200, accent: false },
    { id: "push", label: "git push", x: 360, accent: false },
    { id: "vercel", label: "vercel --prod", x: 520, accent: true },
    { id: "prod", label: "mtd-rose.vercel.app", x: 700, accent: true },
  ];
  return (
    <svg viewBox="0 0 960 240" width="100%" style={{ maxWidth: 960, fontFamily: "Inter, sans-serif" }} aria-label="MTD deploy pipeline">
      <Arrowhead />
      {/* Timeline */}
      <line x1="40" y1="120" x2="920" y2="120" stroke={T.hairline} strokeWidth="1" />
      {steps.map((s, i) => (
        <g key={s.id}>
          <circle cx={s.x + 60} cy="120" r="8" fill={s.accent ? T.accent : T.ink} />
          <rect
            x={s.x}
            y="64"
            width="120"
            height="40"
            rx="8"
            fill={s.accent ? T.accentSoft : "none"}
            stroke={s.accent ? T.accent : T.ink}
            strokeWidth="2"
          />
          <text
            x={s.x + 60}
            y="88"
            textAnchor="middle"
            fontSize="12"
            fontFamily={s.id === "edit" || s.id === "prod" ? "Inter" : "'JetBrains Mono', monospace"}
            fontWeight={s.accent ? 600 : 400}
            fill={s.accent ? T.accent : T.ink}
          >
            {s.label}
          </text>
          {i < steps.length - 1 && (
            <line
              x1={s.x + 124}
              y1="84"
              x2={steps[i + 1].x - 4}
              y2="84"
              stroke={T.ink}
              strokeWidth="2"
              markerEnd="url(#arrow)"
            />
          )}
          <text x={s.x + 60} y="148" textAnchor="middle" fontSize="10" fontFamily="'JetBrains Mono', monospace" fill={T.muted}>
            {s.id === "edit" && "src/**"}
            {s.id === "commit" && "877c1b0…"}
            {s.id === "push" && "flexappdev/mtd"}
            {s.id === "vercel" && "48s build"}
            {s.id === "prod" && "200 OK"}
          </text>
        </g>
      ))}
      {/* Annotation */}
      <g>
        <path d="M 580 84 C 560 200, 540 200, 520 200" stroke={T.muted} strokeWidth="1" fill="none" strokeDasharray="2 4" />
        <text x="120" y="210" fontFamily="'Instrument Serif', Georgia, serif" fontStyle="italic" fontSize="14" fill={T.ink90}>
          GitHub→Vercel auto-deploy isn't wired yet — CLI is the source of truth.
        </text>
      </g>
    </svg>
  );
}

function CodebaseDiagram() {
  return (
    <svg viewBox="0 0 960 380" width="100%" style={{ maxWidth: 960, fontFamily: "Inter, sans-serif" }} aria-label="MTD codebase layout">
      <Arrowhead />
      {/* src container */}
      <rect x="40" y="40" width="880" height="320" rx="8" fill="none" stroke={T.hairline} strokeWidth="1" strokeDasharray="4 4" />
      <text x="56" y="60" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill={T.muted}>src/</text>
      {/* app/ */}
      <g>
        <rect x="64" y="80" width="240" height="120" rx="8" fill={T.accentSoft} stroke={T.accent} strokeWidth="2" />
        <text x="76" y="100" fontSize="13" fontFamily="'JetBrains Mono', monospace" fontWeight="600" fill={T.accent}>app/</text>
        <text x="76" y="120" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill={T.ink90}>(public)/places /lists /wiki</text>
        <text x="76" y="136" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill={T.ink90}>     /media /guides /moroccai</text>
        <text x="76" y="156" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill={T.ink90}>(admin)/admin/{`{cms,mongo,s3,diagrams}`}</text>
        <text x="76" y="172" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill={T.ink90}>(api)/api/mtd /api/morocco</text>
        <text x="76" y="188" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill={T.ink90}>(auth)/login /auth/{`{callback,error}`}</text>
      </g>
      {/* components */}
      <g>
        <rect x="320" y="80" width="240" height="120" rx="8" fill="none" stroke={T.ink} strokeWidth="2" />
        <text x="332" y="100" fontSize="13" fontFamily="'JetBrains Mono', monospace" fontWeight="500" fill={T.ink}>components/</text>
        <text x="332" y="124" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill={T.ink90}>v2/FrontShellV2.tsx</text>
        <text x="332" y="140" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill={T.ink90}>v2/FrontHomeV2.tsx</text>
        <text x="332" y="156" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill={T.ink90}>v2/SectionPage.tsx ← shared</text>
        <text x="332" y="172" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill={T.ink90}>admin/AdminNav.tsx</text>
        <text x="332" y="188" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill={T.ink90}>ui/* (shadcn)</text>
      </g>
      {/* lib */}
      <g>
        <rect x="576" y="80" width="320" height="120" rx="8" fill="none" stroke={T.ink} strokeWidth="2" />
        <text x="588" y="100" fontSize="13" fontFamily="'JetBrains Mono', monospace" fontWeight="500" fill={T.ink}>lib/</text>
        <text x="588" y="124" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill={T.ink90}>supabase/{`{client,server,middleware}`}.ts</text>
        <text x="588" y="140" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill={T.ink90}>mongo.ts (COLLECTIONS + CMS_COLLECTIONS)</text>
        <text x="588" y="156" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill={T.ink90}>mtd-v2/seed.ts (REGIONS, DESTINATIONS…)</text>
        <text x="588" y="172" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill={T.ink90}>app-config.ts (APP, DEV_BYPASS_COOKIE)</text>
        <text x="588" y="188" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill={T.ink90}>fetchers.ts (shared FAD reads)</text>
      </g>
      {/* proxy + layout */}
      <g>
        <rect x="64" y="240" width="240" height="56" rx="8" fill="none" stroke={T.ink} strokeWidth="2" />
        <text x="76" y="262" fontSize="13" fontFamily="'JetBrains Mono', monospace" fontWeight="500" fill={T.ink}>proxy.ts</text>
        <text x="76" y="280" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill={T.muted}>Next 16 — was middleware.ts</text>
      </g>
      <g>
        <rect x="320" y="240" width="240" height="56" rx="8" fill="none" stroke={T.ink} strokeWidth="2" />
        <text x="332" y="262" fontSize="13" fontFamily="'JetBrains Mono', monospace" fontWeight="500" fill={T.ink}>app/layout.tsx</text>
        <text x="332" y="280" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill={T.muted}>FrontHeaderV2 + StickyFooter</text>
      </g>
      <g>
        <rect x="576" y="240" width="320" height="56" rx="8" fill="none" stroke={T.ink} strokeWidth="2" />
        <text x="588" y="262" fontSize="13" fontFamily="'JetBrains Mono', monospace" fontWeight="500" fill={T.ink}>scripts/</text>
        <text x="588" y="280" fontSize="11" fontFamily="'JetBrains Mono', monospace" fill={T.muted}>sync-env.sh · seed-mongo.mjs</text>
      </g>
      {/* Arrow proxy → app */}
      <line x1="184" y1="240" x2="184" y2="204" stroke={T.accent} strokeWidth="2" markerEnd="url(#arrow-accent)" />
      {/* annotation */}
      <g>
        <path d="M 184 240 C 220 320, 280 340, 360 348" stroke={T.muted} strokeWidth="1" fill="none" strokeDasharray="2 4" />
        <text x="368" y="352" fontFamily="'Instrument Serif', Georgia, serif" fontStyle="italic" fontSize="14" fill={T.ink90}>
          Everything routes through proxy first.
        </text>
      </g>
    </svg>
  );
}

function RegionsTreeDiagram() {
  const regions = [
    { id: "imperial",      name: "Imperial Cities",   dests: ["Marrakech", "Fes", "Rabat", "Meknes"],                  x: 40  },
    { id: "coast",         name: "Atlantic Coast",    dests: ["Casablanca", "Essaouira", "Agadir"],                    x: 210 },
    { id: "atlas",         name: "Atlas & Mountains", dests: ["Atlas Mts", "Ouarzazate", "Aït Benhaddou"],             x: 380 },
    { id: "sahara",        name: "Sahara & Desert",   dests: ["Merzouga"],                                             x: 550 },
    { id: "mediterranean", name: "Mediterranean",     dests: ["Chefchaouen", "Tangier", "Tetouan"],                    x: 680 },
  ];
  const W = 160;
  return (
    <svg viewBox="0 0 880 340" width="100%" style={{ maxWidth: 880, fontFamily: "Inter, sans-serif" }} aria-label="Morocco regions tree">
      <Arrowhead />
      {/* Root */}
      <rect x={340} y={16} width={200} height={40} rx={8} fill={T.accentSoft} stroke={T.accent} strokeWidth={2} />
      <text x={440} y={40} textAnchor="middle" fontSize={13} fontWeight={600} fill={T.accent}>Morocco</text>
      <text x={440} y={52} textAnchor="middle" fontSize={10} fontFamily="'JetBrains Mono', monospace" fill={T.muted}>14 destinations</text>
      {/* Regions */}
      {regions.map((r) => {
        const cx = r.x + W / 2;
        return (
          <g key={r.id}>
            <line x1={440} y1={56} x2={cx} y2={96} stroke={T.hairline} strokeWidth={1} />
            <rect x={r.x} y={96} width={W} height={40} rx={8} fill={T.paper2} stroke={T.ink} strokeWidth={1.5} />
            <text x={cx} y={114} textAnchor="middle" fontSize={11} fontWeight={600} fill={T.ink}>{r.name}</text>
            <text x={cx} y={128} textAnchor="middle" fontSize={10} fontFamily="'JetBrains Mono', monospace" fill={T.muted}>{r.dests.length} dests</text>
            {/* Destinations */}
            {r.dests.map((d, i) => {
              const dy = 160 + i * 44;
              return (
                <g key={d}>
                  <line x1={cx} y1={136} x2={cx} y2={dy} stroke={T.hairline} strokeWidth={1} strokeDasharray="2 3" />
                  <rect x={r.x + 8} y={dy} width={W - 16} height={32} rx={6} fill="none" stroke={T.hairlineStrong} strokeWidth={1} />
                  <text x={cx} y={dy + 20} textAnchor="middle" fontSize={11} fill={T.ink90}>{d}</text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

function ContentPipelineDiagram() {
  const steps = [
    { id: "prompts",  label: "build-mtd-prompts",  sub: "42 editorial prompts",       accent: false },
    { id: "runware",  label: "Runware FLUX",        sub: "runware:100@1 · 1024×1024",  accent: true  },
    { id: "png",      label: "~/IMAGES/2026/",      sub: "mtd-{cat}-{slug}.png",       accent: false },
    { id: "s3",       label: "S3 com27",            sub: "mtd/images/{cat}/{slug}.webp", accent: false },
    { id: "seed",     label: "seed.ts patch",       sub: "image: 's3://…'",            accent: false },
    { id: "vercel",   label: "next build",          sub: "real photography in prod",   accent: true  },
  ];
  return (
    <svg viewBox="0 0 960 200" width="100%" style={{ maxWidth: 960, fontFamily: "Inter, sans-serif" }} aria-label="MTD content pipeline">
      <Arrowhead />
      {steps.map((s, i) => {
        const x = 20 + i * 160;
        return (
          <g key={s.id}>
            <rect x={x} y={60} width={140} height={52} rx={8}
              fill={s.accent ? T.accentSoft : T.paper2}
              stroke={s.accent ? T.accent : T.hairline}
              strokeWidth={s.accent ? 2 : 1} />
            <text x={x + 70} y={84} textAnchor="middle" fontSize={11}
              fontFamily="'JetBrains Mono', monospace" fontWeight={s.accent ? 600 : 400}
              fill={s.accent ? T.accent : T.ink}>{s.label}</text>
            <text x={x + 70} y={100} textAnchor="middle" fontSize={10} fill={T.muted}>{s.sub}</text>
            {i < steps.length - 1 && (
              <line x1={x + 144} y1={86} x2={x + 160 - 4} y2={86}
                stroke={s.accent ? T.accent : T.ink} strokeWidth={1.5}
                markerEnd={s.accent ? "url(#arrow-accent)" : "url(#arrow)"} />
            )}
          </g>
        );
      })}
      <text x={480} y={148} textAnchor="middle"
        fontFamily="'Instrument Serif', Georgia, serif" fontStyle="italic"
        fontSize={13} fill={T.ink90}>
        Seed.ts is the single source of truth — S3 URLs drop in when scripts run.
      </text>
      {/* YouTube branch */}
      <text x={480} y={170} textAnchor="middle" fontSize={10}
        fontFamily="'JetBrains Mono', monospace" fill={T.muted}>
        wire-videos.mjs: YouTube API → videoId + embedUrl → seed.ts FEATURED_VIDEOS
      </text>
    </svg>
  );
}

export default function AdminDiagramsPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <Link href="/admin" className="text-xs text-muted-foreground hover:text-foreground">
          ← Admin
        </Link>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Codebase diagrams</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Editorial system diagrams for the MTD codebase. abc-diagrams aesthetic — emerald accent,
          dark mode, 4-grid SVG. Use these to onboard, explain, or audit.
        </p>
      </header>

      <Section
        num="01"
        title="System architecture"
        subtitle="Browser → proxy → App Router → Supabase / Mongo / S3, all behind one Vercel project."
        callout="One Next app, three remote dependencies."
      >
        <ArchitectureDiagram />
      </Section>

      <Section
        num="02"
        title="Auth flow"
        subtitle="Every /admin request passes through proxy.ts. Allowlist is mat@matsiems.com."
        callout="The gate fails closed when env is missing."
      >
        <AuthFlowDiagram />
      </Section>

      <Section
        num="03"
        title="Route map"
        subtitle="51 routes split four ways. Only the admin branch is gated."
        callout="Public is the surface area; admin is the levers."
      >
        <RouteMapDiagram />
      </Section>

      <Section
        num="04"
        title="Data model"
        subtitle="Nine Mongo collections in MSTRAVELDB. Destinations is the foreign-key spine."
        callout="If you change destinations, audit everything."
      >
        <DataModelDiagram />
      </Section>

      <Section
        num="05"
        title="Deploy pipeline"
        subtitle="Local edit → push → vercel CLI → prod. GitHub auto-deploy is not wired."
        callout="`vercel --prod` is the source of truth until the GitHub Login Connection is added."
      >
        <DeployPipelineDiagram />
      </Section>

      <Section
        num="06"
        title="Codebase layout"
        subtitle="src/ at a glance — what lives where, and how the pieces talk to each other."
        callout="Components stay dumb; lib stays pure; app holds the wiring."
      >
        <CodebaseDiagram />
      </Section>

      <Section
        num="07"
        title="Morocco regions & destinations"
        subtitle="5 regions — 14 destinations. Each destination belongs to exactly one region."
        callout="Imperial Cities carries the most traffic — and the most hotels."
      >
        <RegionsTreeDiagram />
      </Section>

      <Section
        num="08"
        title="Content pipeline"
        subtitle="How AI-generated images and YouTube embeds flow from scripts into seed.ts and S3."
        callout="Run build-mtd-prompts → gen-mtd-images → upload-mtd-images to activate real photography."
      >
        <ContentPipelineDiagram />
      </Section>

      <footer className="text-xs text-muted-foreground">
        Style: Cleverfox editorial diagrams (see <code className="rounded bg-zinc-800 px-1">~/.claude/skills/abc-diagrams</code>).
        Emerald accent <code className="rounded bg-zinc-800 px-1">#10b981</code>. 4-grid SVG. Dark theme.
        One italic Instrument Serif callout per diagram.
      </footer>
    </div>
  );
}
