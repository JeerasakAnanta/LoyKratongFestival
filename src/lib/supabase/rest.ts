import "server-only";

/** เรียก Supabase PostgREST ด้วย service role (ฝั่ง server เท่านั้น ไม่ส่ง key ไปเบราว์เซอร์) */

export function dbConfig(): { url: string; key: string } | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

export async function dbFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const cfg = dbConfig();
  if (!cfg) throw new Error("Supabase ยังไม่ได้ตั้งค่า");
  return fetch(`${cfg.url}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      "Content-Type": "application/json",
      ...(init.headers as Record<string, string> | undefined),
    },
  });
}

/** นับแถวที่ตรงเงื่อนไข (query เช่น "anon_id=eq.x&created_at=gte.2026-...") */
export async function countRows(table: string, query: string): Promise<number> {
  const r = await dbFetch(`${table}?select=*&${query}`, {
    headers: { Prefer: "count=exact", Range: "0-0" },
  });
  if (!r.ok) throw new Error(`นับแถวไม่สำเร็จ (${r.status})`);
  const total = r.headers.get("content-range")?.split("/")[1];
  const n = Number(total);
  return Number.isFinite(n) ? n : 0;
}
