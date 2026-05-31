import { PageHeader } from "@/components/v2/PageHeader";
import { GuidesGrid } from "@/components/v2/GuidesGrid";
import { GUIDES } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export const metadata = {
  title: "Travel gear",
  description: "Hiking shoes, sand tents, cameras, packs — gear for Atlas, Sahara, medina.",
};

export default function GuidesGearPage() {
  const gear = GUIDES.filter((g) => g.kind === "gear");
  return (
    <div className="space-y-8 p-8">
      <PageHeader
        crumb="Guides · Travel gear"
        title="Travel gear & kit"
        tagline="What we pack for an Atlas trek, an Erg Chebbi night and a Marrakech souk haul. Amazon affiliate (tag fs08-21)."
        stats={[{ label: "Items", value: gear.length }]}
      />
      <GuidesGrid guides={gear} emptyMessage="Gear list landing soon." />
    </div>
  );
}
