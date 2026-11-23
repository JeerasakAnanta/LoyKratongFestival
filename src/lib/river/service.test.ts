import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LIMITS, createKratong, listKratongs, reactToKratong } from "./service";

const ANON = "11111111-1111-4111-8111-111111111111";
const KID = "22222222-2222-4222-8222-222222222222";

type Call = { url: string; init?: RequestInit };

/** mock fetch: ตอบตามลำดับที่กำหนด และเก็บคำขอไว้ตรวจ */
function mockFetch(responses: Response[]) {
  const calls: Call[] = [];
  const fn = vi.fn(async (url: string, init?: RequestInit) => {
    calls.push({ url: String(url), init });
    const r = responses.shift();
    if (!r) throw new Error("mock fetch หมด: " + url);
    return r;
  });
  vi.stubGlobal("fetch", fn);
  return calls;
}

const counted = (n: number) =>
  new Response("[]", { status: 206, headers: { "content-range": `0-0/${n}` } });
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status });

const row = {
  id: KID,
  created_at: "2026-11-24T10:00:00Z",
  design: { base: "evil", flowers: ["rose"] },
  wish: "ขอให้สบายดี",
  blessings: 0,
};

beforeEach(() => {
  vi.stubEnv("SUPABASE_URL", "https://x.supabase.co");
  vi.stubEnv("SUPABASE_SERVICE_ROLE_KEY", "service-key");
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("createKratong", () => {
  const valid = { design: {}, wish: "ขอให้สบายดี", anonId: ANON, ip: "1.2.3.4" };

  it("ปฏิเสธคำหยาบ ลิงก์ และข้อมูลผิดรูปแบบ โดยไม่แตะฐานข้อมูล", async () => {
    const calls = mockFetch([]);
    expect(await createKratong({ ...valid, wish: "ไอ้เหี้ย" })).toEqual({ ok: false, error: "profanity" });
    expect(await createKratong({ ...valid, wish: "ดูที่ https://a.com" })).toEqual({ ok: false, error: "contact" });
    expect(await createKratong({ ...valid, wish: "   " })).toEqual({ ok: false, error: "bad-request" });
    expect(await createKratong({ ...valid, wish: "ก".repeat(LIMITS.maxWish + 1) })).toEqual({ ok: false, error: "bad-request" });
    expect(await createKratong({ ...valid, anonId: "not-a-uuid" })).toEqual({ ok: false, error: "bad-request" });
    expect(calls).toHaveLength(0);
  });

  it("เกินโควตาต่อ anon_id → rate-limit", async () => {
    mockFetch([counted(LIMITS.createPerWindow), counted(0)]);
    expect(await createKratong(valid)).toEqual({ ok: false, error: "rate-limit" });
  });

  it("สร้างสำเร็จ: sanitize ดีไซน์ และไม่ส่ง IP จริงลงฐานข้อมูล", async () => {
    const calls = mockFetch([counted(0), counted(0), json([row], 201)]);
    const r = await createKratong({
      ...valid,
      design: { base: "evil", flowers: ["rose", "hack"] },
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.data.design.base).toBe("leaf"); // ค่าไม่รู้จักถูกแทนด้วยค่าเริ่มต้น
      expect(r.data).not.toHaveProperty("anon_id");
    }
    const insert = calls[2];
    expect(insert.init?.method).toBe("POST");
    const sent = JSON.parse(String(insert.init?.body));
    expect(sent.design.flowers).toEqual(["rose"]);
    expect(sent.ip_hash).toMatch(/^[0-9a-f]{32}$/);
    expect(JSON.stringify(sent)).not.toContain("1.2.3.4");
    // ใช้ service key ผ่าน header ฝั่ง server
    expect((insert.init?.headers as Record<string, string>).apikey).toBe("service-key");
  });

  it("ฐานข้อมูลล้มเหลว → server error ไม่โยนข้อยกเว้น", async () => {
    mockFetch([counted(0), counted(0), json({}, 500)]);
    expect(await createKratong(valid)).toEqual({ ok: false, error: "server" });
  });
});

describe("listKratongs", () => {
  it("ส่งเฉพาะฟิลด์สาธารณะ และกรองเฉพาะที่ไม่ถูกซ่อน", async () => {
    const calls = mockFetch([json([row])]);
    const r = await listKratongs();
    expect(calls[0].url).toContain("hidden=eq.false");
    expect(calls[0].url).not.toContain("anon_id");
    expect(r.ok && r.data[0]).toEqual({
      id: KID,
      createdAt: row.created_at,
      design: expect.objectContaining({ base: "leaf" }),
      wish: row.wish,
      blessings: 0,
    });
  });
});

describe("reactToKratong", () => {
  it("อนุโมทนาครั้งแรกสำเร็จ แล้วเรียก rpc", async () => {
    const calls = mockFetch([counted(0), json({}, 201), new Response(null, { status: 204 })]);
    const r = await reactToKratong({ id: KID, anonId: ANON, kind: "bless" });
    expect(r.ok).toBe(true);
    expect(calls[2].url).toContain("rpc/bless_kratong");
  });

  it("กดซ้ำ (409) → already และไม่เรียก rpc", async () => {
    const calls = mockFetch([counted(0), json({}, 409)]);
    expect(await reactToKratong({ id: KID, anonId: ANON, kind: "bless" })).toEqual({ ok: false, error: "already" });
    expect(calls).toHaveLength(2);
  });

  it("409 จาก foreign key (ไม่มีกระทงใบนี้) → not-found ไม่ใช่ already", async () => {
    mockFetch([counted(0), json({ code: "23503" }, 409)]);
    expect(await reactToKratong({ id: KID, anonId: ANON, kind: "report" })).toEqual({ ok: false, error: "not-found" });
  });

  it("รายงานครบเกณฑ์ → hidden true", async () => {
    mockFetch([counted(0), json({}, 201), json(LIMITS.hideAfterReports)]);
    const r = await reactToKratong({ id: KID, anonId: ANON, kind: "report" });
    expect(r).toEqual({ ok: true, data: { hidden: true } });
  });

  it("id หรือ anonId ไม่ใช่ UUID → bad-request", async () => {
    mockFetch([]);
    expect(await reactToKratong({ id: "1; drop table", anonId: ANON, kind: "report" })).toEqual({ ok: false, error: "bad-request" });
  });

  it("เกินโควตาการกด → rate-limit", async () => {
    mockFetch([counted(LIMITS.actionPerWindow)]);
    expect(await reactToKratong({ id: KID, anonId: ANON, kind: "bless" })).toEqual({ ok: false, error: "rate-limit" });
  });
});
