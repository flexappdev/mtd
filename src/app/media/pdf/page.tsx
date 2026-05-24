import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";

export const revalidate = 300;

export const metadata = {
  title: "Downloadable guides",
  description: "Self-published MTD PDF guides — itineraries, packing lists, bargaining tips.",
};

const DOCS: SectionTile[] = [
  { id: "starter", title: "Morocco starter pack", subtitle: "10-day itinerary, packing list, phrasebook", meta: ["PDF · 24 pages"] },
  { id: "imperial", title: "Imperial cities tour", subtitle: "Marrakech / Fes / Meknes / Rabat in 14 days", meta: ["PDF · 32 pages"] },
  { id: "atlas", title: "Atlas Mountains trek", subtitle: "Toubkal + Imlil base, gear list, altitude tips", meta: ["PDF · 18 pages"] },
  { id: "desert", title: "Sahara expedition", subtitle: "Erg Chebbi & Erg Chigaga overnight stays", meta: ["PDF · 20 pages"] },
  { id: "food", title: "Food & souks guide", subtitle: "Tagine, couscous, snail stalls, bargaining", meta: ["PDF · 16 pages"] },
  { id: "ramadan", title: "Travelling during Ramadan", subtitle: "Opening hours, etiquette, iftar plans", meta: ["PDF · 12 pages"] },
];

export default function MediaPdfPage() {
  return (
    <SectionPage
      crumb="Media · PDFs"
      title="Downloadable guides"
      tagline="Self-published MTD travel guides — itineraries, packing lists, bargaining tips and more."
      stats={[{ label: "PDFs", value: 32 }]}
      tiles={DOCS}
    />
  );
}
