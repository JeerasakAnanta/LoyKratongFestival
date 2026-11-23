import { describe, expect, it } from "vitest";
import { countdownLabel, daysUntil } from "./countdown";

describe("daysUntil", () => {
  it("นับวันตามเวลาไทย ไม่ใช่ UTC", () => {
    // 23 พ.ย. 18:00 UTC = 24 พ.ย. 01:00 เวลาไทย → วันนี้
    expect(daysUntil("2026-11-24", new Date("2026-11-23T18:00:00Z"))).toBe(0);
    // 23 พ.ย. 10:00 UTC = 23 พ.ย. 17:00 เวลาไทย → พรุ่งนี้
    expect(daysUntil("2026-11-24", new Date("2026-11-23T10:00:00Z"))).toBe(1);
  });

  it("ติดลบเมื่อพ้นวันงาน", () => {
    expect(daysUntil("2026-11-24", new Date("2026-11-26T05:00:00Z"))).toBe(-2);
  });
});

describe("countdownLabel", () => {
  it("เลือกข้อความตามจำนวนวัน", () => {
    expect(countdownLabel(5)).toContain("5 วัน");
    expect(countdownLabel(1)).toContain("พรุ่งนี้");
    expect(countdownLabel(0)).toContain("วันนี้");
    expect(countdownLabel(-1)).toContain("ปีหน้า");
  });
});
