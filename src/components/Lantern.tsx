"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Kratong {
  x: number;
  y: number;
  speed: number;
  size: number;
  hue: number;
  bobPhase: number;
}

const KRATONG_COUNT = 7;
const STAR_COUNT = 60;

export default function Lantern() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const rafRef = useRef<number | null>(null);
  const kratongsRef = useRef<Kratong[]>([]);
  const starsRef = useRef<{ x: number; y: number; r: number; twinkle: number }[]>([]);
  const cssSizeRef = useRef({ width: 0, height: 0 });

  const draw = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, t: number) => {
    const { width, height } = canvas;
    const kratongs = kratongsRef.current;
    const stars = starsRef.current;

    // ท้องฟ้ายามค่ำ
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, "#0b1026");
    sky.addColorStop(0.55, "#1a1040");
    sky.addColorStop(0.62, "#2a1530");
    sky.addColorStop(1, "#120a18");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    // ดวงจันทร์
    ctx.fillStyle = "#f6f1d5";
    ctx.beginPath();
    ctx.arc(width * 0.82, height * 0.14, 22, 0, Math.PI * 2);
    ctx.fill();
    const moonGlow = ctx.createRadialGradient(
      width * 0.82,
      height * 0.14,
      10,
      width * 0.82,
      height * 0.14,
      70
    );
    moonGlow.addColorStop(0, "rgba(246, 241, 213, 0.35)");
    moonGlow.addColorStop(1, "rgba(246, 241, 213, 0)");
    ctx.fillStyle = moonGlow;
    ctx.fillRect(width * 0.82 - 70, height * 0.14 - 70, 140, 140);

    // ดาว (ตำแหน่งคงที่ กะพริบเบาๆ)
    for (const star of stars) {
      const alpha = 0.35 + 0.3 * Math.sin(t * 0.001 + star.twinkle);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }

    const waterline = height * 0.62;

    // ผิวน้ำ
    const water = ctx.createLinearGradient(0, waterline, 0, height);
    water.addColorStop(0, "rgba(46, 28, 60, 0.9)");
    water.addColorStop(1, "rgba(16, 12, 24, 1)");
    ctx.fillStyle = water;
    ctx.fillRect(0, waterline, width, height - waterline);

    // แสงจันทร์สะท้อนบนน้ำ
    ctx.fillStyle = "rgba(246, 241, 213, 0.08)";
    ctx.beginPath();
    ctx.moveTo(width * 0.82 - 26, waterline);
    ctx.lineTo(width * 0.82 + 26, waterline);
    ctx.lineTo(width * 0.82 + 40, height);
    ctx.lineTo(width * 0.82 - 40, height);
    ctx.closePath();
    ctx.fill();

    // กระทง
    for (const k of kratongs) {
      const bob = Math.sin(t * 0.0016 + k.bobPhase) * 2.2;
      const x = k.x;
      const y = k.y + bob;

      // แสงเทียนกระจายรอบกระทง
      const glow = ctx.createRadialGradient(x, y, 2, x, y, k.size * 2.6);
      glow.addColorStop(0, `hsla(${k.hue}, 90%, 70%, 0.55)`);
      glow.addColorStop(1, `hsla(${k.hue}, 90%, 55%, 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, k.size * 2.6, 0, Math.PI * 2);
      ctx.fill();

      // ฐานกระทง (ใบตอง) รูปเรือ
      ctx.fillStyle = `hsl(${140 + k.hue * 0.2}, 30%, ${22 + (k.hue % 12)}%)`;
      ctx.beginPath();
      ctx.ellipse(x, y, k.size, k.size * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();

      // ดอกไม้ประดับ
      ctx.fillStyle = `hsl(${k.hue}, 85%, 72%)`;
      ctx.beginPath();
      ctx.arc(x, y - 1, k.size * 0.22, 0, Math.PI * 2);
      ctx.fill();

      // เทียนไข
      const flame = 1 + 0.25 * Math.sin(t * 0.01 + k.bobPhase * 3);
      ctx.fillStyle = "#ffd27a";
      ctx.beginPath();
      ctx.ellipse(
        x,
        y - k.size * 0.35,
        k.size * 0.08,
        k.size * 0.18 * flame,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // เงาแสงเทียนสะท้อนลงน้ำ
      ctx.fillStyle = `hsla(${k.hue}, 90%, 65%, 0.12)`;
      ctx.beginPath();
      ctx.ellipse(x, y + k.size * 0.8, k.size * 0.7, k.size * 1.4, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const tick = useCallback(
    (t: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const { width: cssWidth, height: cssHeight } = cssSizeRef.current;

      // ขยับกระทงไปตามสายน้ำ
      for (const k of kratongsRef.current) {
        k.x += k.speed;
        if (k.x - k.size > cssWidth + 40) {
          Object.assign(k, {
            x: -40,
            y: cssHeight * 0.62 + Math.random() * cssHeight * 0.32,
            speed: 0.35 + Math.random() * 0.4,
            size: 16 + Math.random() * 12,
            hue: 20 + Math.random() * 30,
            bobPhase: Math.random() * Math.PI * 2,
          });
        }
      }

      draw(ctx, canvas, t);
      rafRef.current = requestAnimationFrame(tick);
    },
    [draw]
  );

  // ตั้งค่า canvas ขนาดจริงตามจอ + สร้างวัตถุเริ่มต้น
  const setup = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // วาดด้วยพิกัด CSS โดยตรง (scale ไว้ที่ transform แล้ว)

    kratongsRef.current = Array.from({ length: KRATONG_COUNT }, () => ({
      x: Math.random() * rect.width,
      y: rect.height * 0.62 + Math.random() * rect.height * 0.32,
      speed: 0.35 + Math.random() * 0.4,
      size: 16 + Math.random() * 12,
      hue: 20 + Math.random() * 30,
      bobPhase: Math.random() * Math.PI * 2,
    }));

    starsRef.current = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height * 0.5,
      r: 0.6 + Math.random() * 1.4,
      twinkle: Math.random() * Math.PI * 2,
    }));

    // วาดเฟรมแรกให้เห็นฉากทันทีแม้ยังไม่กดเล่น
    draw(ctx, canvas, 0);
  }, [draw]);

  useEffect(() => {
    setup();
    window.addEventListener("resize", setup);
    return () => window.removeEventListener("resize", setup);
  }, [setup]);

  const toggle = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    if (next) {
      rafRef.current = requestAnimationFrame(tick);
    } else if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  return (
    <figure className="overflow-hidden rounded-2xl border border-white/10 bg-gray-900/60">
      <canvas
        ref={canvasRef}
        className="block h-72 w-full sm:h-80"
        role="img"
        aria-label="แอนิเมชันกระทงลอยในแม่น้ำยามค่ำคืน มีแสงเทียนและเงาสะท้อนบนน้ำ"
      />
      <figcaption className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm text-gray-300">
        <span>แอนิเมชันจำลองบรรยากาศคืนลอยกระทง กระทงลอยไปตามสายน้ำ</span>
        <button
          type="button"
          onClick={toggle}
          aria-pressed={isPlaying}
          className="btn-gold disabled:opacity-50"
        >
          {isPlaying ? "หยุดชั่วคราว" : "เล่นแอนิเมชัน"}
        </button>
      </figcaption>
    </figure>
  );
}
