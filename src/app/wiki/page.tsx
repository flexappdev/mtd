import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";
import { WIKI_ARTICLES, findDestination } from "@/lib/mtd-v2/seed";

export const revalidate = 300;

export const metadata = {
  title: "Wiki",
  description: "Long-form encyclopaedic articles on Moroccan cities, regions, culture, history and cuisine.",
};

export default function WikiPage() {
  const tiles: SectionTile[] = WIKI_ARTICLES.map((w) => {
    const dest = w.dest !== "cross" ? findDestination(w.dest) : undefined;
    return {
      id: w.id,
      title: w.title,
      subtitle: dest ? dest.name : "Cross-Morocco",
      meta: [w.length, `updated ${w.updated.trim()}`],
      href: dest ? `/morocco/${dest.id}` : undefined,
    };
  });
  return (
    <SectionPage
      crumb="Wiki"
      title="Morocco wiki"
      tagline="Long-form encyclopaedic articles on Moroccan cities, regions, culture, history and cuisine."
      stats={[{ label: "Articles", value: WIKI_ARTICLES.length }]}
      tiles={tiles}
    />
  );
}
