import { PageHeader } from "@/components/v2/PageHeader";
import { GuidesGrid } from "@/components/v2/GuidesGrid";
import { GUIDES } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export const metadata = {
  title: "Guidebooks",
  description: "Lonely Planet, Rough Guide, phrasebooks — Amazon affiliate links (tag fs08-21).",
};

export default function GuidesBooksPage() {
  const books = GUIDES.filter((g) => g.kind === "guidebook");
  return (
    <div className="space-y-8 p-8">
      <PageHeader
        crumb="Guides · Guidebooks"
        title="Guidebooks"
        tagline="Lonely Planet, Rough Guide and the essential phrasebooks. Every link is an Amazon affiliate (tag fs08-21) — see /legal/affiliates."
        stats={[{ label: "Titles", value: books.length }]}
      />
      <GuidesGrid guides={books} emptyMessage="More guidebooks landing soon." />
    </div>
  );
}
