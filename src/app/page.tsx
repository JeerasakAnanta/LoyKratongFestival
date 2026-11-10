import Link from "next/link";
import Lantern from "@/components/Lantern";
import {
  FESTIVAL_DATE_DISPLAY,
  FESTIVAL_EVENTS,
  CATEGORY_LABELS,
} from "@/lib/festival-data";

const TIPS = [
  {
    icon: "🍃",
    title: "เลือกกระทงวัสดุธรรมชาติ",
    body: "กระทงที่ทำจากใบตอง ก้านกล้วย และดอกไม้จะย่อยสลายเองได้ ส่วนโฟมและพลาสติกจะตกค้างในแม่น้ำเป็นเวลานาน",
  },
  {
    icon: "🕯️",
    title: "ใช้เทียนและธูปให้พอดี",
    body: "จุดเทียนหนึ่งเล่มพอ เพราะคืนลอยกระทงมีควันและเศษเทียนหล่นลงน้ำเป็นจำนวนมาก",
  },
  {
    icon: "🧺",
    title: "ช่วยกันเก็บขยะริมน้ำ",
    body: "หลังจบงานแต่ละปีมีกระทงและขยะตกค้างริมแม่น้ำจำนวนมาก เห็บอะไรกลับบ้านได้ ช่วยกันเก็บได้ ก็ช่วยแม่น้ำไว้หนึ่งชีวิต",
  },
];

export default function Home() {
  const featured = FESTIVAL_EVENTS.slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#1b1440] via-[#241646] to-charcoal">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
          <p className="mb-6 inline-block rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-1.5 text-sm text-amber-200">
            {FESTIVAL_DATE_DISPLAY}
          </p>
          <h1 className="text-4xl font-bold leading-tight text-white sm:text-6xl">
            ลอยกระทง 2569
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-300">
            คืนวันเพ็ญเดือนสิบสอง คนไทยลอยกระทงลงแม่น้ำ
            เพื่อขอบคุณสายน้ำที่หล่อเลี้ยงชีวิต ลอยความทุกข์และสิ่งไม่ดีออกไป
            และขอพรให้ชีวิตรุ่งเรืองในปีที่จะมาถึง
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/events"
              className="rounded-full bg-amber-500 px-6 py-3 font-medium text-gray-900 transition hover:bg-amber-400"
            >
              ดูจุดลอยกระทงทั่วไทย
            </Link>
            <Link
              href="/float"
              className="rounded-full border border-amber-300/40 px-6 py-3 font-medium text-amber-200 transition hover:bg-amber-300/10"
            >
              ลอยกระทงออนไลน์ 🪷
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-white/25 px-6 py-3 font-medium text-white transition hover:bg-white/10"
            >
              รู้จักประวัติลอยกระทง
            </Link>
          </div>
        </div>
      </section>

      {/* แอนิเมชัน */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="mb-4 text-2xl font-bold text-white">
          บรรยากาศคืนลอยกระทง
        </h2>
        <Lantern />
      </section>

      {/* จุดลอยเด่น */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-white">จุดลอยกระทงเด่น</h2>
          <Link
            href="/events"
            className="text-sm text-amber-300 underline-offset-4 hover:underline"
          >
            ดูทั้งหมด
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((event) => (
            <Link
              key={event.id}
              href={`/events#${event.id}`}
              className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-amber-300/40 hover:bg-white/10"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold text-white">
                  {event.city}
                </h3>
                <span className="rounded-full bg-purple-500/20 px-3 py-0.5 text-xs text-purple-200">
                  {CATEGORY_LABELS[event.category]}
                </span>
              </div>
              <p className="mt-1 text-sm text-amber-200">{event.venue}</p>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-300">
                {event.description}
              </p>
              <p className="mt-3 text-xs text-gray-500">{event.dateDisplay}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* เคล็ดลับ */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-6 text-2xl font-bold text-white">
          ลอยกระทงอย่างรักษ์แม่น้ำ
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {TIPS.map((tip) => (
            <div
              key={tip.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <span className="text-2xl" aria-hidden="true">
                {tip.icon}
              </span>
              <h3 className="mt-3 font-semibold text-white">{tip.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-300">
                {tip.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* บทอธิษฐาน */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border border-amber-300/20 bg-gradient-to-br from-[#2a1f50] to-charcoal p-8 text-center">
          <h2 className="mb-4 text-2xl font-bold text-white">
            บทอธิษฐานก่อนลอยกระทง
          </h2>
          <blockquote className="mx-auto max-w-2xl italic leading-loose text-amber-100/90">
            &ldquo;ข้าวบูชาพระแม่คงคา เทวดาประจำลำน้ำ
            ที่ได้บำรุงชีวิตข้าพเจ้าตลอดฤดูกาล
            ขอให้ข้าพเจ้าและครอบครัวมีความสุขความเจริญ
            ทุกข์โทษโรคภัยทั้งหลายจงล่อยไปกับกระทงนี้&rdquo;
          </blockquote>
          <p className="mt-4 text-sm text-gray-400">
            ปรับใช้ได้ตามสบายใจ สำคัญที่ใจที่ขอบคุณแม่น้ำ
          </p>
        </div>
      </section>
    </main>
  );
}
