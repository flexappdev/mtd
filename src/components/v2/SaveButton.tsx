"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { isSaved, toggleSaved } from "@/lib/saved";

export function SaveButton({ id, label = "Save" }: { id: string; label?: string }) {
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSaved(isSaved(id));
    setHydrated(true);
    function onChange() {
      setSaved(isSaved(id));
    }
    window.addEventListener("mtd:saved-changed", onChange);
    return () => window.removeEventListener("mtd:saved-changed", onChange);
  }, [id]);

  function handle() {
    const next = toggleSaved(id);
    setSaved(next);
  }

  return (
    <button
      type="button"
      onClick={handle}
      aria-pressed={saved}
      title={saved ? "Remove from saved" : "Add to saved"}
      className={
        "inline-flex items-center gap-2 rounded border px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors " +
        (saved
          ? "border-yellow-500/60 bg-yellow-500/15 text-yellow-300"
          : "border-zinc-700 bg-zinc-900 text-zinc-300 hover:bg-zinc-800")
      }
      style={{ visibility: hydrated ? "visible" : "hidden" }}
    >
      <Star size={14} fill={saved ? "#facc15" : "none"} stroke="currentColor" />
      {saved ? "Saved" : label}
    </button>
  );
}
