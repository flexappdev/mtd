import Link from "next/link";
import { Database, Cloud, FileText } from "lucide-react";
import { CMS_COLLECTIONS, tryGetDb, getDbName } from "@/lib/mongo";
import { APP } from "@/lib/app-config";

export const dynamic = "force-dynamic";

type CountRow = {
  label: string;
  key: string;
  count: number | null;
  href: string;
};

async function gatherCounts(): Promise<{
  rows: CountRow[];
  mongoOk: boolean;
  mongoErr?: string;
  dbName: string;
}> {
  const rows: CountRow[] = [];
  let mongoOk = false;
  let mongoErr: string | undefined;
  const dbName = getDbName();

  const db = await tryGetDb();
  if (!db) {
    mongoErr = "MONGO_URI not set or Mongo unreachable";
    return { rows, mongoOk, mongoErr, dbName };
  }
  mongoOk = true;
  const entries = Object.entries(CMS_COLLECTIONS) as Array<[
    keyof typeof CMS_COLLECTIONS,
    (typeof CMS_COLLECTIONS)[keyof typeof CMS_COLLECTIONS],
  ]>;
  const results = await Promise.allSettled(
    entries.map(([, cfg]) => db.collection(cfg.collection).countDocuments({})),
  );
  entries.forEach(([key, cfg], i) => {
    const r = results[i];
    rows.push({
      label: cfg.label,
      key: cfg.collection,
      count: r.status === "fulfilled" ? r.value : null,
      href: `/admin/cms/${key}`,
    });
  });
  return { rows, mongoOk, mongoErr, dbName };
}

export default async function AdminDashboard() {
  const { rows, mongoOk, mongoErr, dbName } = await gatherCounts();
  const s3Configured = !!(
    process.env.S3_ACCESS_KEY &&
    process.env.S3_SECRET_ACCESS_KEY &&
    process.env.S3_BUCKET_NAME
  );

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          CMS + Mongo + S3 management for {APP.name} · {APP.long}.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatusCard
          title="MongoDB"
          ok={mongoOk}
          subtitle={mongoOk ? `Connected · ${dbName}` : mongoErr ?? "Not connected"}
          icon={Database}
          href="/admin/mongo"
        />
        <StatusCard
          title="S3"
          ok={s3Configured}
          subtitle={s3Configured ? `Bucket · ${process.env.S3_BUCKET_NAME}` : "S3 credentials missing"}
          icon={Cloud}
          href="/admin/s3"
        />
      </section>

      <section>
        <h2 className="mb-2 text-sm font-medium text-muted-foreground">Collections</h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Name</th>
                <th className="px-3 py-2 text-left font-medium">Collection</th>
                <th className="px-3 py-2 text-right font-medium">Documents</th>
                <th className="px-3 py-2 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.key} className="border-b border-border last:border-0">
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-1.5">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      {c.label}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-mono text-xs text-muted-foreground">{c.key}</td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {c.count === null ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      c.count.toLocaleString()
                    )}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Link href={c.href} className="text-xs text-muted-foreground hover:text-foreground">
                      Open →
                    </Link>
                  </td>
                </tr>
              ))}
              {!rows.length && (
                <tr>
                  <td colSpan={4} className="px-3 py-4 text-center text-xs text-muted-foreground">
                    {mongoErr ?? "No collections found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatusCard({
  title,
  ok,
  subtitle,
  icon: Icon,
  href,
}: {
  title: string;
  ok: boolean;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/40"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{title}</span>
        </div>
        <span
          className={
            "rounded-full px-2 py-0.5 text-xs font-medium " +
            (ok
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400")
          }
        >
          {ok ? "OK" : "Check"}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{subtitle}</p>
    </Link>
  );
}
