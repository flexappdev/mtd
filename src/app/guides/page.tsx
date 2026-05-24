import { SectionPage } from "@/components/v2/SectionPage";

export const revalidate = 300;

export const metadata = {
  title: "Guides & shop",
  description: "Affiliate-linked guidebooks, cookbooks, travel gear and beauty products.",
};

const SECTIONS = [
  { id: "books", title: "Guidebooks", subtitle: "Lonely Planet, Rough Guide, phrasebooks", meta: ["64 titles"], href: "/guides/books" },
  { id: "cookbooks", title: "Cookbooks", subtitle: "Mourad, Paula Wolfert, tagine and couscous", meta: ["28 titles"], href: "/guides/cookbooks" },
  { id: "gear", title: "Travel gear", subtitle: "Hiking shoes, sand tents, cameras, packs", meta: ["110 items"], href: "/guides/gear" },
  { id: "beauty", title: "Argan & beauty", subtitle: "Argan oil, hammam sets, rose water", meta: ["40 items"], href: "/guides/beauty" },
];

export default function GuidesIndex() {
  return (
    <SectionPage
      crumb="Guides"
      title="Guides & shop"
      tagline="Affiliate-linked guidebooks, cookbooks, travel gear and beauty products for your Morocco trip."
      tiles={SECTIONS}
    />
  );
}
