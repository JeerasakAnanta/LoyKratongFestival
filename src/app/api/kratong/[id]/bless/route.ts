import { NextResponse } from "next/server";
import { fail, readJson } from "@/lib/river/http";
import { reactToKratong } from "@/lib/river/service";
import { dbConfig } from "@/lib/supabase/rest";

export const dynamic = "force-dynamic";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  if (!dbConfig()) return NextResponse.json({ enabled: false }, { status: 503 });
  const body = await readJson(req);
  const r = await reactToKratong({ id: params.id, anonId: body.anonId, kind: "bless" });
  if (!r.ok) return fail(r.error);
  return NextResponse.json({ ok: true });
}
