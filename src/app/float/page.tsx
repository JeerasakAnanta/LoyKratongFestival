import type { Metadata } from "next";
import RiverFloat from "@/components/RiverFloat";

export const metadata: Metadata = {
  title: "ลอยกระทงออนไลน์",
  description:
    "เขียนคำอธิษฐาน เลือกกระทง แล้วปล่อยให้ลอยไปตามสายน้ำจำลอง ลอยกระทงได้ทุกที่ ไม่ต้องออกจากบ้าน",
};

export default function FloatPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          ลอยกระทงออนไลน์
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-gray-300">
          เขียนคำอธิษฐาน เลือกกระทง แล้วปล่อยให้ลอยไปตามสายน้ำ
          กระทงของคุณจะเห็นเฉพาะในหน้านี้ ไม่มีการเก็บหรือส่งข้อความไปที่ใด
        </p>
      </header>
      <RiverFloat />
    </main>
  );
}
