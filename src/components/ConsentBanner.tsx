"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const COOKIE = "mtd-consent";
const MAX_AGE = 60 * 60 * 24 * 365;

function readConsent(): "accepted" | "declined" | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE}=`));
  if (!match) return null;
  const value = match.split("=")[1];
  return value === "accepted" || value === "declined" ? value : null;
}

function writeConsent(value: "accepted" | "declined") {
  document.cookie = `${COOKIE}=${value}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
  if (typeof window === "undefined") return;
  const granted = value === "accepted" ? "granted" : "denied";
  if (typeof (window as unknown as { gtag?: Function }).gtag === "function") {
    (window as unknown as { gtag: Function }).gtag("consent", "update", {
      analytics_storage: granted,
      ad_storage: granted,
      ad_user_data: granted,
      ad_personalization: granted,
    });
  }
  window.dispatchEvent(new Event("mtd-consent-change"));
}

export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const state = readConsent();
    if (state === null) {
      setShow(true);
      return;
    }
    // Replay prior choice so gtag picks it up on every load.
    if (typeof window !== "undefined" && typeof (window as unknown as { gtag?: Function }).gtag === "function") {
      const granted = state === "accepted" ? "granted" : "denied";
      (window as unknown as { gtag: Function }).gtag("consent", "update", {
        analytics_storage: granted,
        ad_storage: granted,
        ad_user_data: granted,
        ad_personalization: granted,
      });
    }
  }, []);

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        bottom: 72,
        left: 16,
        right: 16,
        zIndex: 50,
        maxWidth: 600,
        margin: "0 auto",
        borderRadius: 8,
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(10,10,10,0.96)",
        padding: "12px 16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <p style={{ fontSize: 13, color: "#a1a1aa", margin: 0 }}>
          We use cookies for anonymous analytics.{" "}
          <Link href="/legal/privacy" style={{ color: "#10b981", textDecoration: "underline" }}>
            Privacy policy
          </Link>
          .
        </p>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => { writeConsent("declined"); setShow(false); }}
            style={{
              padding: "5px 12px",
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "transparent",
              color: "#a1a1aa",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Decline
          </button>
          <button
            onClick={() => { writeConsent("accepted"); setShow(false); }}
            style={{
              padding: "5px 12px",
              borderRadius: 6,
              border: "none",
              background: "#10b981",
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
