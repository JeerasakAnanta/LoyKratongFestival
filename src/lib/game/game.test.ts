import { beforeEach, describe, expect, it } from "vitest";
import { LEVEL_THRESHOLDS, MAX_LEVEL, levelFor, levelProgress } from "./levels";
import {
  applyEvent,
  createProgress,
  loadProgress,
  previousDay,
  rollDay,
  saveProgress,
  type Progress,
} from "./progress";

const D1 = "2026-11-24";

describe("levels", () => {
  it("แปลงแต้มเป็นเลเวลตามเกณฑ์", () => {
    expect(levelFor(0)).toBe(0);
    expect(levelFor(29)).toBe(0);
    expect(levelFor(30)).toBe(1);
    expect(levelFor(10_000)).toBe(MAX_LEVEL);
  });

  it("levelProgress คำนวณสัดส่วนในเลเวล และเต็มเมื่อถึงสูงสุด", () => {
    expect(levelProgress(15)).toMatchObject({ level: 0, current: 15, needed: 30, ratio: 0.5 });
    expect(levelProgress(LEVEL_THRESHOLDS[MAX_LEVEL]).needed).toBeNull();
    expect(levelProgress(99_999).ratio).toBe(1);
  });
});

describe("previousDay", () => {
  it("ข้ามเดือนและปีได้ถูก", () => {
    expect(previousDay("2026-12-01")).toBe("2026-11-30");
    expect(previousDay("2027-01-01")).toBe("2026-12-31");
  });
});

describe("applyEvent", () => {
  it("ลอยกระทงได้ 10 แต้ม เริ่ม streak และได้ badge ใบแรก", () => {
    const { progress, gain } = applyEvent(createProgress(D1), { type: "float" }, D1);
    // 10 แต้มจากการลอย + 20 โบนัสภารกิจ "ลอย 1 ใบ"
    expect(progress.merit).toBe(30);
    expect(progress.streak).toBe(1);
    expect(gain.missionsDone.map((m) => m.id)).toEqual(["float"]);
    expect(gain.newBadges.map((b) => b.id)).toContain("first-float");
    expect(gain.levelUp).toBe(1);
  });

  it("combo เพิ่มแต้มเก็บขยะ แต่มีเพดาน", () => {
    const base = createProgress(D1);
    expect(applyEvent(base, { type: "litter", combo: 1 }, D1).gain.merit).toBe(3);
    expect(applyEvent(base, { type: "litter", combo: 3 }, D1).gain.merit).toBe(5);
    expect(applyEvent(base, { type: "litter", combo: 99 }, D1).gain.merit).toBe(8);
  });

  it("ภารกิจแต่ละอันรับโบนัสครั้งเดียวต่อวัน", () => {
    let p: Progress = createProgress(D1);
    let bonus = 0;
    for (let i = 0; i < 8; i++) {
      const r = applyEvent(p, { type: "litter", combo: 1 }, D1);
      p = r.progress;
      bonus += r.gain.missionsDone.length;
    }
    expect(bonus).toBe(1);
    expect(p.stats.litter).toBe(8);
  });

  it("ข้ามวันแล้วภารกิจรีเซ็ต แต่สถิติรวมอยู่", () => {
    const day1 = applyEvent(createProgress(D1), { type: "float" }, D1).progress;
    const day2 = applyEvent(day1, { type: "float" }, "2026-11-25");
    expect(day2.progress.missions.counts.float).toBe(1);
    expect(day2.gain.missionsDone.map((m) => m.id)).toEqual(["float"]);
    expect(day2.progress.stats.floated).toBe(2);
  });

  it("streak: วันติดกันนับต่อ, เล่นซ้ำวันเดียวกันไม่เพิ่ม, ขาดวันแล้วเริ่มใหม่", () => {
    let p = applyEvent(createProgress(D1), { type: "float" }, D1).progress;
    p = applyEvent(p, { type: "float" }, D1).progress;
    expect(p.streak).toBe(1);
    p = applyEvent(p, { type: "float" }, "2026-11-25").progress;
    expect(p.streak).toBe(2);
    p = applyEvent(p, { type: "float" }, "2026-11-28").progress;
    expect(p.streak).toBe(1);
  });

  it("ได้ badge streak-3 เมื่อลอยครบ 3 วันติด", () => {
    let p = createProgress(D1);
    let last: string[] = [];
    for (const d of [D1, "2026-11-25", "2026-11-26"]) {
      const r = applyEvent(p, { type: "float" }, d);
      p = r.progress;
      last = r.gain.newBadges.map((b) => b.id);
    }
    expect(last).toContain("streak-3");
    expect(p.badges).toContain("streak-3");
  });
});

describe("rollDay", () => {
  it("เปิดเกมหลังขาดไปหลายวัน streak เป็น 0", () => {
    const p: Progress = { ...createProgress(D1), streak: 4, lastPlayDate: D1 };
    expect(rollDay(p, "2026-11-30").streak).toBe(0);
    expect(rollDay(p, "2026-11-25").streak).toBe(4);
  });
});

describe("load/save", () => {
  beforeEach(() => window.localStorage.clear());

  it("บันทึกแล้วโหลดกลับมาเท่าเดิม", () => {
    const p = applyEvent(createProgress(D1), { type: "float" }, D1).progress;
    saveProgress(p);
    expect(loadProgress(D1)).toEqual(p);
  });

  it("ข้อมูลที่เก็บไว้เสียหาย → เริ่มใหม่ ไม่พัง", () => {
    window.localStorage.setItem("kratong-progress-v1", "{not json");
    expect(loadProgress(D1).merit).toBe(0);
    window.localStorage.setItem(
      "kratong-progress-v1",
      JSON.stringify({ merit: "999", badges: ["ไม่มีจริง"], stats: null }),
    );
    const p = loadProgress(D1);
    expect(p.merit).toBe(0);
    expect(p.badges).toEqual([]);
  });
});
