export const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

const PLACEHOLDER = /^G-X+$/i;

export function isAnalyticsEnabled(): boolean {
  if (!GA_ID) return false;
  if (PLACEHOLDER.test(GA_ID)) return false;
  return /^G-[A-Z0-9]{4,}$/i.test(GA_ID);
}

type Params = Record<string, unknown>;

interface GtagWindow {
  gtag?: (...args: unknown[]) => void;
  location?: { href?: string };
}

function gtagWindow(): GtagWindow | null {
  if (typeof window === "undefined") return null;
  return window as unknown as GtagWindow;
}

export function event(name: string, params: Params = {}): void {
  if (!isAnalyticsEnabled()) return;
  const w = gtagWindow();
  if (!w?.gtag) return;
  w.gtag("event", name, params);
}

export function pageview(path: string): void {
  const w = gtagWindow();
  const location = w?.location?.href ?? path;
  event("page_view", {
    page_path: path,
    page_location: location,
    send_to: GA_ID,
  });
}

interface AffiliateClick {
  productId: string;
  category: string;
  destination?: string;
}

export function trackAffiliateClick(c: AffiliateClick): void {
  event("affiliate_click", {
    product_id: c.productId,
    category: c.category,
    destination: c.destination,
    affiliate_network: "amazon",
    affiliate_tag: process.env.NEXT_PUBLIC_AMAZON_TAG ?? "fs08-21",
  });
}

interface BookingClick {
  hotelId: string;
  network: "booking" | "expedia" | "agoda";
  destination?: string;
  rate?: number | null;
}

export function trackBookingClick(c: BookingClick): void {
  event("booking_click", {
    hotel_id: c.hotelId,
    affiliate_network: c.network,
    destination: c.destination,
    rate_eur: c.rate ?? null,
  });
}

export function trackNewsletterSignup(source = "mtd"): void {
  event("newsletter_signup", { source });
}

export function trackMoroccaiMessage(meta: { dest?: string; region?: string; topic?: string }): void {
  event("moroccai_message", {
    dest: meta.dest ?? null,
    region: meta.region ?? null,
    topic: meta.topic ?? null,
  });
}
