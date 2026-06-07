"use client";

import dynamic from "next/dynamic";
import type { MapPin } from "./LeafletMap";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-sm text-zinc-500"
      style={{ height: 600 }}
    >
      Loading map…
    </div>
  ),
});

export function MapClient({ pins }: { pins: MapPin[] }) {
  return <LeafletMap pins={pins} />;
}
