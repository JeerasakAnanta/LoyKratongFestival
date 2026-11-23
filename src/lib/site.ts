/** ตั้งค่า NEXT_PUBLIC_SITE_URL ตอน deploy เช่น https://example.com */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/** ตั้งค่า NEXT_PUBLIC_CONTACT_EMAIL เป็นอีเมลจริง ถ้าไม่ตั้งจะใช้อีเมลเริ่มต้นนี้ */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "jeerasakananta@gmail.com";
