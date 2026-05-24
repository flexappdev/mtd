import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";
import { SIGHTS, findDestination } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export const metadata = {
  title: "Sights",
  description: "Mosques, kasbahs, medersas, ksars, dunes and beaches — Morocco's sights and monuments.",
};

export default function SightsPage() {
  const tiles: SectionTile[] = SIGHTS.map((s) => ({
    id: s.id,
    title: s.name,
    subtitle: findDestination(s.dest)?.name,
    badge: s.unesco ? "UNESCO" : s.kind,
    href: `/morocco/${s.dest}`,
    meta: ["★".repeat(s.stars), `${s.clicks30.toLocaleString()} clicks/30d`],
  }));
  return (
    <SectionPage
      crumb="Places · Sights"
      title="Sights & monuments"
      tagline="Mosques, kasbahs, medersas, ksars, dunes, beaches — the must-sees."
      stats={[
        { label: "Sights", value: SIGHTS.length },
        { label: "UNESCO", value: SIGHTS.filter((s) => s.unesco).length },
      ]}
      tiles={tiles}
    />
  );
}
