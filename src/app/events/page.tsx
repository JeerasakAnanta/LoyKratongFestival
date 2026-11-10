import type { Metadata } from "next";
import Link from "next/link";
import {
  CATEGORY_LABELS,
  FESTIVAL_DATE_DISPLAY,
  FESTIVAL_EVENTS,
} from "@/lib/festival-data";

export const metadata: Metadata = {
  title: "จุดลอยกระทง 2026",
  description:
    "รวมจุดลอยกระทงสำคัญปี 2026 ทั้งกรุงเทพฯ สุโขทัย เชียงใหม่ ตาก และอยุธยา พร้อมพิกัดและสิ่งที่ต้องรู้ก่อนไป",
};

export default function EventsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">
          จุดลอยกระทงทั่วไทย
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-gray-300">
          ปีนี้ลอยกระทง{FESTIVAL_DATE_DISPLAY} เลือกจุดลอยใกล้บ้าน
          หรือขับไปเที่ยวงานใหญ่ประจำจังหวัด แต่ละที่มีเอกลักษณ์ไม่เหมือนกัน
        </p>
      </header>

      <div className="space-y-6">
        {FESTIVAL_EVENTS.map((event) => (
          <article
            key={event.id}
            id={event.id}
            className="scroll-mt-24 rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {event.city}
                  <span className="ml-2 text-sm font-normal text-gray-400">
                    {event.cityEn}
                  </span>
                </h2>
                <p className="mt-1 text-amber-200">{event.venue}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-200">
                  {CATEGORY_LABELS[event.category]}
                </span>
                <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs text-amber-200">
                  {event.dateDisplay}
                </span>
              </div>
            </div>

            <p className="mt-4 leading-relaxed text-gray-300">
              {event.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={event.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-amber-500 px-5 py-2 text-sm font-medium text-gray-900 transition hover:bg-amber-400"
              >
                เปิดแผนที่ 🗺️
              </a>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        <p className="text-gray-300">
          อยากรู้ที่มาของประเพณีและวิธีทำกระทงเอง?
        </p>
        <Link
          href="/about"
          className="mt-3 inline-block rounded-full border border-amber-300/40 px-5 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-300/10"
        >
          อ่านเรื่องลอยกระทง
        </Link>
      </div>
    </main>
  );
}
