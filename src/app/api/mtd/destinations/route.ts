import { NextResponse } from "next/server";
import { DESTINATIONS } from "@/lib/mtd-v2/seed";
import { APP_FILTER, fleetCol, tryGetDb } from "@/lib/mongo";
import type { Destination } from "@/lib/mtd-v2/types";

export const revalidate = 300;

export async function GET() {
  const db = await tryGetDb();
  if (!db) {
    return NextResponse.json({ source: "seed", count: DESTINATIONS.length, destinations: DESTINATIONS });
  }
  try {
    // FLEET.items scoped to {app:'mtd', kind in {city,sight,region}} — see
    // src/lib/mongo.ts for the app-discriminator contract.
    const col = await fleetCol<Destination>("items");
    const rows = await col
      .find({ ...APP_FILTER, kind: { $in: ["city", "sight", "region"] } }, { projection: { _id: 0 } })
      .toArray();
    if (rows.length > 0) {
      return NextResponse.json({ source: "mongo", count: rows.length, destinations: rows });
    }
  } catch (err) {
    console.warn("[mtd/api] mongo read failed, using seed:", (err as Error).message);
  }
  return NextResponse.json({ source: "seed", count: DESTINATIONS.length, destinations: DESTINATIONS });
}
