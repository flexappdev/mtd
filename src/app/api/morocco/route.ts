import { NextResponse } from "next/server";
import { MOROCCO_PLACES, CATEGORIES } from "@/lib/mtd-data";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ places: MOROCCO_PLACES, categories: CATEGORIES });
}
