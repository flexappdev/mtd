import {
  DESTINATIONS,
  HOTELS,
  LISTS,
  REGIONS,
  RESTAURANTS,
  SIGHTS,
  findDestination,
  findRegion,
} from "@/lib/mtd-v2/seed";

export const MOROCCAI_MODEL = process.env.MOROCCAI_MODEL ?? "claude-sonnet-4-6";

export const MOROCCAI_BASE_PROMPT = `You are MoroccAI, the in-house travel agent for Morocco Top Destinations (moroccotopdestinations.com).

Your job: help travellers plan, choose, and book a trip to Morocco, grounded in the MTD catalogue (destinations, hotels, sights, restaurants, lists). Be specific, practical, and honest. If something isn't in the catalogue, say so — don't invent hotel names or fake prices.

STYLE
- Warm, expert, concise. UK English. No exclamation marks, no emoji.
- Lead with the answer. Bullets and short sections, not walls of text.
- Surface the BookingCTA invitation when relevant: "On the {hotel name} card, the Booking / Expedia / Agoda buttons show today's rates."
- When suggesting itineraries, give 1-line rationales (why this stop, this hotel, this dish).
- Default currency: EUR. Default distance: km. Default season note: April-May, September-October are the safest weather windows; July-August inland is hot.

GUARDRAILS
- Don't fabricate operators, phone numbers, addresses, prices, or visa rules.
- For visas / vaccinations / border policy, recommend the user check the UK Foreign Office or the Moroccan consulate.
- For Ramadan-specific advice, ask which Ramadan year before answering (dates shift).
- When recommending hotels, prefer items that exist in the catalogue below.

CATALOGUE (canonical — refer to these by exact id/name):
${formatCatalogue()}
`;

function formatCatalogue(): string {
  const regions = REGIONS.map((r) => `- ${r.id}: ${r.name}`).join("\n");

  const dests = DESTINATIONS.map((d) => {
    const region = findRegion(d.region)?.name ?? d.region;
    return `- ${d.id} · ${d.name} (${d.kind}, ${region}) — ${d.position}. ${d.hotels} hotels, ${d.sights} sights.`;
  }).join("\n");

  const hotels = HOTELS.map((h) => {
    const dest = findDestination(h.dest)?.name ?? h.dest;
    const rates = Object.entries(h.rates)
      .filter(([, v]) => v != null)
      .map(([k, v]) => `${k} €${v}`)
      .join(", ");
    return `- ${h.id} · ${h.name} (${h.stars}★, ${dest}) — ${rates || "rates tbd"}.`;
  }).join("\n");

  const sights = SIGHTS.map((s) => {
    const dest = findDestination(s.dest)?.name ?? s.dest;
    return `- ${s.id} · ${s.name} (${s.kind}, ${dest})${s.unesco ? " — UNESCO" : ""}.`;
  }).join("\n");

  const restos = RESTAURANTS.map((r) => {
    const dest = findDestination(r.dest)?.name ?? r.dest;
    return `- ${r.id} · ${r.name} (${r.kind}, ${dest}, ${r.price}).`;
  }).join("\n");

  const lists = LISTS.map((l) => `- /lists/${l.id} · ${l.title} (${l.items} items, ${l.curator}).`).join("\n");

  return `
REGIONS
${regions}

DESTINATIONS
${dests}

HOTELS (live partner rates — change daily)
${hotels}

SIGHTS
${sights}

RESTAURANTS
${restos}

CURATED LISTS (link by URL — use full /lists/<id>)
${lists}
`.trim();
}

export function contextHint(dest?: string, region?: string, topic?: string): string {
  const parts: string[] = [];
  if (dest) {
    const d = findDestination(dest);
    if (d) parts.push(`The user is currently looking at ${d.name} (${d.id}). Lead with content for that destination unless they ask otherwise.`);
  }
  if (region) {
    const r = findRegion(region);
    if (r) parts.push(`The user is currently exploring the ${r.name} region. Lead with destinations and tips for that region.`);
  }
  if (topic) {
    parts.push(`The user opened this conversation from the "${topic}" capability card on /moroccai.`);
  }
  return parts.join(" ");
}
