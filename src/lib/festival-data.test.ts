import { describe, expect, it } from "vitest";
import {
  CATEGORY_LABELS,
  FESTIVAL_EVENTS,
} from "./festival-data";

describe("FESTIVAL_EVENTS", () => {
  it("id ไม่ซ้ำกัน", () => {
    const ids = FESTIVAL_EVENTS.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("หมวดหมู่ทุกอันมีป้ายชื่อ และพิกัดอยู่ในประเทศไทย", () => {
    for (const e of FESTIVAL_EVENTS) {
      expect(CATEGORY_LABELS[e.category]).toBeTruthy();
      expect(e.lat).toBeGreaterThan(5);
      expect(e.lat).toBeLessThan(21);
      expect(e.lng).toBeGreaterThan(97);
      expect(e.lng).toBeLessThan(106);
      expect(e.mapUrl).toMatch(/^https:\/\//);
    }
  });

  it("ทุกหมวดมีจุดลอยอย่างน้อยหนึ่งแห่ง", () => {
    for (const cat of Object.keys(CATEGORY_LABELS)) {
      expect(FESTIVAL_EVENTS.some((e) => e.category === cat)).toBe(true);
    }
  });
});
