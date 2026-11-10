import type { Metadata } from "next";
import { FESTIVAL_EVENTS } from "@/lib/festival-data";

export const metadata: Metadata = {
  title: "ติดต่อ",
  description:
    "ติดต่อทีมงานเว็บไซต์ลอยกระทง 2026 พร้อมสรุปพิกัดจุดลอยกระทงทั่วไทย",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10">
        <h1 className="page-title">ติดต่อเรา</h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-gray-300">
          เห็นข้อมูลจุดลอยกระทงที่ควรอัปเดต หรืออยากแนะนำจุดลอยที่ยังไม่มีในเว็บ
          เขียนมาได้เลย
        </p>
      </header>

      <section className="mb-10 card p-6">
        <h2 className="mb-3 font-serif text-xl font-bold text-white">ช่องทางติดต่อ</h2>
        <ul className="space-y-2 text-gray-300">
          <li>
            อีเมล:{" "}
            <a
              href="mailto:hello@loykratong.example"
              className="text-gold underline-offset-4 hover:underline"
            >
              hello@loykratong.example
            </a>
          </li>
          <li>เวลาตอบข้อความ: จันทร์ถึงศุกร์ 09:00 น. ถึง 18:00 น.</li>
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-gray-400">
          เว็บไซต์นี้เป็นข้อมูลสรุปเพื่อใช้อ้างอิงเบื้องต้น
          วันเวลาและกิจกรรมของแต่ละจุดลอยอาจเปลี่ยนแปลงตามประกาศของหน่วยงานจัดงาน
          แนะนำตรวจสอบกับทางจังหวัดหรือเทศบาลอีกครั้งก่อนวันงาน
        </p>
      </section>

      <section>
        <h2 className="mb-6 font-serif text-xl font-bold text-white">
          สรุปพิกัดจุดลอยกระทง
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[560px] text-left text-sm">
            <caption className="sr-only">
              ตารางสรุปจุดลอยกระทงปี 2026 พร้อมพิกัด
            </caption>
            <thead className="bg-white/10 text-gray-200">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  จังหวัด
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  จุดลอยหลัก
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  พิกัด (lat, lng)
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  แผนที่
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-white/5 text-gray-300">
              {FESTIVAL_EVENTS.map((event) => (
                <tr key={event.id}>
                  <td className="px-4 py-3 font-medium text-white">
                    {event.city}
                  </td>
                  <td className="px-4 py-3">{event.venue}</td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {event.lat.toFixed(4)}, {event.lng.toFixed(4)}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={event.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold underline-offset-4 hover:underline"
                    >
                      เปิดแผนที่
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
