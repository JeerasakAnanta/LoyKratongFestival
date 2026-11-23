"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-3xl flex-1 px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-gold">เกิดข้อผิดพลาด</h1>
      <p className="mt-3 text-gray-300">ลองโหลดหน้านี้อีกครั้ง</p>
      <button onClick={reset} className="btn-gold mt-6">
        ลองใหม่
      </button>
    </main>
  );
}
