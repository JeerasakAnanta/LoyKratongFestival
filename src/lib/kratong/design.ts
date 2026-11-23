/** ชิ้นส่วนกระทงทั้งหมด `unlock` คือเลเวลขั้นต่ำที่ใช้ชิ้นนั้นได้ (0 = ใช้ได้ตั้งแต่เริ่ม) */
export interface Part {
  id: string;
  label: string;
  unlock: number;
}

export const BASES: Part[] = [
  { id: "leaf", label: "ใบตอง", unlock: 0 },
  { id: "lotus", label: "กลีบบัว", unlock: 0 },
  { id: "coconut", label: "กะลา", unlock: 2 },
  { id: "star", label: "ดาวทอง", unlock: 5 },
];

export const FLOWERS: Part[] = [
  { id: "marigold", label: "ดาวเรือง", unlock: 0 },
  { id: "lotus", label: "บัวชมพู", unlock: 0 },
  { id: "orchid", label: "กล้วยไม้", unlock: 1 },
  { id: "jasmine", label: "มะลิ", unlock: 3 },
  { id: "rose", label: "กุหลาบ", unlock: 6 },
];

export const DECORS: Part[] = [
  { id: "ribbon", label: "ริบบิ้น", unlock: 0 },
  { id: "sparkle", label: "ประกาย", unlock: 2 },
  { id: "bird", label: "นกน้อย", unlock: 4 },
  { id: "lantern", label: "โคมจิ๋ว", unlock: 7 },
];

export const CANDLES: Part[] = [
  { id: "single", label: "เทียนเล่มเดียว", unlock: 0 },
  { id: "triple", label: "เทียนสามเล่ม", unlock: 3 },
];

export interface ColorPart extends Part {
  hex: string;
}

export const COLORS: ColorPart[] = [
  { id: "gold", label: "ทอง", unlock: 0, hex: "#f2c46d" },
  { id: "pink", label: "ชมพู", unlock: 0, hex: "#f4a6c0" },
  { id: "blue", label: "ฟ้า", unlock: 1, hex: "#7cc4f2" },
  { id: "green", label: "เขียว", unlock: 2, hex: "#7fd6a0" },
  { id: "purple", label: "ม่วง", unlock: 4, hex: "#b69cf5" },
  { id: "white", label: "ขาวมุก", unlock: 6, hex: "#f4f1ea" },
];

export const MAX_FLOWERS = 3;
export const MAX_DECORS = 2;

export interface KratongDesign {
  base: string;
  flowers: string[];
  color: string;
  decor: string[];
  candle: string;
}

export const DEFAULT_DESIGN: KratongDesign = {
  base: "leaf",
  flowers: ["marigold", "lotus"],
  color: "gold",
  decor: [],
  candle: "single",
};

const ids = (parts: Part[]) => parts.map((p) => p.id);

function pick(value: unknown, allowed: string[], fallback: string): string {
  return typeof value === "string" && allowed.includes(value) ? value : fallback;
}

function pickMany(value: unknown, allowed: string[], max: number): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  for (const v of value) {
    if (typeof v === "string" && allowed.includes(v) && !out.includes(v)) {
      out.push(v);
    }
    if (out.length >= max) break;
  }
  return out;
}

/**
 * แปลงค่าที่ไม่น่าเชื่อถือ (เช่น จาก localStorage หรือ request) ให้เป็นดีไซน์ที่ถูกต้องเสมอ
 * ไม่ตรวจเลเวล เพราะฝั่ง server ไม่รู้เลเวลของผู้เล่น
 */
export function sanitizeDesign(input: unknown): KratongDesign {
  const o = (input && typeof input === "object" ? input : {}) as Record<
    string,
    unknown
  >;
  return {
    base: pick(o.base, ids(BASES), DEFAULT_DESIGN.base),
    flowers: pickMany(o.flowers, ids(FLOWERS), MAX_FLOWERS),
    color: pick(o.color, ids(COLORS), DEFAULT_DESIGN.color),
    decor: pickMany(o.decor, ids(DECORS), MAX_DECORS),
    candle: pick(o.candle, ids(CANDLES), DEFAULT_DESIGN.candle),
  };
}

export function isUnlocked(part: Part, level: number): boolean {
  return part.unlock <= level;
}

function find<T extends Part>(parts: T[], id: string): T | undefined {
  return parts.find((p) => p.id === id);
}

/** true ถ้าทุกชิ้นในดีไซน์ปลดล็อกแล้วที่เลเวลนี้ */
export function isDesignAllowed(design: KratongDesign, level: number): boolean {
  const checks: (Part | undefined)[] = [
    find(BASES, design.base),
    find(COLORS, design.color),
    find(CANDLES, design.candle),
    ...design.flowers.map((f) => find(FLOWERS, f)),
    ...design.decor.map((d) => find(DECORS, d)),
  ];
  return checks.every((p) => p && isUnlocked(p, level));
}

export function colorHex(id: string): string {
  return find(COLORS, id)?.hex ?? COLORS[0].hex;
}

/** สุ่มดีไซน์จากชิ้นที่ปลดล็อกแล้วเท่านั้น (rand ใส่เองได้เพื่อให้เทสต์คงที่) */
export function randomDesign(
  level: number,
  rand: () => number = Math.random,
): KratongDesign {
  const open = <T extends Part>(parts: T[]) =>
    parts.filter((p) => isUnlocked(p, level));
  const one = <T extends Part>(parts: T[]) => {
    const list = open(parts);
    return list[Math.floor(rand() * list.length)].id;
  };
  const many = (parts: Part[], max: number) => {
    const list = [...open(parts)];
    const n = Math.min(list.length, 1 + Math.floor(rand() * max));
    const out: string[] = [];
    for (let i = 0; i < n; i++) {
      out.push(list.splice(Math.floor(rand() * list.length), 1)[0].id);
    }
    return out;
  };
  return {
    base: one(BASES),
    flowers: many(FLOWERS, MAX_FLOWERS),
    color: one(COLORS),
    decor: rand() < 0.5 ? [] : many(DECORS, MAX_DECORS),
    candle: one(CANDLES),
  };
}
