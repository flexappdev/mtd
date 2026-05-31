import Link from "next/link";
import { DESTINATIONS, HOTELS, LISTS, RESTAURANTS, SIGHTS } from "@/lib/mtd-v2/seed";
import { MOROCCAI_MODEL } from "@/lib/moroccai/system-prompt";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · MoroccAI",
};

export default function AdminMoroccaiPage() {
  const apiKeySet = !!process.env.ANTHROPIC_API_KEY;

  const catalogueSize =
    DESTINATIONS.length + HOTELS.length + SIGHTS.length + RESTAURANTS.length + LISTS.length;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">MoroccAI</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configuration and catalogue grounding for the in-house travel agent.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat
          label="API key"
          value={apiKeySet ? "set" : "missing"}
          ok={apiKeySet}
          subtitle={apiKeySet ? "ANTHROPIC_API_KEY present" : "Set ANTHROPIC_API_KEY in Vercel"}
        />
        <Stat label="Model" value={MOROCCAI_MODEL} ok={true} subtitle="Override via MOROCCAI_MODEL" />
        <Stat
          label="Catalogue items"
          value={catalogueSize.toLocaleString()}
          ok={true}
          subtitle={`${DESTINATIONS.length} dests · ${HOTELS.length} hotels · ${SIGHTS.length} sights · ${RESTAURANTS.length} restos · ${LISTS.length} lists`}
        />
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">Quick test</h2>
        <p className="text-sm text-muted-foreground">
          Open the chat with a topic deep-link to verify a stream completes end-to-end.
        </p>
        <ul className="space-y-1 text-sm">
          <li>
            <Link
              href="/moroccai/chat?topic=trip-plan"
              className="text-emerald-600 underline dark:text-emerald-400"
            >
              /moroccai/chat?topic=trip-plan
            </Link>
          </li>
          <li>
            <Link
              href="/moroccai/chat?dest=marrakech"
              className="text-emerald-600 underline dark:text-emerald-400"
            >
              /moroccai/chat?dest=marrakech
            </Link>
          </li>
          <li>
            <Link
              href="/moroccai/chat?region=sahara"
              className="text-emerald-600 underline dark:text-emerald-400"
            >
              /moroccai/chat?region=sahara
            </Link>
          </li>
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-sm font-medium text-muted-foreground">Endpoint</h2>
        <p className="text-sm">
          <code className="rounded bg-muted/40 px-2 py-1 font-mono text-xs">
            POST /api/moroccai/stream
          </code>{" "}
          (Edge runtime). Body: <code className="font-mono text-xs">{`{ messages, dest?, region?, topic? }`}</code>.
        </p>
        <p className="text-sm text-muted-foreground">
          The catalogue system prompt block is sent with{" "}
          <code className="font-mono text-xs">cache_control: ephemeral</code> so multi-turn
          conversations share the same cached context.
        </p>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  ok,
  subtitle,
}: {
  label: string;
  value: string | number;
  ok: boolean;
  subtitle?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <span
          className={
            "rounded-full px-2 py-0.5 text-[10px] font-medium " +
            (ok
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400")
          }
        >
          {ok ? "OK" : "Check"}
        </span>
      </div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
      {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
