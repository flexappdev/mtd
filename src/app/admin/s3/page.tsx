import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminS3Page() {
  const bucket = process.env.S3_BUCKET_NAME;
  const configured = !!(process.env.S3_ACCESS_KEY && process.env.S3_SECRET_ACCESS_KEY && bucket);
  const folder = process.env.S3_UPLOAD_BASE_FOLDER || "(none)";

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <header>
        <Link href="/admin" className="text-xs text-muted-foreground hover:text-foreground">
          ← Admin
        </Link>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">S3</h1>
        <p className="text-sm text-muted-foreground">
          Object storage for MTD images, audio, video, PDFs.
        </p>
      </header>

      <div className="rounded-lg border border-border bg-card p-4 text-sm">
        <dl className="grid grid-cols-[120px_1fr] gap-y-2">
          <dt className="text-muted-foreground">Status</dt>
          <dd>
            <span
              className={
                "inline-flex rounded-full px-2 py-0.5 text-xs font-medium " +
                (configured
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400")
              }
            >
              {configured ? "Configured" : "Credentials missing"}
            </span>
          </dd>
          <dt className="text-muted-foreground">Bucket</dt>
          <dd className="font-mono text-xs">{bucket ?? "(not set)"}</dd>
          <dt className="text-muted-foreground">Base folder</dt>
          <dd className="font-mono text-xs">{folder}</dd>
        </dl>
      </div>

      <p className="text-xs text-muted-foreground">
        Object browser coming in a follow-up. Configure S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY,
        S3_BUCKET_NAME in .env.local to enable.
      </p>
    </div>
  );
}
