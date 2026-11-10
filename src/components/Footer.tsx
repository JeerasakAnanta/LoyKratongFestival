import { FESTIVAL_DATE_DISPLAY } from "@/lib/festival-data";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gold/15 bg-night text-gray-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Loy Kratong Festival · เว็บไซต์รวบรวมข้อมูลประเพณีลอยกระทง</p>
        <p>ปีนี้ลอยกระทงวันที่ {FESTIVAL_DATE_DISPLAY}</p>
      </div>
    </footer>
  );
}
