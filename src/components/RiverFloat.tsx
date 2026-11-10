"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

const STYLES = [
  { id: "lotus", emoji: "🪷", label: "ดอกบัว" },
  { id: "leaf", emoji: "🍃", label: "ใบตอง" },
  { id: "marigold", emoji: "🏵️", label: "ดาวเรือง" },
] as const;

const MAX_WISH = 120;
const MAX_ON_RIVER = 12;

interface Floating {
  id: number;
  emoji: string;
  wish: string;
  top: number;
  rest: number;
  duration: number;
}

let nextId = 0;

export default function RiverFloat() {
  const [wish, setWish] = useState("");
  const [style, setStyle] = useState<(typeof STYLES)[number]["id"]>("lotus");
  const [items, setItems] = useState<Floating[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [announce, setAnnounce] = useState("");
  const wishRef = useRef<HTMLTextAreaElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(window.clearTimeout);
  }, []);

  function release(e: FormEvent) {
    e.preventDefault();
    const text = wish.trim();
    if (!text) return;
    const emoji = STYLES.find((s) => s.id === style)!.emoji;
    const item: Floating = {
      id: nextId++,
      emoji,
      wish: text,
      top: 35 + Math.random() * 45,
      rest: 5 + Math.random() * 60,
      duration: 22 + Math.random() * 10,
    };
    setItems((prev) => [...prev.slice(-(MAX_ON_RIVER - 1)), item]);
    setWish("");
    setAnnounce(`ลอยกระทงแล้ว: ${text}`);
    wishRef.current?.focus();
    // ลบด้วย timer แทน onAnimationEnd เพราะโหมดลดการเคลื่อนไหวปิด animation
    timers.current.push(
      window.setTimeout(() => remove(item.id), item.duration * 1000),
    );
  }

  function remove(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setActiveId((cur) => (cur === id ? null : cur));
  }

  const active = items.find((i) => i.id === activeId);

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <form
        onSubmit={release}
        className="space-y-4 card p-5"
      >
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-gold">
            เลือกกระทง
          </legend>
          <div className="flex gap-2">
            {STYLES.map((s) => (
              <label
                key={s.id}
                className={`flex-1 cursor-pointer rounded-xl border px-2 py-3 text-center text-sm transition ${
                  style === s.id
                    ? "border-gold bg-gold/10 text-white"
                    : "border-white/10 text-gray-300 hover:bg-white/5"
                }`}
              >
                <input
                  type="radio"
                  name="style"
                  value={s.id}
                  checked={style === s.id}
                  onChange={() => setStyle(s.id)}
                  className="sr-only"
                />
                <span className="block text-2xl" aria-hidden="true">
                  {s.emoji}
                </span>
                {s.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label
            htmlFor="wish"
            className="mb-2 block text-sm font-medium text-gold"
          >
            คำอธิษฐาน
          </label>
          <textarea
            id="wish"
            ref={wishRef}
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            maxLength={MAX_WISH}
            rows={4}
            placeholder="ขอให้ปีหน้าสุขภาพแข็งแรง..."
            className="w-full resize-none rounded-xl border border-white/10 bg-night p-3 text-white placeholder:text-gray-500 focus:border-gold focus:outline-none"
          />
          <p className="mt-1 text-right text-xs text-gray-400">
            {wish.length}/{MAX_WISH}
          </p>
        </div>

        <button
          type="submit"
          disabled={!wish.trim()}
          className="btn-gold w-full disabled:cursor-not-allowed disabled:opacity-40"
        >
          ลอยกระทง
        </button>
      </form>

      <div
        role="region"
        aria-label="แม่น้ำจำลอง"
        onKeyDown={(e) => e.key === "Escape" && setActiveId(null)}
        className="relative h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#120d33] via-[#1c1245] to-[#0b1a33]"
      >
        <div
          className="absolute right-8 top-6 h-14 w-14 rounded-full moon-glow"
          aria-hidden="true"
        />
        <div
          className="river-wave absolute inset-x-0 bottom-0 top-[30%] bg-gradient-to-b from-[#12305a]/80 to-[#071428]"
          aria-hidden="true"
        />
        <p role="status" className="sr-only">
          {announce}
        </p>
        {active && (
          <p className="absolute inset-x-4 top-4 z-10 max-w-[70%] rounded-xl bg-black/70 p-3 text-sm text-gold">
            {active.wish}
          </p>
        )}
        {items.length === 0 && (
          <p className="absolute inset-x-0 top-1/2 text-center text-sm text-gray-400">
            เขียนคำอธิษฐานแล้วกด “ลอยกระทง”
          </p>
        )}
        {items.map((it) => (
          <div
            key={it.id}
            className="river-drift pointer-events-none absolute left-0 w-full"
            style={
              {
                top: `${it.top}%`,
                "--dur": `${it.duration}s`,
                "--rest": `${it.rest}%`,
              } as React.CSSProperties
            }
          >
            <div
              tabIndex={0}
              role="group"
              aria-label={`กระทง คำอธิษฐาน: ${it.wish}`}
              onMouseEnter={() => setActiveId(it.id)}
              onMouseLeave={() => setActiveId(null)}
              onFocus={() => setActiveId(it.id)}
              onBlur={() => setActiveId(null)}
              className="river-bob pointer-events-auto relative inline-block w-24 rounded-lg text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              <span className="river-flame absolute -top-1 left-1/2 -translate-x-1/2 text-lg" aria-hidden="true">
                🔥
              </span>
              <span className="block text-5xl" aria-hidden="true">
                {it.emoji}
              </span>
              <span
                aria-hidden="true"
                className="mx-auto mt-1 block max-w-[6rem] truncate rounded bg-black/50 px-1.5 text-[11px] text-gold"
              >
                {it.wish}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
