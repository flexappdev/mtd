import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">404</p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-100">Page not found</h1>
        <p className="mt-2 text-sm text-zinc-400">
          That page doesn’t exist on MTD. Try one of the menus.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2 text-sm">
          <Link href="/" className="rounded px-3 py-1.5 text-white" style={{ backgroundColor: "var(--app-accent)" }}>
            Home
          </Link>
          <Link href="/places" className="rounded border border-zinc-800 px-3 py-1.5 text-zinc-300 hover:bg-zinc-900">
            Places
          </Link>
          <Link href="/lists/top100" className="rounded border border-zinc-800 px-3 py-1.5 text-zinc-300 hover:bg-zinc-900">
            Top 100
          </Link>
        </div>
      </div>
    </div>
  );
}
