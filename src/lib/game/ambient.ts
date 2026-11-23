import { randomDesign, type KratongDesign } from "@/lib/kratong/design";

/**
 * คำอธิษฐานตัวอย่างของ "เพื่อนร่วมแม่น้ำ" ใช้ตอนไม่ได้ต่อแม่น้ำกลาง
 * เพื่อให้ภารกิจอนุโมทนาเล่นได้ในโหมดออฟไลน์
 */
export const AMBIENT_WISHES = [
  "ขอให้ครอบครัวมีความสุข สุขภาพแข็งแรง",
  "ขอบคุณแม่น้ำที่หล่อเลี้ยงเรามาตลอดปี",
  "ขอให้สอบผ่านทุกวิชา",
  "ลอยความเหนื่อยไปกับสายน้ำ",
  "ขอให้ทุกคนที่รักปลอดภัย",
  "ขอให้ปีหน้าได้เจอเรื่องดีๆ",
  "ขอโทษแม่น้ำที่ปีที่แล้วทิ้งขยะ ปีนี้จะเก็บให้",
  "ขอให้งานราบรื่น เงินทองไหลมา",
  "ขอให้หายป่วยไวๆ",
  "ขอให้โลกใบนี้สงบสุข",
];

export interface AmbientKratong {
  design: KratongDesign;
  wish: string;
}

export function makeAmbient(rand: () => number = Math.random): AmbientKratong {
  return {
    design: randomDesign(99, rand),
    wish: AMBIENT_WISHES[Math.floor(rand() * AMBIENT_WISHES.length)],
  };
}
