import Link from "next/link";
import { notFound } from "next/navigation";
import { CMS_COLLECTIONS, tryGetDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";

function summarise(doc: Record<string, unknown>): string {
  for (const key of ["title", "name", "slug", "id"]) {
    if (typeof doc[key] === "string" && doc[key]) return doc[key] as string;
  }
  return String(doc._id ?? "(no title)");
}

function isCmsKey(key: string): key is keyof typeof CMS_COLLECTIONS {
  return Object.prototype.hasOwnProperty.call(CMS_COLLECTIONS, key);
}

export default async function CmsCollectionListPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  if (!isCmsKey(key)) notFound();
  const cfg = CMS_COLLECTIONS[key];

  const db = await tryGetDb();
  const docs = db ? await db.collection(cfg.collection).find({}).limit(500).toArray() : [];

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <header>
        <Link href="/admin/cms" className="text-xs text-muted-foreground hover:text-foreground">
          ← CMS
        </Link>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{cfg.label}</h1>
        <p className="text-sm text-muted-foreground">
          {docs.length} document{docs.length === 1 ? "" : "s"} ·{" "}
          <span className="font-mono">{cfg.collection}</span>
        </p>
        {!db && (
          <p className="mt-2 text-xs text-amber-500">
            Mongo not connected — list is empty. Set MONGO_URI in .env.local.
          </p>
        )}
      </header>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Title</th>
              <th className="px-3 py-2 text-left font-medium">_id</th>
              <th className="px-3 py-2 text-left font-medium">Updated</th>
            </tr>
          </thead>
          <tbody>
            {docs.length === 0 && (
              <tr>
                <td colSpan={3} className="px-3 py-8 text-center text-xs text-muted-foreground">
                  No documents yet in this collection.
                </td>
              </tr>
            )}
            {docs.map((doc) => {
              const id = String(doc._id);
              return (
                <tr key={id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-3 py-2 font-medium">
                    {summarise(doc as Record<string, unknown>)}
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{id}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {typeof doc.updatedAt === "string"
                      ? doc.updatedAt.slice(0, 16).replace("T", " ")
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
