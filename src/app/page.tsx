import Link from "next/link";
import KratongView from "@/components/KratongView";
import FestivalCountdown from "@/components/FestivalCountdown";
import RiverScene from "@/components/RiverScene";
import {
  FESTIVAL_DATE_DISPLAY,
  FESTIVAL_EVENTS,
  CATEGORY_LABELS,
} from "@/lib/festival-data";

const SAMPLE_DESIGNS = [
  { base: "lotus", flowers: ["lotus", "marigold"], color: "pink", decor: ["sparkle"], candle: "single" },
  { base: "leaf", flowers: ["marigold", "orchid", "jasmine"], color: "gold", decor: ["ribbon"], candle: "triple" },
  { base: "coconut", flowers: ["rose"], color: "blue", decor: ["bird"], candle: "single" },
];

const TIPS = [
  {
    icon: "M5 19c0-8 5-13 14-14 0 9-5 14-14 14Zm0 0 8-8",
    title: "เลือกกระทงวัสดุธรรมชาติ",
    body: "กระทงที่ทำจากใบตอง ก้านกล้วย และดอกไม้จะย่อยสลายเองได้ ส่วนโฟมและพลาสติกจะตกค้างในแม่น้ำเป็นเวลานาน",
  },
  {
    icon: "M12 3c1.5 2.2 1.5 4 0 5.5C10.5 7 10.5 5.2 12 3ZM9 11h6v10H9z",
    title: "ใช้เทียนและธูปให้พอดี",
    body: "จุดเทียนหนึ่งเล่มพอ เพราะคืนลอยกระทงมีควันและเศษเทียนหล่นลงน้ำเป็นจำนวนมาก",
  },
  {
    icon: "M4 10h16l-1.5 10h-13L4 10Zm4 0 3-6m5 6-3-6",
    title: "ช่วยกันเก็บขยะริมน้ำ",
    body: "หลังจบงานแต่ละปีมีกระทงและขยะตกค้างริมแม่น้ำจำนวนมาก เก็บอะไรกลับบ้านได้ ช่วยกันเก็บได้ ก็ช่วยแม่น้ำไว้หนึ่งชีวิต",
  },
];

export default function Home() {
  const featured = FESTIVAL_EVENTS.slice(0, 3);

  return (
    <main>
      {/* Hero */}
      <section className="night-sky relative overflow-hidden pb-56 sm:pb-64">
        <div
          className="moon-glow absolute right-[8%] top-10 h-16 w-16 rounded-full sm:h-24 sm:w-24"
          aria-hidden="true"
        />
        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-6 pt-16 text-center sm:pt-24">
          <p className="mb-3 inline-block rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm text-gold">
            {FESTIVAL_DATE_DISPLAY}
          </p>
          <FestivalCountdown />
          <h1 className="font-serif text-5xl font-bold leading-tight text-white sm:text-7xl">
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
              className="btn-gold"
            >
              ดูจุดลอยกระทงทั่วไทย
            </Link>
            <Link
              href="/float"
              className="btn-ghost"
            >
              ลอยกระทงออนไลน์
            </Link>
            <Link
              href="/about"
              className="btn-ghost"
            >
              รู้จักประวัติลอยกระทง
            </Link>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-56 sm:h-64">
          <RiverScene />
        </div>
      </section>

      {/* ลอยกระทงออนไลน์ */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="card flex flex-col items-center gap-6 p-8 text-center sm:flex-row sm:text-left">
          <div className="flex shrink-0 gap-2" aria-hidden="true">
            {SAMPLE_DESIGNS.map((d, i) => (
              <div key={i} className="h-24 w-20">
                <KratongView design={d} />
              </div>
            ))}
          </div>
          <div className="flex-1">
            <h2 className="section-title">ลอยกระทงออนไลน์</h2>
            <p className="mt-2 leading-relaxed text-gray-300">
              ออกแบบกระทงของคุณเอง เขียนคำอธิษฐาน แล้วลอยไปในแม่น้ำ
              เก็บขยะ อนุโมทนากระทงคนอื่น สะสมแต้มบุญปลดล็อกชิ้นส่วนใหม่
            </p>
          </div>
          <Link href="/float" className="btn-gold shrink-0">
            เริ่มลอยกระทง
          </Link>
        </div>
      </section>

      {/* จุดลอยเด่น */}
      <section className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="section-title">จุดลอยกระทงเด่น</h2>
          <Link
            href="/events"
            className="text-sm text-gold underline-offset-4 hover:underline"
          >
            ดูทั้งหมด
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((event) => (
            <Link
              key={event.id}
              href={`/events#${event.id}`}
              className="group card p-5 transition hover:border-gold/50 hover:bg-white/[0.08]"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold text-white">
                  {event.city}
                </h3>
                <span className="rounded-full bg-gold/10 px-3 py-0.5 text-xs text-gold">
                  {CATEGORY_LABELS[event.category]}
                </span>
              </div>
              <p className="mt-1 text-sm text-gold">{event.venue}</p>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-gray-300">
                {event.description}
              </p>
              <p className="mt-3 text-xs text-gray-300">{event.dateDisplay}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* เคล็ดลับ */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="mb-6 section-title">
          ลอยกระทงอย่างรักษ์แม่น้ำ
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {TIPS.map((tip) => (
            <div
              key={tip.title}
              className="card p-5"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-7 w-7 text-gold"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d={tip.icon} />
              </svg>
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
        <div className="rounded-2xl border border-gold/25 bg-gradient-to-br from-[#2a1f50] to-night p-8 text-center">
          <h2 className="mb-4 section-title">
            บทอธิษฐานก่อนลอยกระทง
          </h2>
          <blockquote className="mx-auto max-w-2xl italic leading-loose text-gold/90">
            &ldquo;ข้าพเจ้าขอบูชาพระแม่คงคา เทวดาประจำลำน้ำ
            ที่ได้บำรุงชีวิตข้าพเจ้าตลอดฤดูกาล
            ขอให้ข้าพเจ้าและครอบครัวมีความสุขความเจริญ
            ทุกข์โทษโรคภัยทั้งหลายจงลอยไปกับกระทงนี้&rdquo;
          </blockquote>
          <p className="mt-4 text-sm text-gray-400">
            ปรับใช้ได้ตามสบายใจ สำคัญที่ใจที่ขอบคุณแม่น้ำ
          </p>
        </div>
      </section>
    </main>
  );
}
