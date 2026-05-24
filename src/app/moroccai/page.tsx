import { SectionPage, type SectionTile } from "@/components/v2/SectionPage";

export const revalidate = 300;

export const metadata = {
  title: "MoroccAI",
  description: "Ask anything about Morocco. MoroccAI grounds answers in the MTD catalogue.",
};

const CAPS: SectionTile[] = [
  { id: "trip-plan", title: "Plan my trip", subtitle: "Ask MoroccAI to draft a 7/10/14-day itinerary tuned to your tastes." },
  { id: "where-eat", title: "Where to eat", subtitle: "Tagine, fine dining, street food — local picks by city and budget." },
  { id: "what-pack", title: "What to pack", subtitle: "Season + region + activity → a clean packing list with affiliate links." },
  { id: "phrases", title: "Phrases & manners", subtitle: "Darija basics, bargaining etiquette, mosque dress codes." },
  { id: "transit", title: "Getting around", subtitle: "Train vs Supratours vs grand taxi vs rental — when to use what." },
  { id: "ramadan", title: "Travelling during Ramadan", subtitle: "Opening hours, iftar plans, etiquette." },
];

export default function MoroccaiPage() {
  return (
    <SectionPage
      crumb="MoroccAI"
      title="MoroccAI — the Morocco travel agent"
      tagline="Ask anything about Morocco. MoroccAI grounds answers in the MTD catalogue (destinations, hotels, sights, food, wiki, videos) and books with affiliate links."
      stats={[
        { label: "Knowledge", value: "MTD catalogue" },
        { label: "Model", value: "Claude / Gemini" },
      ]}
      tiles={CAPS}
      emptyMessage="Chat UI shipping next — meanwhile, here are the six capabilities MoroccAI ships with."
    />
  );
}
