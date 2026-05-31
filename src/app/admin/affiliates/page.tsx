import { GUIDES } from "@/lib/mtd-v2/seed";
import { AMAZON_TAG } from "@/components/v2/AffiliateLink";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · Affiliates",
};

type Network = {
  id: string;
  name: string;
  envVar: string;
  envValue: string | null;
  notes: string;
};

function envOrNull(name: string): string | null {
  const v = process.env[name];
  return v && v.length > 0 ? v : null;
}

export default function AdminAffiliatesPage() {
  const networks: Network[] = [
    {
      id: "amazon",
      name: "Amazon Associates UK",
      envVar: "NEXT_PUBLIC_AMAZON_TAG",
      envValue: envOrNull("NEXT_PUBLIC_AMAZON_TAG") ?? AMAZON_TAG,
      notes: `Tag fs08-21 used on every /guides/* card via <AffiliateLink>.`,
    },
    {
      id: "booking",
      name: "Booking.com",
      envVar: "NEXT_PUBLIC_BOOKING_AID",
      envValue: envOrNull("NEXT_PUBLIC_BOOKING_AID"),
      notes: "Falls back to non-referral search URLs if unset.",
    },
    {
      id: "expedia",
      name: "Expedia",
      envVar: "NEXT_PUBLIC_EXPEDIA_CAMREF",
      envValue: envOrNull("NEXT_PUBLIC_EXPEDIA_CAMREF"),
      notes: "Falls back to search URLs if unset.",
    },
    {
      id: "agoda",
      name: "Agoda",
      envVar: "NEXT_PUBLIC_AGODA_CID",
      envValue: envOrNull("NEXT_PUBLIC_AGODA_CID"),
      notes: "Falls back to search URLs if unset.",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Affiliates</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Networks we monetise through, and the env vars that switch tracking on.
          Full policy at <a href="/legal/affiliates" className="underline">/legal/affiliates</a>.
        </p>
      </header>

      <section className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Network</th>
              <th className="px-3 py-2 text-left font-medium">Env var</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
              <th className="px-3 py-2 text-left font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {networks.map((n) => (
              <tr key={n.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-medium">{n.name}</td>
                <td className="px-3 py-2 font-mono text-xs">{n.envVar}</td>
                <td className="px-3 py-2">
                  {n.envValue ? (
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      {n.envValue}
                    </span>
                  ) : (
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                      unset · fallback
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{n.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">
          Amazon catalogue ({GUIDES.length} products)
        </h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Title</th>
                <th className="px-3 py-2 text-left font-medium">Kind</th>
                <th className="px-3 py-2 text-left font-medium">ASIN</th>
                <th className="px-3 py-2 text-right font-medium">★</th>
                <th className="px-3 py-2 text-right font-medium">Reviews</th>
                <th className="px-3 py-2 text-right font-medium">Open</th>
              </tr>
            </thead>
            <tbody>
              {GUIDES.map((g) => (
                <tr key={g.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 font-medium">{g.title}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{g.kind}</td>
                  <td className="px-3 py-2 font-mono text-xs">{g.asin}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{g.rating}</td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {g.reviews.toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <a
                      href={`https://www.amazon.co.uk/dp/${g.asin}?tag=${AMAZON_TAG}`}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      Amazon →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
