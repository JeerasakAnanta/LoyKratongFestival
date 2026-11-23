import { sanitizeDesign, type KratongDesign } from "@/lib/kratong/design";

export interface RemoteKratong {
  id: string;
  createdAt: string;
  design: KratongDesign;
  wish: string;
  blessings: number;
}

const ANON_KEY = "kratong-anon-id";
const OWN_KEY = "kratong-own-ids";

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

/** รหัสนิรนามของเบราว์เซอร์นี้ ใช้จำกัดอัตราและกันกดซ้ำ ไม่ผูกกับตัวตนใดๆ */
export function getAnonId(): string {
  try {
    const saved = window.localStorage.getItem(ANON_KEY);
    if (saved) return saved;
    const id = uuid();
    window.localStorage.setItem(ANON_KEY, id);
    return id;
  } catch {
    return uuid();
  }
}

function readOwn(): string[] {
  try {
    const v = JSON.parse(window.localStorage.getItem(OWN_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** จำว่ากระทงใบไหนเป็นของเรา เพื่อไม่ให้ไปอนุโมทนากระทงตัวเอง */
export function rememberOwn(id: string) {
  try {
    window.localStorage.setItem(OWN_KEY, JSON.stringify([...readOwn(), id].slice(-50)));
  } catch {
    // ข้าม
  }
}

export function isOwn(id: string): boolean {
  return readOwn().includes(id);
}

function cleanItem(raw: unknown): RemoteKratong | null {
  const r = raw as Partial<RemoteKratong> | null;
  if (!r || typeof r.id !== "string" || typeof r.wish !== "string") return null;
  return {
    id: r.id,
    createdAt: typeof r.createdAt === "string" ? r.createdAt : "",
    design: sanitizeDesign(r.design),
    wish: r.wish,
    blessings: typeof r.blessings === "number" ? r.blessings : 0,
  };
}

/** คืน null ถ้าต่อไม่ได้ */
export async function fetchRiver(): Promise<{
  enabled: boolean;
  items: RemoteKratong[];
} | null> {
  try {
    const res = await fetch("/api/kratong", { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    const items = Array.isArray(data.items)
      ? data.items.map(cleanItem).filter((i: RemoteKratong | null): i is RemoteKratong => !!i)
      : [];
    return { enabled: data.enabled === true, items };
  } catch {
    return null;
  }
}

export type PostResult =
  | { ok: true; item: RemoteKratong }
  | {
      ok: false;
      error:
        | "profanity"
        | "contact"
        | "rate-limit"
        | "bad-request"
        | "unavailable";
    };

export async function postKratong(
  design: KratongDesign,
  wish: string,
): Promise<PostResult> {
  try {
    const res = await fetch("/api/kratong", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ design, wish, anonId: getAnonId() }),
    });
    if (res.status === 201) {
      const item = cleanItem((await res.json()).item);
      if (item) return { ok: true, item };
      return { ok: false, error: "unavailable" };
    }
    const code = (await res.json().catch(() => ({}))).error;
    if (code === "profanity" || code === "contact" || code === "rate-limit" || code === "bad-request") {
      return { ok: false, error: code };
    }
    return { ok: false, error: "unavailable" };
  } catch {
    return { ok: false, error: "unavailable" };
  }
}

export async function sendReaction(
  id: string,
  kind: "bless" | "report",
): Promise<boolean> {
  try {
    const res = await fetch(`/api/kratong/${encodeURIComponent(id)}/${kind}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ anonId: getAnonId() }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
