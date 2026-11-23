import { describe, expect, it } from "vitest";
import { checkWish, containsContactInfo, containsProfanity } from "./profanity";

describe("containsProfanity", () => {
  it("คำอธิษฐานปกติผ่าน รวมคำที่มีส่วนเหมือนคำหยาบ", () => {
    for (const ok of [
      "ขอให้ครอบครัวมีความสุข สุขภาพแข็งแรง",
      "ขอบคุณแม่น้ำที่หล่อเลี้ยงเรามาตลอดปี",
      "ขอให้ได้ใส่ของในหีบสมบัติ", // หีบ ไม่ใช่คำหยาบ
      "ลอยความทุกข์ไปกับสายน้ำ",
      "May next year be kind to everyone",
      "Scunthorpe classic assessment", // ไม่มีคำหยาบจริง
    ]) {
      expect(containsProfanity(ok), ok).toBe(false);
    }
  });

  it("จับคำหยาบไทย แม้ใส่วรรณยุกต์หรือเว้นวรรคแทรก", () => {
    expect(containsProfanity("ไอ้เหี้ย")).toBe(true);
    expect(containsProfanity("เ ห ี้ ย")).toBe(true);
    expect(containsProfanity("เหี้ยยย")).toBe(true);
    expect(containsProfanity("หี")).toBe(true);
  });

  it("จับคำหยาบอังกฤษ รวม leet และตัวอักษรแยกกัน", () => {
    expect(containsProfanity("what the fuck")).toBe(true);
    expect(containsProfanity("sh1t")).toBe(true);
    expect(containsProfanity("f u c k")).toBe(true);
  });
});

describe("containsContactInfo", () => {
  it("จับลิงก์ อีเมล เบอร์โทร และ Line ID", () => {
    expect(containsContactInfo("เข้ามาที่ https://example.com")).toBe(true);
    expect(containsContactInfo("เว็บ www.abc.th")).toBe(true);
    expect(containsContactInfo("mail me a@b.co")).toBe(true);
    expect(containsContactInfo("โทร 081-234-5678")).toBe(true);
    expect(containsContactInfo("ไลน์ไอดี: abc123")).toBe(true);
  });

  it("ตัวเลขสั้นๆ ผ่าน", () => {
    expect(containsContactInfo("ขอให้สอบได้ 100 คะแนน ปี 2569")).toBe(false);
  });
});

describe("checkWish", () => {
  it("คืนเหตุผลที่ถูกปฏิเสธ", () => {
    expect(checkWish("ขอให้สบายดี")).toBe("ok");
    expect(checkWish("fuck")).toBe("profanity");
    expect(checkWish("โทร 0812345678")).toBe("contact");
  });
});
