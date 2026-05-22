import { NextResponse } from "next/server";
import { getDbName, pingDb } from "@/lib/mongo";

export const revalidate = 0;

export async function GET() {
  const ms = await pingDb();
  return NextResponse.json({
    ok: ms !== null,
    db: getDbName(),
    ping_ms: ms,
    ts: new Date().toISOString(),
  });
}
