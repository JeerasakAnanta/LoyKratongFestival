/**
 * กรองคำหยาบ/ลิงก์/ข้อมูลติดต่อ ในคำอธิษฐานก่อนแสดงให้คนอื่นเห็น
 * เป็นด่านแรกเท่านั้น จับได้ไม่ครบทุกกรณี จึงมีปุ่มรายงานเป็นด่านที่สอง
 */

// ตัดวรรณยุกต์/ไม้ไต่คู้/การันต์ ให้ผู้ใช้เติมหรือตัดแล้วยังจับได้ (U+0E47–U+0E4E)
const THAI_MARKS = /[็-๎]/g;
const INVISIBLE = /[​-‍⁠﻿]/g;

const LEET: Record<string, string> = {
  "0": "o",
  "1": "i",
  "3": "e",
  "4": "a",
  "5": "s",
  "@": "a",
  $: "s",
};

/** ข้อความที่ปรับให้เทียบกันได้: พิมพ์เล็ก ตัดวรรณยุกต์ ตัดอักขระล่องหน */
export function normalize(text: string): string {
  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(INVISIBLE, "")
    .replace(THAI_MARKS, "");
}

// คำที่ยาวพอจะจับแบบ "มีอยู่ในข้อความ" ได้โดยไม่ผิดพลาดบ่อย (เขียนแบบไม่มีวรรณยุกต์)
const THAI_SUBSTRING = [
  "ควย",
  "เหีย",
  "สัส",
  "เชีย",
  "ชิบหาย",
  "แมง",
  "อีดอก",
  "ไอ้สัตว",
  "อีสัตว",
  "เย็ด",
  "เยด",
  "ปี่ยก",
  "หัวควย",
  "ไอ้เหี้ย",
];

// คำสั้นที่เป็นส่วนหนึ่งของคำสุภาพได้ (เช่น หีบ) จับเฉพาะเมื่อเป็นคำโดดๆ
const THAI_WHOLE_WORD = ["หี", "ห่า", "ฟาย"].map(normalize);

const EN_WORDS = [
  "fuck",
  "fucker",
  "fucked",
  "fucking",
  "shitty",
  "bitches",
  "shit",
  "bitch",
  "cunt",
  "whore",
  "slut",
  "nigger",
  "nigga",
  "rape",
];

function compact(text: string): string {
  // ตัดทุกอย่างที่ไม่ใช่ตัวอักษร/ตัวเลข เพื่อจับการแทรกเว้นวรรคหรือเครื่องหมาย
  return text.replace(/[^\p{L}\p{M}\p{N}]+/gu, "");
}

export function containsProfanity(input: string): boolean {
  const norm = normalize(input);
  const squashed = compact(norm);

  if (THAI_SUBSTRING.map(normalize).some((w) => squashed.includes(w))) return true;

  const tokens = norm.split(/[^\p{L}\p{M}\p{N}]+/u).filter(Boolean);
  if (tokens.some((t) => THAI_WHOLE_WORD.includes(t))) return true;

  // อังกฤษ: แปลง leet (f*ck ไม่จับ แต่ f0ck/sh1t จับ) แล้วเทียบแบบทั้งคำ
  const leet = norm.replace(/[01345@$]/g, (c) => LEET[c] ?? c);
  const enTokens = mergeSingleLetters(leet.split(/[^a-z]+/).filter(Boolean));
  return enTokens.some((t) => EN_WORDS.includes(t));
}

// "f u c k" → "fuck": รวมตัวอักษรเดี่ยวที่เรียงติดกันเป็นคำเดียว
function mergeSingleLetters(tokens: string[]): string[] {
  const out: string[] = [];
  let run = "";
  for (const t of tokens) {
    if (t.length === 1) {
      run += t;
      continue;
    }
    if (run) out.push(run);
    run = "";
    out.push(t);
  }
  if (run) out.push(run);
  return out;
}

/** ลิงก์ อีเมล เบอร์โทร ห้ามใส่ เพื่อกันสแปมและข้อมูลส่วนตัว */
export function containsContactInfo(input: string): boolean {
  const t = input.normalize("NFKC");
  if (/https?:\/\/|www\.|\b[\w-]+\.(com|net|org|co|th|io|me|xyz|info)\b/i.test(t))
    return true;
  if (/[\w.+-]+@[\w-]+\./.test(t)) return true;
  if (/(?:\d[\s-]?){9,}/.test(t)) return true;
  if (/line\s*(id)?\s*[:：@]/i.test(t) || /ไลน์\s*(ไอดี)?\s*[:：@]/.test(t)) return true;
  return false;
}

export type WishCheck = "ok" | "profanity" | "contact";

export function checkWish(input: string): WishCheck {
  if (containsProfanity(input)) return "profanity";
  if (containsContactInfo(input)) return "contact";
  return "ok";
}
