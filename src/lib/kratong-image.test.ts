import { describe, expect, it } from "vitest";
import { wrapText } from "./kratong-image";

describe("wrapText", () => {
  const measure = (s: string) => Array.from(s).length * 10;

  it("ตัดบรรทัดเมื่อเกินความกว้าง", () => {
    expect(wrapText(measure, "abcdefgh", 30)).toEqual(["abc", "def", "gh"]);
  });

  it("เคารพการขึ้นบรรทัดใหม่ และข้อความสั้นอยู่บรรทัดเดียว", () => {
    expect(wrapText(measure, "ab\ncd", 100)).toEqual(["ab", "cd"]);
    expect(wrapText(measure, "สวัสดี", 100)).toEqual(["สวัสดี"]);
  });
});
