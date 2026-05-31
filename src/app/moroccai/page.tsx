import Link from "next/link";
import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";

export const revalidate = 300;

export const metadata = {
  title: "MoroccAI",
  description: "Ask anything about Morocco. MoroccAI grounds answers in the MTD catalogue and links to bookable hotels.",
};

const CAPS: SectionTile[] = [
  { id: "trip-plan", title: "Plan my trip", subtitle: "Ask MoroccAI to draft a 7/10/14-day itinerary tuned to your tastes.", href: "/moroccai/chat?topic=trip-plan" },
  { id: "where-eat", title: "Where to eat", subtitle: "Tagine, fine dining, street food — local picks by city and budget.", href: "/moroccai/chat?topic=where-eat" },
  { id: "what-pack", title: "What to pack", subtitle: "Season + region + activity → a clean packing list with affiliate links.", href: "/moroccai/chat?topic=what-pack" },
  { id: "phrases", title: "Phrases & manners", subtitle: "Darija basics, bargaining etiquette, mosque dress codes.", href: "/moroccai/chat?topic=phrases" },
  { id: "transit", title: "Getting around", subtitle: "Train vs Supratours vs grand taxi vs rental — when to use what.", href: "/moroccai/chat?topic=transit" },
  { id: "ramadan", title: "Travelling during Ramadan", subtitle: "Opening hours, iftar plans, etiquette.", href: "/moroccai/chat?topic=ramadan" },
];

export default function MoroccaiPage() {
  return (
    <div className="space-y-6">
      <SectionPage
        crumb="MoroccAI"
        title="MoroccAI — the Morocco travel agent"
        tagline="Ask anything about Morocco. MoroccAI grounds answers in the MTD catalogue (destinations, hotels, sights, food, wiki, videos) and links you to bookable hotels."
        stats={[
          { label: "Knowledge", value: "MTD catalogue" },
          { label: "Model", value: "Claude Sonnet 4.6" },
        ]}
        tiles={CAPS}
      />
      <div className="px-8 pb-4">
        <Link
          href="/moroccai/chat"
          className="inline-flex items-center gap-2 rounded bg-red-700 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-red-600"
          style={{ textDecoration: "none" }}
        >
          ✦ Open MoroccAI chat →
        </Link>
      </div>
    </div>
  );
}
