import Link from "next/link";
import { HOTELS, findDestination } from "@/lib/mtd-v2/seed";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin · Bookings",
};

export default function AdminBookingsPage() {
  const sorted = [...HOTELS].sort((a, b) => b.rev30 - a.rev30);
  const totalRev = sorted.reduce((s, h) => s + h.rev30, 0);
  const totalClicks = sorted.reduce((s, h) => s + h.clicks30, 0);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Hotel partner performance over the last 30 days. Numbers come from{" "}
          <code>HOTELS</code> in <code>src/lib/mtd-v2/seed.ts</code> — promote to Mongo when ready.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat label="Revenue (30d)" value={`€${totalRev.toLocaleString()}`} />
        <Stat label="Clicks (30d)" value={totalClicks.toLocaleString()} />
        <Stat label="Hotels live" value={sorted.length} />
      </section>

      <section className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Rank</th>
              <th className="px-3 py-2 text-left font-medium">Hotel</th>
              <th className="px-3 py-2 text-left font-medium">City</th>
              <th className="px-3 py-2 text-right font-medium">Stars</th>
              <th className="px-3 py-2 text-right font-medium">Clicks/30d</th>
              <th className="px-3 py-2 text-right font-medium">Rev/30d</th>
              <th className="px-3 py-2 text-right font-medium">Booking</th>
              <th className="px-3 py-2 text-right font-medium">Expedia</th>
              <th className="px-3 py-2 text-right font-medium">Agoda</th>
              <th className="px-3 py-2 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((h, i) => (
              <tr key={h.id} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-mono text-xs text-muted-foreground">#{i + 1}</td>
                <td className="px-3 py-2 font-medium">{h.name}</td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {findDestination(h.dest)?.name ?? h.dest}
                </td>
                <td className="px-3 py-2 text-right">{"★".repeat(h.stars)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{h.clicks30.toLocaleString()}</td>
                <td className="px-3 py-2 text-right tabular-nums">€{h.rev30.toLocaleString()}</td>
                <td className="px-3 py-2 text-right tabular-nums">{rate(h.rates.booking)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{rate(h.rates.expedia)}</td>
                <td className="px-3 py-2 text-right tabular-nums">{rate(h.rates.agoda)}</td>
                <td className="px-3 py-2 text-right">
                  <Link
                    href={`/places/hotels#${h.id}`}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Open →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function rate(v: number | null): string {
  return v == null ? "—" : `€${v}`;
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}
