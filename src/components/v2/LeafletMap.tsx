"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet";
import Link from "next/link";
import "leaflet/dist/leaflet.css";

export type MapPin = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  href?: string;
  kind?: "destination" | "wiki" | "sight";
  description?: string;
};

type Props = {
  pins: MapPin[];
  center?: [number, number];
  zoom?: number;
};

const KIND_COLOR: Record<NonNullable<MapPin["kind"]>, string> = {
  destination: "#10b981",
  wiki: "#3b82f6",
  sight: "#f59e0b",
};

export default function LeafletMap({ pins, center = [31.7, -7.0], zoom = 6 }: Props) {
  const bounds = useMemo<[[number, number], [number, number]] | undefined>(() => {
    if (pins.length === 0) return undefined;
    let minLat = pins[0].lat;
    let maxLat = pins[0].lat;
    let minLon = pins[0].lon;
    let maxLon = pins[0].lon;
    for (const p of pins) {
      if (p.lat < minLat) minLat = p.lat;
      if (p.lat > maxLat) maxLat = p.lat;
      if (p.lon < minLon) minLon = p.lon;
      if (p.lon > maxLon) maxLon = p.lon;
    }
    return [
      [minLat - 0.2, minLon - 0.2],
      [maxLat + 0.2, maxLon + 0.2],
    ];
  }, [pins]);

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-800" style={{ height: 600 }}>
      <MapContainer
        center={center}
        zoom={zoom}
        bounds={bounds}
        scrollWheelZoom
        style={{ height: "100%", width: "100%", background: "#0a0a0a" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pins.map((p) => {
          const color = KIND_COLOR[p.kind ?? "destination"];
          return (
            <CircleMarker
              key={p.id}
              center={[p.lat, p.lon]}
              radius={p.kind === "destination" ? 9 : 6}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: p.kind === "destination" ? 0.9 : 0.6,
                weight: 2,
              }}
            >
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{p.name}</div>
                  {p.description && (
                    <div style={{ fontSize: 11, color: "#52525b", marginBottom: 6 }}>{p.description}</div>
                  )}
                  {p.href && (
                    <Link
                      href={p.href}
                      style={{ fontSize: 11, color: color, textDecoration: "underline" }}
                    >
                      Open →
                    </Link>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
