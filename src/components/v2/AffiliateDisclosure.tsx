import Link from "next/link";

export function AffiliateDisclosure() {
  return (
    <aside
      className="mtd-affiliate-disclosure"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.08)",
        padding: "12px 24px",
        fontSize: 11,
        lineHeight: 1.6,
        color: "rgba(255,255,255,0.55)",
        background: "rgba(0,0,0,0.4)",
        fontFamily: "var(--font-mono)",
      }}
    >
      <strong style={{ color: "rgba(255,255,255,0.75)" }}>Affiliate disclosure.</strong>{" "}
      Morocco Top Destinations participates in the Amazon Associates Programme
      (tag <code style={{ background: "rgba(255,255,255,0.06)", padding: "1px 4px", borderRadius: 3 }}>fs08-21</code>),
      Booking.com, Expedia, Agoda and other affiliate networks. We earn a small
      commission on qualifying bookings and purchases at no extra cost to you.
      Rates shown are indicative and refreshed periodically — verify on the
      retailer page before booking. See our{" "}
      <Link href="/legal/affiliates" style={{ color: "var(--app-accent)" }}>
        full affiliate policy
      </Link>{" "}
      and{" "}
      <Link href="/legal/privacy" style={{ color: "var(--app-accent)" }}>
        privacy notice
      </Link>
      .
    </aside>
  );
}
