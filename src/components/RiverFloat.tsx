"use client";

import { useState, type FormEvent } from "react";

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
  duration: number;
}

let nextId = 0;

export default function RiverFloat() {
  const [wish, setWish] = useState("");
  const [style, setStyle] = useState<(typeof STYLES)[number]["id"]>("lotus");
  const [items, setItems] = useState<Floating[]>([]);

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
      duration: 22 + Math.random() * 10,
    };
    setItems((prev) => [...prev.slice(-(MAX_ON_RIVER - 1)), item]);
    setWish("");
  }

  const remove = (id: number) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      <form
        onSubmit={release}
        className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5"
      >
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-amber-200">
            เลือกกระทง
          </legend>
          <div className="flex gap-2">
            {STYLES.map((s) => (
              <label
                key={s.id}
                className={`flex-1 cursor-pointer rounded-xl border px-2 py-3 text-center text-sm transition ${
                  style === s.id
                    ? "border-amber-400 bg-amber-400/10 text-white"
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
            className="mb-2 block text-sm font-medium text-amber-200"
          >
            คำอธิษฐาน
          </label>
          <textarea
            id="wish"
            value={wish}
            onChange={(e) => setWish(e.target.value)}
            maxLength={MAX_WISH}
            rows={4}
            placeholder="ขอให้ปีหน้าสุขภาพแข็งแรง..."
            className="w-full resize-none rounded-xl border border-white/10 bg-charcoal p-3 text-white placeholder:text-gray-500 focus:border-amber-400 focus:outline-none"
          />
          <p className="mt-1 text-right text-xs text-gray-400">
            {wish.length}/{MAX_WISH}
          </p>
        </div>

        <button
          type="submit"
          disabled={!wish.trim()}
          className="w-full rounded-full bg-amber-500 px-5 py-2.5 font-medium text-gray-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ลอยกระทง
        </button>
      </form>

      <div
        role="region"
        aria-label="แม่น้ำจำลอง"
        className="relative h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#1b1440] via-[#241646] to-[#0b1a33]"
      >
        <div
          className="absolute right-8 top-6 h-14 w-14 rounded-full bg-amber-100 shadow-[0_0_60px_20px_rgba(253,230,138,0.35)]"
          aria-hidden="true"
        />
        <div
          className="river-wave absolute inset-x-0 bottom-0 top-[30%] bg-gradient-to-b from-[#12305a]/80 to-[#071428]"
          aria-hidden="true"
        />
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
              { top: `${it.top}%`, "--dur": `${it.duration}s` } as React.CSSProperties
            }
            onAnimationEnd={() => remove(it.id)}
          >
            <div
              tabIndex={0}
              aria-label={`กระทง คำอธิษฐาน: ${it.wish}`}
              className="river-bob group pointer-events-auto relative inline-block w-24 text-center focus:outline-none"
            >
              <span className="river-flame absolute -top-1 left-1/2 -translate-x-1/2 text-lg" aria-hidden="true">
                🔥
              </span>
              <span className="block text-5xl" aria-hidden="true">
                {it.emoji}
              </span>
              <span className="mx-auto mt-1 block max-w-[6rem] truncate rounded bg-black/50 px-1.5 text-[11px] text-amber-100 group-hover:hidden group-focus:hidden">
                {it.wish}
              </span>
              <span className="absolute left-1/2 top-full z-10 mt-1 hidden w-48 -translate-x-1/2 rounded-lg bg-black/80 p-2 text-xs text-amber-100 group-hover:block group-focus:block">
                {it.wish}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
