import "server-only";
import { createHash } from "node:crypto";
import { sanitizeDesign, type KratongDesign } from "@/lib/kratong/design";
import { checkWish } from "@/lib/profanity";
import { countRows, dbFetch } from "@/lib/supabase/rest";

export const LIMITS = {
  windowMs: 10 * 60 * 1000,
  createPerWindow: 5,
  actionPerWindow: 60,
  hideAfterReports: 3,
  listLimit: 30,
  listWindowMs: 24 * 60 * 60 * 1000,
  maxWish: 120,
};

export interface PublicKratong {
  id: string;
  createdAt: string;
  design: KratongDesign;
  wish: string;
  blessings: number;
}

export type Failure =
  | "bad-request"
  | "profanity"
  | "contact"
  | "rate-limit"
  | "not-found"
  | "already"
  | "server";

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: Failure };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isUuid = (v: unknown): v is string =>
  typeof v === "string" && UUID.test(v);

const since = (ms: number) =>
  encodeURIComponent(new Date(Date.now() - ms).toISOString());

export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

interface Row {
  id: string;
  created_at: string;
  design: unknown;
  wish: string;
  blessings: number;
}

function toPublic(r: Row): PublicKratong {
  return {
    id: r.id,
    createdAt: r.created_at,
    design: sanitizeDesign(r.design),
    wish: r.wish,
    blessings: r.blessings,
  };
}

export async function listKratongs(): Promise<Result<PublicKratong[]>> {
  try {
    const r = await dbFetch(
      `kratongs?select=id,created_at,design,wish,blessings&hidden=eq.false` +
        `&created_at=gte.${since(LIMITS.listWindowMs)}` +
        `&order=created_at.desc&limit=${LIMITS.listLimit}`,
    );
    if (!r.ok) return { ok: false, error: "server" };
    const rows = (await r.json()) as Row[];
    return { ok: true, data: rows.map(toPublic) };
  } catch {
    return { ok: false, error: "server" };
  }
}

export async function createKratong(input: {
  design: unknown;
  wish: unknown;
  anonId: unknown;
  ip: string;
}): Promise<Result<PublicKratong>> {
  if (!isUuid(input.anonId) || typeof input.wish !== "string") {
    return { ok: false, error: "bad-request" };
  }
  const wish = input.wish.trim();
  if (!wish || Array.from(wish).length > LIMITS.maxWish) {
    return { ok: false, error: "bad-request" };
  }
  const verdict = checkWish(wish);
  if (verdict !== "ok") return { ok: false, error: verdict };

  const design = sanitizeDesign(input.design);
  const ipHash = hashIp(input.ip);

  try {
    const [byAnon, byIp] = await Promise.all([
      countRows(
        "kratongs",
        `anon_id=eq.${input.anonId}&created_at=gte.${since(LIMITS.windowMs)}`,
      ),
      countRows(
        "kratongs",
        `ip_hash=eq.${ipHash}&created_at=gte.${since(LIMITS.windowMs)}`,
      ),
    ]);
    // IP หนึ่งอาจเป็นหลายคนในเครือข่ายเดียวกัน จึงให้โควตาเป็น 3 เท่าของรายคน
    if (byAnon >= LIMITS.createPerWindow || byIp >= LIMITS.createPerWindow * 3) {
      return { ok: false, error: "rate-limit" };
    }

    const r = await dbFetch("kratongs", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        design,
        wish,
        anon_id: input.anonId,
        ip_hash: ipHash,
      }),
    });
    if (!r.ok) return { ok: false, error: "server" };
    const rows = (await r.json()) as Row[];
    if (!rows[0]) return { ok: false, error: "server" };
    return { ok: true, data: toPublic(rows[0]) };
  } catch {
    return { ok: false, error: "server" };
  }
}

/** อนุโมทนาหรือรายงาน: หนึ่งคนทำได้ครั้งเดียวต่อกระทงหนึ่งใบ */
export async function reactToKratong(input: {
  id: unknown;
  anonId: unknown;
  kind: "bless" | "report";
}): Promise<Result<{ hidden: boolean }>> {
  if (!isUuid(input.id) || !isUuid(input.anonId)) {
    return { ok: false, error: "bad-request" };
  }
  try {
    const recent = await countRows(
      "kratong_actions",
      `anon_id=eq.${input.anonId}&created_at=gte.${since(LIMITS.windowMs)}`,
    );
    if (recent >= LIMITS.actionPerWindow) {
      return { ok: false, error: "rate-limit" };
    }

    const ins = await dbFetch("kratong_actions", {
      method: "POST",
      body: JSON.stringify({
        kratong_id: input.id,
        anon_id: input.anonId,
        kind: input.kind,
      }),
    });
    if (ins.status === 409) {
      // PostgREST ส่ง 409 ทั้งกรณีกดซ้ำ (23505) และไม่มีกระทงใบนี้ (23503 foreign key)
      const code = (await ins.json().catch(() => ({}))).code;
      return { ok: false, error: code === "23503" ? "not-found" : "already" };
    }
    if (!ins.ok) return { ok: false, error: "server" };

    if (input.kind === "bless") {
      const r = await dbFetch("rpc/bless_kratong", {
        method: "POST",
        body: JSON.stringify({ k: input.id }),
      });
      return r.ok ? { ok: true, data: { hidden: false } } : { ok: false, error: "server" };
    }

    const r = await dbFetch("rpc/report_kratong", {
      method: "POST",
      body: JSON.stringify({ k: input.id, limit_n: LIMITS.hideAfterReports }),
    });
    if (!r.ok) return { ok: false, error: "server" };
    const reports = Number(await r.json());
    return { ok: true, data: { hidden: reports >= LIMITS.hideAfterReports } };
  } catch {
    return { ok: false, error: "server" };
  }
}
