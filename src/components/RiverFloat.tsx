"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { renderWishCard } from "@/lib/kratong-image";
import {
  DEFAULT_DESIGN,
  sanitizeDesign,
  type KratongDesign,
} from "@/lib/kratong/design";
import KratongEditor from "./KratongEditor";
import KratongView from "./KratongView";

const MAX_WISH = 120;
const MAX_ON_RIVER = 12;

interface Floating {
  id: number;
  design: KratongDesign;
  wish: string;
  top: number;
  rest: number;
  duration: number;
  startedAt: number;
  /** วินาทีที่ลอยไปแล้วตอนโหลดกลับมา (0 สำหรับกระทงที่เพิ่งลอย) ใช้เดินแอนิเมชันต่อจากเดิม */
  offset: number;
}

const STORAGE_KEY = "kratong-river-v2";

let nextId = 0;

function loadSaved(now: number): Floating[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as Floating[];
    if (!Array.isArray(list)) return [];
    return list
      .filter(
        (i) =>
          typeof i?.wish === "string" &&
          typeof i.design === "object" &&
          typeof i.startedAt === "number" &&
          typeof i.duration === "number" &&
          i.startedAt + i.duration * 1000 > now,
      )
      .map((i) => ({
        ...i,
        design: sanitizeDesign(i.design),
        offset: Math.max(0, Math.round((now - i.startedAt) / 100) / 10),
      }));
  } catch {
    return [];
  }
}

function save(items: Floating[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage ใช้ไม่ได้ (โหมดส่วนตัว ฯลฯ) ก็ข้ามไป
  }
}

export default function RiverFloat({ level = 99 }: { level?: number }) {
  const [wish, setWish] = useState("");
  const [design, setDesign] = useState<KratongDesign>(DEFAULT_DESIGN);
  const [items, setItems] = useState<Floating[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [announce, setAnnounce] = useState("");
  const wishRef = useRef<HTMLTextAreaElement>(null);
  const timers = useRef<number[]>([]);

  const [last, setLast] = useState<{ design: KratongDesign; wish: string } | null>(
    null,
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const pending = timers.current;
    const now = Date.now();
    const saved = loadSaved(now);
    saved.forEach((it) => {
      nextId = Math.max(nextId, it.id + 1);
      pending.push(
        window.setTimeout(
          () => remove(it.id),
          it.startedAt + it.duration * 1000 - now,
        ),
      );
    });
    setItems(saved);
    setHydrated(true);
    return () => pending.forEach(window.clearTimeout);
  }, []);

  useEffect(() => {
    if (hydrated) save(items);
  }, [items, hydrated]);

  async function saveImage() {
    if (!last) return;
    const url = await renderWishCard(last.design, last.wish);
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "kratong-wish.png";
    a.click();
  }

  function release(e: FormEvent) {
    e.preventDefault();
    const text = wish.trim();
    if (!text) return;
    const snapshot = sanitizeDesign(design);
    const item: Floating = {
      id: nextId++,
      design: snapshot,
      wish: text,
      top: 35 + Math.random() * 45,
      rest: 5 + Math.random() * 60,
      duration: 22 + Math.random() * 10,
      startedAt: Date.now(),
      offset: 0,
    };
    setItems((prev) => [...prev.slice(-(MAX_ON_RIVER - 1)), item]);
    setLast({ design: snapshot, wish: text });
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
        <KratongEditor design={design} onChange={setDesign} level={level} />

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
        {last && (
          <button type="button" onClick={saveImage} className="btn-ghost w-full">
            บันทึกคำอธิษฐานล่าสุดเป็นภาพ
          </button>
        )}
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
                animationDelay: `-${it.offset}s`,
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
              <span className="mx-auto block h-16 w-14" aria-hidden="true">
                <KratongView design={it.design} />
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
