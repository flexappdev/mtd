import { ImageResponse } from "next/og";
import { ogPayload } from "@/lib/og";
import { DESTINATIONS, findRegion, tint } from "@/lib/mtd-v2/seed";
import { MOROCCO_PLACES } from "@/lib/mtd-data";

const BRAND = "MTD";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "Morocco Top Destinations";

export default function MoroccoOg({ params }: { params: { slug: string } }) {
  const v2 = DESTINATIONS.find((d) => d.id === params.slug);
  const legacy = MOROCCO_PLACES.find((x) => x.slug === params.slug);
  const name = v2?.name ?? legacy?.name ?? "Morocco";
  const region = v2 ? findRegion(v2.region)?.name ?? v2.region : legacy?.region ?? "";
  const subtitle = v2?.position ?? (legacy?.category ? `${legacy.category} · ${region}` : region);
  const [from, to] = tint(params.slug);

  const p = ogPayload({
    title: name,
    subtitle: subtitle || "Morocco travel — hotels, sights, food",
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
          background: `linear-gradient(135deg, ${from} 0%, ${to} 60%, #050608 100%)`,
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#d1d5db", letterSpacing: 2, textTransform: "uppercase" }}>
          {p.brand} · {region || "Morocco"}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, fontWeight: 800, lineHeight: 1.05 }}>{p.title}</div>
          {p.subtitle && (
            <div style={{ marginTop: 16, fontSize: 36, color: "#e5e7eb", lineHeight: 1.25 }}>{p.subtitle}</div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22 }}>
          <span style={{ width: 14, height: 14, borderRadius: "9999px", background: p.accent, display: "flex" }} />
          <span style={{ color: "#d1d5db" }}>moroccotopdestinations.com</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
