import Link from "next/link";
import { CMS_COLLECTIONS, tryGetDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";

async function countCollection(name: string): Promise<number | null> {
  try {
    const db = await tryGetDb();
    if (!db) return null;
    return await db.collection(name).countDocuments({});
  } catch {
    return null;
  }
}

export default async function CmsHome() {
  const entries = Object.entries(CMS_COLLECTIONS) as Array<[
    keyof typeof CMS_COLLECTIONS,
    (typeof CMS_COLLECTIONS)[keyof typeof CMS_COLLECTIONS],
  ]>;
  const counts = await Promise.all(entries.map(([, cfg]) => countCollection(cfg.collection)));

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">CMS</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create, edit, and delete documents in the managed collections.
        </p>
      </header>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map(([key, cfg], i) => (
          <Link
            key={key}
            href={`/admin/cms/${key}`}
            className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/30"
          >
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="text-base font-medium">{cfg.label}</h2>
              <span className="text-xs tabular-nums text-muted-foreground">
                {counts[i] === null ? "—" : counts[i]}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{cfg.description}</p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {cfg.collection}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
