"use client";

import type { Hotel } from "@/lib/mtd-v2/types";
import { trackBookingClick } from "@/lib/analytics";

const BOOKING_AID = process.env.NEXT_PUBLIC_BOOKING_AID ?? "";
const EXPEDIA_CAMREF = process.env.NEXT_PUBLIC_EXPEDIA_CAMREF ?? "";
const AGODA_CID = process.env.NEXT_PUBLIC_AGODA_CID ?? "";

function bookingUrl(hotel: Pick<Hotel, "name">): string {
  const u = new URL("https://www.booking.com/searchresults.html");
  u.searchParams.set("ss", hotel.name);
  if (BOOKING_AID) u.searchParams.set("aid", BOOKING_AID);
  return u.toString();
}

function expediaUrl(hotel: Pick<Hotel, "name">): string {
  const u = new URL("https://www.expedia.com/Hotel-Search");
  u.searchParams.set("destination", hotel.name);
  if (EXPEDIA_CAMREF) u.searchParams.set("camref", EXPEDIA_CAMREF);
  return u.toString();
}

function agodaUrl(hotel: Pick<Hotel, "name">): string {
  const u = new URL("https://www.agoda.com/search");
  u.searchParams.set("city", hotel.name);
  if (AGODA_CID) u.searchParams.set("cid", AGODA_CID);
  return u.toString();
}

type Props = {
  hotel: Pick<Hotel, "name" | "rates">;
  className?: string;
};

const REL = "sponsored noreferrer noopener";

export function BookingCTA({ hotel, className }: Props) {
  const { rates } = hotel;
  return (
    <div
      className={`mtd-booking-cta ${className ?? ""}`}
      style={{ display: "flex", flexWrap: "wrap", gap: 8 }}
    >
      {rates.booking != null && (
        <a
          href={bookingUrl(hotel)}
          target="_blank"
          rel={REL}
          className="mtd-booking-btn"
          style={btnStyle("#003580")}
          onClick={() => trackBookingClick({ hotelId: hotel.name, network: "booking", rate: rates.booking })}
        >
          <span>Booking</span>
          <b>€{rates.booking}</b>
        </a>
      )}
      {rates.expedia != null && (
        <a
          href={expediaUrl(hotel)}
          target="_blank"
          rel={REL}
          className="mtd-booking-btn"
          style={btnStyle("#FFC72C", "#1a1a1a")}
          onClick={() => trackBookingClick({ hotelId: hotel.name, network: "expedia", rate: rates.expedia })}
        >
          <span>Expedia</span>
          <b>€{rates.expedia}</b>
        </a>
      )}
      {rates.agoda != null && (
        <a
          href={agodaUrl(hotel)}
          target="_blank"
          rel={REL}
          className="mtd-booking-btn"
          style={btnStyle("#D5292E")}
          onClick={() => trackBookingClick({ hotelId: hotel.name, network: "agoda", rate: rates.agoda })}
        >
          <span>Agoda</span>
          <b>€{rates.agoda}</b>
        </a>
      )}
    </div>
  );
}

function btnStyle(bg: string, fg: string = "#fff"): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 12px",
    borderRadius: 6,
    background: bg,
    color: fg,
    fontSize: 12,
    fontWeight: 600,
    textDecoration: "none",
    border: "1px solid rgba(255,255,255,0.08)",
  };
}
