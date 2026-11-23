const MS_PER_DAY = 86_400_000;

/** วันที่ (YYYY-MM-DD) ตามเวลาประเทศไทย */
export function bangkokDateString(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Bangkok",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** จำนวนวันจนถึงวันงาน: บวก = ยังไม่ถึง, 0 = วันนี้, ลบ = ผ่านไปแล้ว */
export function daysUntil(festivalDate: string, now: Date): number {
  const today = Date.parse(`${bangkokDateString(now)}T00:00:00Z`);
  const target = Date.parse(`${festivalDate}T00:00:00Z`);
  return Math.round((target - today) / MS_PER_DAY);
}

export function countdownLabel(days: number): string {
  if (days > 1) return `อีก ${days} วันถึงวันลอยกระทง`;
  if (days === 1) return "พรุ่งนี้ลอยกระทงแล้ว!";
  if (days === 0) return "วันนี้วันลอยกระทง!";
  return "ลอยกระทงปีนี้ผ่านไปแล้ว แล้วพบกันใหม่ปีหน้า";
}
