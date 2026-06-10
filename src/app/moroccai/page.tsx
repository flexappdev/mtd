import Link from "next/link";
import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";

export const revalidate = 300;

export const metadata = {
  title: "MoroccAI",
  description: "Ask anything about Morocco. MoroccAI grounds answers in the MTD catalogue and links to bookable hotels.",
};

const CAPS: SectionTile[] = [
  { id: "trip-plan", title: "Plan my trip", subtitle: "Ask MoroccAI to draft a 7/10/14-day itinerary tuned to your tastes.", href: "/moroccai/chat?topic=trip-plan" },
  { id: "where-eat", title: "Where to eat", subtitle: "Tagine, fine dining, street food — local picks by city and budget.", href: "/moroccai/chat?topic=where-eat" },
  { id: "what-pack", title: "What to pack", subtitle: "Season + region + activity → a clean packing list with affiliate links.", href: "/moroccai/chat?topic=what-pack" },
  { id: "phrases", title: "Phrases & manners", subtitle: "Darija basics, bargaining etiquette, mosque dress codes.", href: "/moroccai/chat?topic=phrases" },
  { id: "transit", title: "Getting around", subtitle: "Train vs Supratours vs grand taxi vs rental — when to use what.", href: "/moroccai/chat?topic=transit" },
  { id: "ramadan", title: "Travelling during Ramadan", subtitle: "Opening hours, iftar plans, etiquette.", href: "/moroccai/chat?topic=ramadan" },
];

function MoroccAIFlowDiagram() {
  const T = {
    paper: "#0c0a09", paper2: "#1c1917", ink: "#fafaf9", muted: "#a8a29e",
    hairline: "#44403c", accent: "#c1272d", accentSoft: "rgba(193,39,45,0.18)",
  };
  const steps = [
    { id: "user",    label: "You ask",        sub: "any Morocco question",       x: 40  },
    { id: "chat",    label: "MoroccAI chat",  sub: "/moroccai/chat",             x: 220 },
    { id: "claude",  label: "Claude Sonnet",  sub: "4.6 · streaming",            x: 400 },
    { id: "catalog", label: "MTD Catalogue",  sub: "destinations / hotels / wiki", x: 590 },
    { id: "answer",  label: "Streaming answer", sub: "with bookable hotel links", x: 760 },
  ];
  return (
    <svg viewBox="0 0 980 140" width="100%" style={{ maxWidth: 980, fontFamily: "Inter, sans-serif" }} aria-label="MoroccAI flow">
      <defs>
        <marker id="arr" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 z" fill={T.ink} />
        </marker>
        <marker id="arr-a" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 z" fill={T.accent} />
        </marker>
      </defs>
      {steps.map((s, i) => {
        const isAccent = s.id === "claude";
        return (
          <g key={s.id}>
            <rect x={s.x} y={32} width={150} height={52} rx={8}
              fill={isAccent ? T.accentSoft : T.paper2}
              stroke={isAccent ? T.accent : T.hairline}
              strokeWidth={isAccent ? 2 : 1} />
            <text x={s.x + 75} y={55} textAnchor="middle" fontSize={13}
              fontWeight={isAccent ? 600 : 400} fill={isAccent ? T.accent : T.ink}>{s.label}</text>
            <text x={s.x + 75} y={73} textAnchor="middle" fontSize={10}
              fontFamily="'JetBrains Mono', monospace" fill={T.muted}>{s.sub}</text>
            {i < steps.length - 1 && (
              <line x1={s.x + 154} y1={58} x2={steps[i + 1].x - 4} y2={58}
                stroke={isAccent ? T.accent : T.ink} strokeWidth={isAccent ? 3 : 1.5}
                markerEnd={isAccent ? "url(#arr-a)" : "url(#arr)"} />
            )}
          </g>
        );
      })}
      <text x={490} y={122} textAnchor="middle"
        fontFamily="'Instrument Serif', Georgia, serif" fontStyle="italic"
        fontSize={13} fill={T.muted}>
        Every answer is grounded in the MTD catalogue — no hallucinated hotels.
      </text>
    </svg>
  );
}

export default function MoroccaiPage() {
  return (
    <div className="space-y-6">
      <div className="mx-4 mt-4 overflow-hidden rounded-lg border border-zinc-800 bg-[#0c0a09] p-4 sm:mx-8">
        <MoroccAIFlowDiagram />
      </div>
      <SectionPage
        crumb="MoroccAI"
        title="MoroccAI — the Morocco travel agent"
        tagline="Ask anything about Morocco. MoroccAI grounds answers in the MTD catalogue (destinations, hotels, sights, food, wiki, videos) and links you to bookable hotels."
        stats={[
          { label: "Knowledge", value: "MTD catalogue" },
          { label: "Model", value: "Claude Sonnet 4.6" },
        ]}
        tiles={CAPS}
      />
      <div className="px-8 pb-4">
        <Link
          href="/moroccai/chat"
          className="inline-flex items-center gap-2 rounded bg-red-700 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-red-600"
          style={{ textDecoration: "none" }}
        >
          ✦ Open MoroccAI chat →
        </Link>
      </div>
    </div>
  );
}
