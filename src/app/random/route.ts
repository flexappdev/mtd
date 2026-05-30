import { redirect } from "next/navigation";
import { DESTINATIONS } from "@/lib/mtd-v2/seed";

export const dynamic = "force-dynamic";

export function GET() {
  const visible = DESTINATIONS.filter((d) => d.status === "live" || d.status === "preview");
  const pool = visible.length > 0 ? visible : DESTINATIONS;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  redirect(`/morocco/${pick.id}`);
}
