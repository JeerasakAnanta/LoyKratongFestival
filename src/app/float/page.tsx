import type { Metadata } from "next";
import RiverFloat from "@/components/RiverFloat";

export const metadata: Metadata = {
  title: "ลอยกระทงออนไลน์",
  description:
    "ออกแบบกระทงของคุณเอง เขียนคำอธิษฐาน ลอยไปกับคนอื่นในแม่น้ำเดียวกัน เก็บขยะ สะสมแต้มบุญและปลดล็อกชิ้นส่วนใหม่ ลอยกระทงได้ทุกที่ ไม่ต้องออกจากบ้าน",
};

export default function FloatPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="page-title">
          ลอยกระทงออนไลน์
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-gray-300">
          ออกแบบกระทงของคุณเอง เขียนคำอธิษฐาน แล้วปล่อยให้ลอยไปตามสายน้ำ
          เก็บขยะ อนุโมทนากระทงของคนอื่น สะสมแต้มบุญเพื่อปลดล็อกชิ้นส่วนใหม่
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">
          ความเป็นส่วนตัว: แต้มและความคืบหน้าเก็บไว้ในเบราว์เซอร์ของคุณเอง
          เมื่อเชื่อมต่อแม่น้ำกลางอยู่ คำอธิษฐานที่ลอยจะแสดงให้ผู้เล่นคนอื่นเห็นนาน
          24 ชั่วโมงโดยไม่ระบุชื่อ จึงไม่ควรใส่ข้อมูลส่วนตัว
          ถ้าไม่ได้เชื่อมต่อ กระทงจะลอยเฉพาะในเครื่องคุณ
        </p>
      </header>
      <RiverFloat />
    </main>
  );
}
