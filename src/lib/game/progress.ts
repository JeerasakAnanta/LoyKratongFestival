import { levelFor } from "./levels";

export interface MissionDef {
  id: "float" | "litter" | "bless";
  label: string;
  target: number;
  reward: number;
}

export const MISSIONS: MissionDef[] = [
  { id: "float", label: "ลอยกระทง 1 ใบ", target: 1, reward: 20 },
  { id: "litter", label: "เก็บขยะในแม่น้ำ 5 ชิ้น", target: 5, reward: 20 },
  { id: "bless", label: "อนุโมทนากระทงของผู้อื่น 3 ใบ", target: 3, reward: 20 },
];

export const POINTS = { float: 10, bless: 2, litterBase: 3, litterComboMax: 5 };

export interface BadgeDef {
  id: string;
  label: string;
  emoji: string;
  test: (p: Progress) => boolean;
}

export const BADGES: BadgeDef[] = [
  { id: "first-float", label: "ลอยกระทงใบแรก", emoji: "🪷", test: (p) => p.stats.floated >= 1 },
  { id: "cleaner", label: "นักเก็บขยะ", emoji: "🧹", test: (p) => p.stats.litter >= 20 },
  { id: "kind-heart", label: "ใจบุญ", emoji: "💛", test: (p) => p.stats.blessed >= 10 },
  { id: "streak-3", label: "ลอยครบ 3 วัน", emoji: "🔥", test: (p) => p.streak >= 3 },
  { id: "streak-7", label: "ลอยครบ 7 วัน", emoji: "🌕", test: (p) => p.streak >= 7 },
];

export interface DailyMissions {
  date: string;
  counts: { float: number; litter: number; bless: number };
  claimed: string[];
}

export interface Progress {
  merit: number;
  streak: number;
  lastPlayDate: string | null;
  stats: { floated: number; litter: number; blessed: number };
  badges: string[];
  missions: DailyMissions;
}

export type GameEvent =
  | { type: "float" }
  | { type: "litter"; combo: number }
  | { type: "bless" };

export interface Gain {
  merit: number;
  levelUp: number | null;
  newBadges: BadgeDef[];
  missionsDone: MissionDef[];
}

function emptyMissions(date: string): DailyMissions {
  return { date, counts: { float: 0, litter: 0, bless: 0 }, claimed: [] };
}

export function createProgress(today: string): Progress {
  return {
    merit: 0,
    streak: 0,
    lastPlayDate: null,
    stats: { floated: 0, litter: 0, blessed: 0 },
    badges: [],
    missions: emptyMissions(today),
  };
}

/** วันก่อนหน้าของวันที่ YYYY-MM-DD */
export function previousDay(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** ถ้าข้ามวันแล้วให้รีเซ็ตภารกิจ และถ้าขาดเล่นเกิน 1 วันให้ streak เป็น 0 */
export function rollDay(p: Progress, today: string): Progress {
  let next = p;
  if (p.missions.date !== today) next = { ...next, missions: emptyMissions(today) };
  if (
    next.lastPlayDate &&
    next.lastPlayDate !== today &&
    next.lastPlayDate !== previousDay(today) &&
    next.streak !== 0
  ) {
    next = { ...next, streak: 0 };
  }
  return next;
}

export function applyEvent(
  prev: Progress,
  event: GameEvent,
  today: string,
): { progress: Progress; gain: Gain } {
  let p = rollDay(prev, today);
  const levelBefore = levelFor(p.merit);

  let points = 0;
  const stats = { ...p.stats };
  const counts = { ...p.missions.counts };
  let { streak, lastPlayDate } = p;

  if (event.type === "float") {
    points = POINTS.float;
    stats.floated += 1;
    counts.float += 1;
    if (lastPlayDate !== today) {
      streak = lastPlayDate === previousDay(today) ? streak + 1 : 1;
      lastPlayDate = today;
    }
  } else if (event.type === "litter") {
    points =
      POINTS.litterBase +
      Math.min(Math.max(event.combo - 1, 0), POINTS.litterComboMax);
    stats.litter += 1;
    counts.litter += 1;
  } else {
    points = POINTS.bless;
    stats.blessed += 1;
    counts.bless += 1;
  }

  const claimed = [...p.missions.claimed];
  const missionsDone: MissionDef[] = [];
  for (const m of MISSIONS) {
    if (!claimed.includes(m.id) && counts[m.id] >= m.target) {
      claimed.push(m.id);
      missionsDone.push(m);
      points += m.reward;
    }
  }

  let next: Progress = {
    ...p,
    merit: p.merit + points,
    streak,
    lastPlayDate,
    stats,
    missions: { ...p.missions, counts, claimed },
  };

  const newBadges = BADGES.filter(
    (b) => !next.badges.includes(b.id) && b.test(next),
  );
  if (newBadges.length) {
    next = { ...next, badges: [...next.badges, ...newBadges.map((b) => b.id)] };
  }

  const levelAfter = levelFor(next.merit);
  return {
    progress: next,
    gain: {
      merit: points,
      levelUp: levelAfter > levelBefore ? levelAfter : null,
      newBadges,
      missionsDone,
    },
  };
}

const STORAGE_KEY = "kratong-progress-v1";

function isNum(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v) && v >= 0;
}

/** อ่านจาก localStorage แบบไม่เชื่อข้อมูลที่เก็บไว้ ถ้าผิดรูปแบบจะเริ่มใหม่ */
export function loadProgress(today: string): Progress {
  try {
    const raw = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    if (!raw || typeof raw !== "object") return createProgress(today);
    const base = createProgress(today);
    const p: Progress = {
      merit: isNum(raw.merit) ? raw.merit : 0,
      streak: isNum(raw.streak) ? raw.streak : 0,
      lastPlayDate: typeof raw.lastPlayDate === "string" ? raw.lastPlayDate : null,
      stats: {
        floated: isNum(raw.stats?.floated) ? raw.stats.floated : 0,
        litter: isNum(raw.stats?.litter) ? raw.stats.litter : 0,
        blessed: isNum(raw.stats?.blessed) ? raw.stats.blessed : 0,
      },
      badges: Array.isArray(raw.badges)
        ? raw.badges.filter((b: unknown) => BADGES.some((d) => d.id === b))
        : [],
      missions: {
        date: typeof raw.missions?.date === "string" ? raw.missions.date : base.missions.date,
        counts: {
          float: isNum(raw.missions?.counts?.float) ? raw.missions.counts.float : 0,
          litter: isNum(raw.missions?.counts?.litter) ? raw.missions.counts.litter : 0,
          bless: isNum(raw.missions?.counts?.bless) ? raw.missions.counts.bless : 0,
        },
        claimed: Array.isArray(raw.missions?.claimed)
          ? raw.missions.claimed.filter((c: unknown) => typeof c === "string")
          : [],
      },
    };
    return rollDay(p, today);
  } catch {
    return createProgress(today);
  }
}

export function saveProgress(p: Progress) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // ใช้ localStorage ไม่ได้ก็เล่นต่อได้ แค่ความคืบหน้าจะไม่ถูกเก็บ
  }
}
