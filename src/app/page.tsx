import { FrontHomeV2 } from "@/components/v2/FrontHomeV2";
import { DESTINATIONS } from "@/lib/mtd-v2/seed";
import { tryGetDb } from "@/lib/mongo";
import type { Destination } from "@/lib/mtd-v2/types";

export const revalidate = 300;

async function loadDestinations(): Promise<Destination[]> {
  const db = await tryGetDb();
  if (!db) return DESTINATIONS;
  try {
    const rows = await db
      .collection<Destination>("mtd_destinations")
      .find({}, { projection: { _id: 0 } })
      .toArray();
    if (rows.length > 0) return rows;
  } catch (err) {
    console.warn("[mtd/page] mongo read failed, using seed:", (err as Error).message);
  }
  return DESTINATIONS;
}

export default async function HomePage() {
  const destinations = await loadDestinations();
  return <FrontHomeV2 destinations={destinations} />;
}
