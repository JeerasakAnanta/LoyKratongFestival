"use client";

import { useEffect, useState } from "react";
import { countdownLabel, daysUntil } from "@/lib/countdown";
import { FESTIVAL_DATE } from "@/lib/festival-data";

// คำนวณหลัง mount เท่านั้น เพื่อไม่ให้ HTML จาก server ไม่ตรงกับ client
export default function FestivalCountdown() {
  const [days, setDays] = useState<number | null>(null);

  useEffect(() => {
    setDays(daysUntil(FESTIVAL_DATE, new Date()));
  }, []);

  return (
    <p
      className="mb-6 min-h-[1.75rem] font-serif text-xl font-semibold text-white"
      aria-live="polite"
    >
      {days === null ? "" : countdownLabel(days)}
    </p>
  );
}
