import { NextResponse } from "next/server";
import { DESTINATIONS } from "@/lib/mtd-v2/seed";
import { tryGetDb } from "@/lib/mongo";
import type { Destination } from "@/lib/mtd-v2/types";

export const revalidate = 300;

export async function GET() {
  const db = await tryGetDb();
  if (!db) {
    return NextResponse.json({ source: "seed", count: DESTINATIONS.length, destinations: DESTINATIONS });
  }
  try {
    const rows = await db
      .collection<Destination>("mtd_destinations")
      .find({}, { projection: { _id: 0 } })
      .toArray();
    if (rows.length > 0) {
      return NextResponse.json({ source: "mongo", count: rows.length, destinations: rows });
    }
  } catch (err) {
    console.warn("[mtd/api] mongo read failed, using seed:", (err as Error).message);
  }
  return NextResponse.json({ source: "seed", count: DESTINATIONS.length, destinations: DESTINATIONS });
}
