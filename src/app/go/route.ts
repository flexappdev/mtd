import { NextRequest, NextResponse } from "next/server";
import { networkForUrl } from "@/lib/top-travel/affiliate";
import { APP, tryGetDb } from "@/lib/mongo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const clip = (s: string | null, n = 80) => (s ?? "").slice(0, n);

// GET /go?u=<partner url>&d=<dest>&k=<hotel|tour>&i=<item>
// Logs the click to FLEET.affiliate_clicks {app:'mtd'} (same shape as wbp),
// then 302s. Only Booking.com / GetYourGuide targets are allowed so this
// can't be used as an open redirect. No IP or user agent is stored.
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const target = sp.get("u") ?? "";
  const network = networkForUrl(target);
  if (!network) {
    return NextResponse.json({ ok: false, reason: "bad-target" }, { status: 400 });
  }

  const doc = {
    app: APP,
    ts: new Date(),
    network,
    dest: clip(sp.get("d")),
    kind: clip(sp.get("k"), 16),
    item: clip(sp.get("i")),
    tagged: /[?&](aid|partner_id)=/.test(target),
    referer: req.headers.get("referer")?.slice(0, 200) ?? null,
  };

  console.log(JSON.stringify({ evt: "affiliate_click", ...doc }));
  try {
    const db = await tryGetDb();
    await db?.collection("affiliate_clicks").insertOne(doc);
  } catch (e) {
    console.error("affiliate_click insert failed", (e as Error).message);
  }

  return NextResponse.redirect(target, {
    status: 302,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
  });
}
