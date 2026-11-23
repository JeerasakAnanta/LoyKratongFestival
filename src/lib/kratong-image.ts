import { createElement } from "react";
import type { KratongDesign } from "@/lib/kratong/design";

/** ตัดข้อความเป็นบรรทัดตามความกว้าง (ภาษาไทยไม่มีเว้นวรรค จึงตัดทีละตัวอักษร) */
export function wrapText(
  measure: (s: string) => number,
  text: string,
  maxWidth: number,
): string[] {
  const lines: string[] = [];
  let line = "";
  for (const ch of Array.from(text)) {
    if (ch === "\n") {
      lines.push(line);
      line = "";
      continue;
    }
    if (line && measure(line + ch) > maxWidth) {
      lines.push(line);
      line = ch;
    } else {
      line += ch;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("โหลดภาพกระทงไม่สำเร็จ"));
    img.src = src;
  });
}

/** วาดการ์ดคำอธิษฐานเป็นภาพ PNG (data URL) สำหรับบันทึกหรือแชร์ */
export async function renderWishCard(
  design: KratongDesign,
  wish: string,
): Promise<string | null> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const bg = ctx.createLinearGradient(0, 0, 0, 1080);
  bg.addColorStop(0, "#120d33");
  bg.addColorStop(0.6, "#1c1245");
  bg.addColorStop(1, "#0a0920");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1080, 1080);

  // react-dom/server โหลดตอนกดบันทึกเท่านั้น เพื่อไม่ให้หนักหน้าเว็บตอนเปิด
  const [{ renderToStaticMarkup }, { default: KratongView }] =
    await Promise.all([
      import("react-dom/server"),
      import("@/components/KratongView"),
    ]);
  const svg = renderToStaticMarkup(
    createElement(KratongView, { design, size: 360 }),
  );
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  try {
    ctx.drawImage(await loadImage(url), 360, 120, 360, 396);
  } catch {
    // วาดกระทงไม่ได้ก็ยังบันทึกการ์ดข้อความต่อไป
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#f2c46d";
  ctx.font = "44px 'Noto Sans Thai', sans-serif";
  const lines = wrapText((s) => ctx.measureText(s).width, wish, 820).slice(0, 6);
  lines.forEach((l, i) => ctx.fillText(l, 540, 620 + i * 66));

  ctx.fillStyle = "#ffffff99";
  ctx.font = "32px 'Noto Sans Thai', sans-serif";
  ctx.fillText("ลอยกระทง 2569 · Loy Kratong Festival", 540, 1020);

  return canvas.toDataURL("image/png");
}
