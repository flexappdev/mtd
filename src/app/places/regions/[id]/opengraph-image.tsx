import { ImageResponse } from "next/og";
import { ogPayload } from "@/lib/og";
import { DESTINATIONS, HOTELS, REGIONS, SIGHTS } from "@/lib/mtd-v2/seed";

const BRAND = "MTD";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "Morocco Top Destinations · region";

export default function RegionOg({ params }: { params: { id: string } }) {
  const region = REGIONS.find((r) => r.id === params.id);
  const name = region?.name ?? "Morocco region";
  const [from, to] = region?.thumb ?? ["#0b1220", "#111827"];
  const dests = DESTINATIONS.filter((d) => d.region === params.id);
  const sights = SIGHTS.filter((s) => {
    const dest = DESTINATIONS.find((d) => d.id === s.dest);
    return dest?.region === params.id;
  });
  const hotels = HOTELS.filter((h) => {
    const dest = DESTINATIONS.find((d) => d.id === h.dest);
    return dest?.region === params.id;
  });

  const p = ogPayload({
    title: name,
    subtitle: `${dests.length} destinations · ${sights.length} sights · ${hotels.length} hotels`,
    brand: BRAND,
    accent: "#10b981",
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: `linear-gradient(135deg, ${from} 0%, ${to} 80%)`,
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#d1d5db", letterSpacing: 2, textTransform: "uppercase" }}>
          {p.brand} · region
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1.05 }}>{p.title}</div>
          {p.subtitle && (
            <div style={{ marginTop: 16, fontSize: 34, color: "#e5e7eb", lineHeight: 1.25 }}>{p.subtitle}</div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22 }}>
          <span style={{ width: 14, height: 14, borderRadius: "9999px", background: p.accent, display: "flex" }} />
          <span style={{ color: "#d1d5db" }}>moroccotopdestinations.com/places/regions/{params.id}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
