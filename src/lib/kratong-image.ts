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

/** วาดการ์ดคำอธิษฐานเป็นภาพ PNG (data URL) สำหรับบันทึกหรือแชร์ */
export function renderWishCard(emoji: string, wish: string): string | null {
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

  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.font = "200px sans-serif";
  ctx.fillText(emoji, 540, 340);

  ctx.fillStyle = "#f2c46d";
  const font = "44px 'Noto Sans Thai', sans-serif";
  ctx.font = font;
  const lines = wrapText((s) => ctx.measureText(s).width, wish, 820).slice(0, 6);
  lines.forEach((l, i) => ctx.fillText(l, 540, 520 + i * 68));

  ctx.fillStyle = "#ffffff99";
  ctx.font = "32px 'Noto Sans Thai', sans-serif";
  ctx.fillText("ลอยกระทง 2569 · Loy Kratong Festival", 540, 1020);

  return canvas.toDataURL("image/png");
}
