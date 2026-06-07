import { ImageResponse } from "next/og";
import { ogPayload } from "@/lib/og";
import { LISTS, tint } from "@/lib/mtd-v2/seed";

const BRAND = "MTD";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "Morocco Top Destinations · curated list";

export default function ListOg({ params }: { params: { id: string } }) {
  const list = LISTS.find((l) => l.id === params.id);
  const title = list?.title ?? "Top 100 lists";
  const subtitle = list?.description ?? "Editorial + community Top-100 lists across Morocco.";
  const items = list?.items ?? 100;
  const curator = list?.curator ?? "editorial";
  const [from, to] = tint(params.id);

  const p = ogPayload({
    title,
    subtitle,
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
          background: `linear-gradient(135deg, #0b1220 0%, ${from}33 60%, ${to} 100%)`,
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 28, color: "#d1d5db", letterSpacing: 2, textTransform: "uppercase" }}>
            {p.brand} · curated list
          </span>
          {list?.trending && (
            <span
              style={{
                fontSize: 18,
                padding: "4px 12px",
                borderRadius: 999,
                background: "#10b981",
                color: "#04130d",
                fontWeight: 700,
                letterSpacing: 1,
              }}
            >
              ▲ TRENDING
            </span>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 80, fontWeight: 800, lineHeight: 1.05 }}>{p.title}</div>
          {p.subtitle && (
            <div style={{ marginTop: 16, fontSize: 32, color: "#e5e7eb", lineHeight: 1.3 }}>{p.subtitle}</div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 22, color: "#d1d5db" }}>
          <span>{items} ranked · {curator}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ width: 14, height: 14, borderRadius: "9999px", background: p.accent, display: "flex" }} />
            moroccotopdestinations.com
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
