import Link from "next/link";
import { tryGetDb, getDbName } from "@/lib/mongo";

export const dynamic = "force-dynamic";

export default async function AdminMongoPage() {
  const db = await tryGetDb();
  const dbName = getDbName();
  let cols: { name: string; count: number | null }[] = [];
  let err: string | undefined;

  if (!db) {
    err = "MONGO_URI not set or Mongo unreachable.";
  } else {
    try {
      const list = await db.listCollections({}, { nameOnly: true }).toArray();
      const names = list.map((c) => c.name).sort();
      const counts = await Promise.allSettled(
        names.map((n) => db.collection(n).countDocuments({})),
      );
      cols = names.map((name, i) => ({
        name,
        count: counts[i].status === "fulfilled" ? (counts[i] as PromiseFulfilledResult<number>).value : null,
      }));
    } catch (e) {
      err = e instanceof Error ? e.message : "Failed to list collections";
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <header>
        <Link href="/admin" className="text-xs text-muted-foreground hover:text-foreground">
          ← Admin
        </Link>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">Mongo</h1>
        <p className="text-sm text-muted-foreground">
          Database <span className="font-mono">{dbName}</span> · {cols.length} collection
          {cols.length === 1 ? "" : "s"}
        </p>
        {err && <p className="mt-2 text-xs text-amber-500">{err}</p>}
      </header>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Collection</th>
              <th className="px-3 py-2 text-right font-medium">Documents</th>
            </tr>
          </thead>
          <tbody>
            {cols.length === 0 && !err && (
              <tr>
                <td colSpan={2} className="px-3 py-6 text-center text-xs text-muted-foreground">
                  No collections yet.
                </td>
              </tr>
            )}
            {cols.map((c) => (
              <tr key={c.name} className="border-b border-border last:border-0">
                <td className="px-3 py-2 font-mono text-xs">{c.name}</td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {c.count === null ? "—" : c.count.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        Read-only listing. Document browser coming in a follow-up.
      </p>
    </div>
  );
}
