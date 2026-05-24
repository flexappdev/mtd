export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div
          className="mx-auto h-10 w-10 animate-pulse rounded-full"
          style={{ backgroundColor: "var(--app-accent)" }}
        />
        <p className="mt-4 text-xs uppercase tracking-wider text-zinc-500">Loading Morocco…</p>
      </div>
    </div>
  );
}
