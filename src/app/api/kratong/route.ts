import { NextResponse } from "next/server";
import { clientIp, fail, readJson } from "@/lib/river/http";
import { createKratong, listKratongs } from "@/lib/river/service";
import { dbConfig } from "@/lib/supabase/rest";

export const dynamic = "force-dynamic";

export async function GET() {
  // ไม่ได้ตั้งค่า Supabase = โหมดแม่น้ำในเครื่อง ไม่ใช่ข้อผิดพลาด
  if (!dbConfig()) return NextResponse.json({ enabled: false, items: [] });
  const r = await listKratongs();
  if (!r.ok) return fail(r.error);
  return NextResponse.json({ enabled: true, items: r.data });
}

export async function POST(req: Request) {
  if (!dbConfig()) return NextResponse.json({ enabled: false }, { status: 503 });
  const body = await readJson(req);
  const r = await createKratong({
    design: body.design,
    wish: body.wish,
    anonId: body.anonId,
    ip: clientIp(req),
  });
  if (!r.ok) return fail(r.error);
  return NextResponse.json({ item: r.data }, { status: 201 });
}
