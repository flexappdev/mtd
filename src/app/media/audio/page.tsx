import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";

export const revalidate = 300;

const STREAMS: SectionTile[] = [
  { id: "gnawa", title: "Gnawa", subtitle: "Sufi trance music from Essaouira", meta: ["32 tracks"] },
  { id: "andalusian", title: "Andalusian", subtitle: "Classical Arab-Andalusian orchestras", meta: ["28 tracks"] },
  { id: "amazigh", title: "Berber (Amazigh)", subtitle: "Atlas mountain rhythms and ahidous", meta: ["24 tracks"] },
  { id: "chaabi", title: "Chaabi", subtitle: "Popular Moroccan dance music", meta: ["20 tracks"] },
  { id: "rai", title: "Raï", subtitle: "Cross-border raï from the east", meta: ["10 tracks"] },
  { id: "ambient", title: "Ambient field", subtitle: "Souks, mosques, dunes, surf, hammams", meta: ["6 tracks"] },
];

export default function MediaAudioPage() {
  return (
    <SectionPage
      crumb="Media · Audio"
      title="Audio"
      tagline="Six music streams from Gnawa to ambient field recordings — about 120 tracks across genres."
      stats={[{ label: "Tracks", value: 120 }]}
      tiles={STREAMS}
    />
  );
}
