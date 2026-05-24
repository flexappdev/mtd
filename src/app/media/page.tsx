import { SectionPage } from "@/components/v2/SectionPage";

export const revalidate = 300;

export const metadata = {
  title: "Media",
  description: "Images, audio, video, map, and downloadable guides — everything visual on Morocco.",
};

const SECTIONS = [
  { id: "images", title: "Images", subtitle: "Curated photography from across Morocco", meta: ["4,200 stock"], href: "/media/images" },
  { id: "audio", title: "Audio", subtitle: "Gnawa, Andalusian, Berber and contemporary", meta: ["120 tracks"], href: "/media/audio" },
  { id: "videos", title: "Videos", subtitle: "Walking tours, drone, sunrise dunes, food", meta: ["10,000 clips"], href: "/media/videos" },
  { id: "map", title: "Map", subtitle: "Live, pinned, region-coloured", meta: ["live"], href: "/media/map" },
  { id: "pdf", title: "PDFs", subtitle: "Downloadable guides, itineraries, packing lists", meta: ["32 docs"], href: "/media/pdf" },
];

export default function MediaIndex() {
  return (
    <SectionPage
      crumb="Media"
      title="Media library"
      tagline="Images, audio, video, map, and downloadable guides — everything visual on Morocco."
      tiles={SECTIONS}
    />
  );
}
