// Affiliate deep-links for the Morocco Top 100. Mirrors wbp's Top Travel loop
// (flexappdev/wbp src/lib/top-travel/affiliate.ts): every outbound link goes
// through /go so the click is logged first-party before the 302 to the partner.
//
// Partner tags (all optional — links still work untagged, they just pay nothing):
//   NEXT_PUBLIC_BOOKING_AFFILIATE_ID   Booking.com Affiliate Partner "aid"
//                                      (falls back to NEXT_PUBLIC_BOOKING_AID,
//                                      which mtd's BookingCTA already reads)
//   NEXT_PUBLIC_GYG_PARTNER_ID         GetYourGuide partner_id

export type Network = "booking" | "getyourguide";

export const AFFILIATE_HOSTS: Record<Network, string[]> = {
  booking: ["www.booking.com", "booking.com"],
  getyourguide: ["www.getyourguide.com", "getyourguide.com"],
};

const BOOKING_AID =
  process.env.NEXT_PUBLIC_BOOKING_AFFILIATE_ID ?? process.env.NEXT_PUBLIC_BOOKING_AID ?? "";
const GYG_PARTNER_ID = process.env.NEXT_PUBLIC_GYG_PARTNER_ID ?? "";

export function affiliateStatus(): Record<Network, boolean> {
  return { booking: Boolean(BOOKING_AID), getyourguide: Boolean(GYG_PARTNER_ID) };
}

/** Booking.com search near a place; `label` attributes the booking to page + item in Booking's reports. */
export function bookingUrl(place: string, label: string): string {
  const p = new URLSearchParams({ ss: `${place}, Morocco`, lang: "en-gb", label });
  if (BOOKING_AID) p.set("aid", BOOKING_AID);
  return `https://www.booking.com/searchresults.html?${p.toString()}`;
}

/** GetYourGuide activity search; `cmp` is GYG's campaign field for sub-attribution. */
export function gygUrl(query: string, cmp: string): string {
  const p = new URLSearchParams({ q: query, cmp });
  if (GYG_PARTNER_ID) p.set("partner_id", GYG_PARTNER_ID);
  return `https://www.getyourguide.com/s/?${p.toString()}`;
}

/** First-party tracked hop: /go logs {dest, kind, item} then 302s to `url`. */
export function tracked(url: string, meta: { dest: string; kind: "hotel" | "tour"; item: string }): string {
  const p = new URLSearchParams({ u: url, d: meta.dest, k: meta.kind, i: meta.item });
  return `/go?${p.toString()}`;
}

export function networkForUrl(raw: string): Network | null {
  try {
    const u = new URL(raw);
    if (u.protocol !== "https:") return null;
    for (const [net, hosts] of Object.entries(AFFILIATE_HOSTS) as [Network, string[]][]) {
      if (hosts.includes(u.hostname)) return net;
    }
  } catch {
    // fall through
  }
  return null;
}
