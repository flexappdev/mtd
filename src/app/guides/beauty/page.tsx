import { PageHeader } from "@/components/v2/PageHeader";
import { GuidesGrid } from "@/components/v2/GuidesGrid";
import { GUIDES } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export const metadata = {
  title: "Argan & beauty",
  description: "Argan oil, hammam sets, rose water — Moroccan beauty essentials.",
};

export default function GuidesBeautyPage() {
  const beauty = GUIDES.filter((g) => g.kind === "beauty");
  return (
    <div className="space-y-8 p-8">
      <PageHeader
        crumb="Guides · Argan & beauty"
        title="Argan & beauty"
        tagline="Argan oil hammam gift sets, rose-water sprays, ghassoul clay. Amazon affiliate (tag fs08-21)."
        stats={[{ label: "Items", value: beauty.length }]}
      />
      <GuidesGrid guides={beauty} emptyMessage="Beauty range landing soon." />
    </div>
  );
}
