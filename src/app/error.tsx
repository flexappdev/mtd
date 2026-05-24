"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[mtd/error]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md rounded-lg border border-zinc-800 bg-zinc-900/60 p-6 text-center">
        <h1 className="text-xl font-semibold text-zinc-100">Something went wrong.</h1>
        <p className="mt-2 text-sm text-zinc-400">
          We couldn’t render this page. Try again or head back to home.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            digest: {error.digest}
          </p>
        )}
        <div className="mt-5 flex justify-center gap-2">
          <button
            onClick={reset}
            className="rounded px-3 py-1.5 text-sm text-white"
            style={{ backgroundColor: "var(--app-accent)" }}
          >
            Try again
          </button>
          <a
            href="/"
            className="rounded border border-zinc-800 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900"
          >
            Home
          </a>
        </div>
      </div>
    </div>
  );
}
