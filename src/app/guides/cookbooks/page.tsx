import { PageHeader } from "@/components/v2/PageHeader";
import { GuidesGrid } from "@/components/v2/GuidesGrid";
import { GUIDES } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export const metadata = {
  title: "Cookbooks",
  description: "Tagine, couscous, pastilla — Moroccan cookbooks (Mourad, Paula Wolfert) via Amazon.",
};

export default function GuidesCookbooksPage() {
  const books = GUIDES.filter((g) => g.kind === "cookbook" || g.kind === "cooking");
  return (
    <div className="space-y-8 p-8">
      <PageHeader
        crumb="Guides · Cookbooks"
        title="Moroccan cookbooks"
        tagline="Mourad — New Moroccan. Paula Wolfert — The Food of Morocco. The defining titles, all Amazon-affiliate-linked (tag fs08-21)."
        stats={[{ label: "Titles", value: books.length }]}
      />
      <GuidesGrid guides={books} emptyMessage="More cookbooks landing soon." />
    </div>
  );
}
