"use client";

import type { ReactNode } from "react";
import { trackAffiliateClick } from "@/lib/analytics";

export const AMAZON_TAG = process.env.NEXT_PUBLIC_AMAZON_TAG ?? "fs08-21";

function amazonUrl(asin: string): string {
  const u = new URL(`https://www.amazon.co.uk/dp/${asin}`);
  u.searchParams.set("tag", AMAZON_TAG);
  return u.toString();
}

type Props = {
  asin: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function AffiliateLink({ asin, children, className, style }: Props) {
  return (
    <a
      href={amazonUrl(asin)}
      target="_blank"
      rel="sponsored nofollow noopener noreferrer"
      data-affiliate="amazon"
      className={className}
      style={{ textDecoration: "none", color: "inherit", ...style }}
      onClick={() => trackAffiliateClick({ productId: asin, category: "amazon" })}
    >
      {children}
    </a>
  );
}

export function AffiliateBadge() {
  return (
    <span
      title="Amazon affiliate link — we earn a small commission on qualifying purchases"
      style={{
        fontSize: 9,
        padding: "2px 6px",
        borderRadius: 4,
        background: "rgba(255,153,0,0.15)",
        color: "#ff9900",
        border: "1px solid rgba(255,153,0,0.35)",
        letterSpacing: 0.4,
        fontFamily: "var(--font-mono)",
        textTransform: "uppercase",
      }}
    >
      Affiliate
    </span>
  );
}
