import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ประวัติและความเชื่อ",
  description:
    "ลอยกระทงมีที่มาอย่างไร เชื่ออะไรกันมา และทำกระทงจากวัสดุธรรมชาติยังไง รวมเรื่องราวคืนวันเพ็ญเดือน 12",
};

const MEANINGS = [
  {
    title: "ขอบคุณแม่น้ำ",
    body: "คนไทยดำรงชีวิตอยู่กับสายน้ำมาแต่โบราณ ลอยกระทงคือวันที่ขอบคุณพระแม่คงคาที่หล่อเลี้ยงทั้งกิน ทั้งทำนา ทั้งเดินทาง",
  },
  {
    title: "ลอยสิ่งไม่ดีออกไป",
    body: "เชื่อกันว่าการลอยกระทงพร้อมส่งความทุกข์ โรคภัย และเรื่องไม่ดีในปีที่ผ่านมาออกไปกับสายน้ำ ให้เริ่มต้นปีใหม่อย่างเบาตัว",
  },
  {
    title: "ขอพรเรื่องรักและครอบครัว",
    body: "คู่รักจำนวนมากไปลอยกระทงด้วยกัน เชื่อว่าถ้ากระทงลอยไปคู่กัน ความรักจะราบรื่น บ้านเรือนจะอบอุ่น",
  },
];

const STEPS = [
  "หาก้านกล้วยหรือขั้วพลูมาตัดเป็นวงกลม ขังสะพานด้วยไม้เล็กๆ ให้เป็นฐาน",
  "นำใบตองมาขลิบปริ่นเป็นแถบสวยๆ ตกแต่งรอบฐาน ปักดอกดาวเรือง กุหลาบ หรือดอกไม้ตามฤดู",
  "เสียบธูปและเทียนลงตรงกลาง ประดับเมล็ดพืชหรือต้นไม้เล็กๆ แทนของตกแต่งที่ไม่ย่อยสลาย",
  "จุดเทียน ตั้งจิตอธิษฐาน แล้วค่อยๆ วางกระทงลงน้ำให้ลอยไปตามสายน้ำ",
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-10">
        <h1 className="page-title">
          เรื่องของลอยกระทง
        </h1>
        <p className="mt-3 max-w-2xl leading-relaxed text-gray-300">
          ลอยกระทงเกิดขึ้นในคืนวันเพ็ญเดือน 12 ตามปฏิทินจันทรคติไทย
          ช่วงเดือนพฤศจิกายนของทุกปี เป็นประเพณีที่มีหลักฐานย้อนไปถึงสมัยสุโขทัย
        </p>
      </header>

      <section className="mb-10 card p-6">
        <h2 className="mb-4 section-title">ที่มาของประเพณี</h2>
        <div className="space-y-4 leading-relaxed text-gray-300">
          <p>
            ตำนานที่คนไทยเล่าต่อกันคือเรื่องนางนพมาศ นางกำนัลผู้เลอโฉมในราชสำนักสุโขทัย
            คืนวันเพ็ญเดือน 12 นางประดิษฐ์กระทงรูปดอกบัวตระการตา
            ลอยถวายสมเด็จพระร่วงเจ้า พระองค์ทอดพระเนตรเห็นความงาม
            จึงโปรดให้เป็นประเพณีสืบทอดมาตั้งแต่นั้น
          </p>
          <p>
            นักประวัติศาสตร์หลายท่านเชื่อว่ารากของลอยกระทงอาจเก่ากว่านั้น
            รับอิทธิพลมาจากพิธีลอยโคมของชาวฮินดูและพุทธในอินเดียและศรีลังกา
            ที่ใช้แสงไฟและสายน้ำเป็นสัญลักษณ์ของการล้างมลทิน
            ก่อนจะผสมกับวิถีไทยจนกลายเป็นหนึ่งเดียวกับลำน้ำของเราเอง
          </p>
          <p>
            จุดร่วมของทุกคำอธิบายคือแสงไฟและสายน้ำ
            คนไทยโบราณเชื่อว่าแสงเทียนในกระทงคือการบูชาพระพุทธรูปที่ประดิษฐานตามที่ต่างๆ
            และการลอยลงน้ำคือการน้อมรับพรจากพระแม่คงคา
          </p>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-6 section-title">
          คนลอยกระทงเพื่ออะไร
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {MEANINGS.map((item) => (
            <div
              key={item.title}
              className="card p-5"
            >
              <h3 className="font-semibold text-gold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-300">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10 card p-6">
        <h2 className="mb-4 section-title">
          ทำกระทงเองจากวัสดุธรรมชาติ
        </h2>
        <ol className="list-decimal space-y-3 pl-5 leading-relaxed text-gray-300">
          {STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-gray-400">
          เคล็ดลับคือทำฐานให้แน่น กระทงจะได้ไม่แตกกลางน้ำ
          และเลี่ยงการใช้สีทาเล็บ กิ๊บ หรือพลาสติกตกแต่ง
        </p>
      </section>

      <section className="rounded-2xl border border-gold/25 bg-gradient-to-br from-[#2a1f50] to-night p-6 text-center">
        <p className="text-gray-300">
          อยากไปลอยกระทงกับคนจำนวนมาก หรือชอบบรรยากาศเมืองเก่า?
        </p>
        <Link
          href="/events"
          className="mt-3 inline-block btn-gold"
        >
          เลือกจุดลอยกระทง
        </Link>
      </section>
    </main>
  );
}
