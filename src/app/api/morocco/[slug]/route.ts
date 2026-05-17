import { NextResponse } from "next/server";
import { MOROCCO_PLACES, getWikiSummary } from "@/lib/mtd-data";

export const revalidate = 3600;

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const place = MOROCCO_PLACES.find((x) => x.slug === slug);
  if (!place) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const wiki = await getWikiSummary(place.name);
  return NextResponse.json({ place, wiki });
}
