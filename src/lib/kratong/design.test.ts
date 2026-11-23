import { describe, expect, it } from "vitest";
import {
  BASES,
  DEFAULT_DESIGN,
  MAX_DECORS,
  MAX_FLOWERS,
  isDesignAllowed,
  randomDesign,
  sanitizeDesign,
} from "./design";

describe("sanitizeDesign", () => {
  it("ค่าขยะกลายเป็นดีไซน์เริ่มต้นที่ใช้ได้", () => {
    for (const bad of [null, undefined, 42, "x", [], {}]) {
      const d = sanitizeDesign(bad);
      expect(d.base).toBe(DEFAULT_DESIGN.base);
      expect(d.flowers).toEqual([]);
    }
  });

  it("ตัดค่าที่ไม่รู้จัก ค่าซ้ำ และเกินจำนวนสูงสุด", () => {
    const d = sanitizeDesign({
      base: "<script>",
      flowers: ["rose", "rose", "hack", "lotus", "orchid", "jasmine"],
      color: "red",
      decor: ["bird", "sparkle", "ribbon"],
      candle: "nope",
    });
    expect(d.base).toBe("leaf");
    expect(d.color).toBe("gold");
    expect(d.candle).toBe("single");
    expect(d.flowers).toEqual(["rose", "lotus", "orchid"]);
    expect(d.flowers.length).toBeLessThanOrEqual(MAX_FLOWERS);
    expect(d.decor).toEqual(["bird", "sparkle"]);
    expect(d.decor.length).toBeLessThanOrEqual(MAX_DECORS);
  });
});

describe("isDesignAllowed", () => {
  it("ดีไซน์เริ่มต้นใช้ได้ที่เลเวล 0 แต่ชิ้นที่ล็อกใช้ไม่ได้", () => {
    expect(isDesignAllowed(DEFAULT_DESIGN, 0)).toBe(true);
    expect(isDesignAllowed({ ...DEFAULT_DESIGN, base: "star" }, 0)).toBe(false);
    expect(isDesignAllowed({ ...DEFAULT_DESIGN, base: "star" }, 5)).toBe(true);
  });
});

describe("randomDesign", () => {
  it("สุ่มได้เฉพาะชิ้นที่ปลดล็อกแล้ว", () => {
    for (let i = 0; i < 50; i++) {
      const d = randomDesign(0);
      expect(isDesignAllowed(d, 0)).toBe(true);
      expect(sanitizeDesign(d)).toEqual(d);
    }
  });

  it("เลเวลสูงสุดสุ่มได้ทุกฐาน", () => {
    const seen = new Set<string>();
    let n = 0;
    const rand = () => ((n++ * 0.37) % 1);
    for (let i = 0; i < 200; i++) seen.add(randomDesign(99, rand).base);
    expect(seen.size).toBe(BASES.length);
  });
});
