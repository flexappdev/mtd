import { PageHeader } from "@/components/v2/PageHeader";
import { HotelsGrid } from "@/components/v2/HotelsGrid";
import { HOTELS } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export const metadata = {
  title: "Hotels & riads",
  description: "From the Royal Mansour to clifftop Atlas retreats and Sahara desert camps. Live Booking/Expedia/Agoda rates.",
};

export default function HotelsPage() {
  const sorted = [...HOTELS].sort((a, b) => b.clicks30 - a.clicks30);
  return (
    <div className="space-y-8 p-8">
      <PageHeader
        crumb="Places · Hotels"
        title="Hotels & riads"
        tagline="From the Royal Mansour to clifftop Atlas retreats and Sahara desert camps. Live rates across Booking, Expedia and Agoda — click any logo to compare."
        stats={[
          { label: "Hotels", value: HOTELS.length },
          { label: "5★", value: HOTELS.filter((h) => h.stars === 5).length },
          { label: "Cities", value: new Set(HOTELS.map((h) => h.dest)).size },
        ]}
      />
      <HotelsGrid hotels={sorted} />
    </div>
  );
}
