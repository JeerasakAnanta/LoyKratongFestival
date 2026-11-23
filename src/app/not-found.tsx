import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-gold">ไม่พบหน้านี้</h1>
      <p className="mt-3 text-gray-300">หน้าที่ค้นหาอาจถูกย้ายหรือไม่มีอยู่</p>
      <Link href="/" className="btn-gold mt-6 inline-block">
        กลับหน้าแรก
      </Link>
    </main>
  );
}
