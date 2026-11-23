"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";
import { renderWishCard } from "@/lib/kratong-image";
import {
  DEFAULT_DESIGN,
  sanitizeDesign,
  unlockedAt,
  type KratongDesign,
} from "@/lib/kratong/design";
import { makeAmbient } from "@/lib/game/ambient";
import { levelFor } from "@/lib/game/levels";
import type { GameEvent, Gain } from "@/lib/game/progress";
import {
  SFX,
  loadSoundEnabled,
  playTones,
  saveSoundEnabled,
} from "@/lib/game/sound";
import { useProgress } from "@/lib/game/useProgress";
import GameHud from "./GameHud";
import KratongEditor from "./KratongEditor";
import KratongView from "./KratongView";

const MAX_WISH = 120;
const MAX_MINE = 12;
const MAX_AMBIENT = 3;
const MAX_LITTER = 4;
const LITTER_EMOJI = ["🥤", "🛍️", "🥫", "🍾"];
const COMBO_WINDOW_MS = 3500;

interface Floating {
  id: number;
  /** true = กระทงของเราเอง, false = ของผู้อื่น (อนุโมทนาได้) */
  mine: boolean;
  design: KratongDesign;
  wish: string;
  top: number;
  rest: number;
  duration: number;
  startedAt: number;
  /** วินาทีที่ลอยไปแล้วตอนโหลดกลับมา (0 สำหรับกระทงที่เพิ่งลอย) ใช้เดินแอนิเมชันต่อจากเดิม */
  offset: number;
  blessed?: boolean;
}

interface Litter {
  id: number;
  emoji: string;
  top: number;
  rest: number;
  duration: number;
}

interface Pop {
  id: number;
  x: number;
  y: number;
  text: string;
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
        mine: true,
        design: sanitizeDesign(i.design),
        offset: Math.max(0, Math.round((now - i.startedAt) / 100) / 10),
      }));
  } catch {
    return [];
  }
}

function save(items: Floating[]) {
  try {
    // เก็บเฉพาะกระทงของเรา กระทงของผู้อื่นสุ่มใหม่ทุกครั้ง
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(items.filter((i) => i.mine)),
    );
  } catch {
    // localStorage ใช้ไม่ได้ (โหมดส่วนตัว ฯลฯ) ก็ข้ามไป
  }
}

export default function RiverFloat() {
  const [wish, setWish] = useState("");
  const [design, setDesign] = useState<KratongDesign>(DEFAULT_DESIGN);
  const [items, setItems] = useState<Floating[]>([]);
  const [litter, setLitter] = useState<Litter[]>([]);
  const [pops, setPops] = useState<Pop[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [announce, setAnnounce] = useState("");
  const [toast, setToast] = useState("");
  const [combo, setCombo] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [last, setLast] = useState<{ design: KratongDesign; wish: string } | null>(
    null,
  );
  const [hydrated, setHydrated] = useState(false);

  const { progress, dispatch } = useProgress();
  const level = levelFor(progress.merit);

  const wishRef = useRef<HTMLTextAreaElement>(null);
  const riverRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const comboRef = useRef({ count: 0, at: 0 });
  const soundRef = useRef(false);
  soundRef.current = soundOn;

  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setActiveId((cur) => (cur === id ? null : cur));
  }, []);

  const spawnAmbient = useCallback(() => {
    const a = makeAmbient();
    const item: Floating = {
      id: nextId++,
      mine: false,
      design: a.design,
      wish: a.wish,
      top: 35 + Math.random() * 45,
      rest: 5 + Math.random() * 60,
      duration: 26 + Math.random() * 8,
      startedAt: Date.now(),
      offset: 0,
    };
    setItems((prev) =>
      prev.filter((i) => !i.mine).length >= MAX_AMBIENT ? prev : [...prev, item],
    );
    later(() => removeItem(item.id), item.duration * 1000);
  }, [later, removeItem]);

  const spawnLitter = useCallback(() => {
    const it: Litter = {
      id: nextId++,
      emoji: LITTER_EMOJI[Math.floor(Math.random() * LITTER_EMOJI.length)],
      top: 38 + Math.random() * 44,
      rest: 5 + Math.random() * 70,
      duration: 16 + Math.random() * 6,
    };
    setLitter((prev) => (prev.length >= MAX_LITTER ? prev : [...prev, it]));
    later(
      () => setLitter((prev) => prev.filter((l) => l.id !== it.id)),
      it.duration * 1000,
    );
  }, [later]);

  // โหลดกระทงที่ยังลอยอยู่ + เปิดเสียงตามที่เคยตั้ง + เริ่มสร้างขยะ/กระทงผู้อื่น
  useEffect(() => {
    const pending = timers.current;
    const now = Date.now();
    const saved = loadSaved(now);
    saved.forEach((it) => {
      nextId = Math.max(nextId, it.id + 1);
      pending.push(
        window.setTimeout(() => removeItem(it.id), it.startedAt + it.duration * 1000 - now),
      );
    });
    setItems(saved);
    setSoundOn(loadSoundEnabled());
    setHydrated(true);

    const tick = (fn: () => void) => () => {
      if (document.visibilityState === "visible") fn();
    };
    const first = window.setTimeout(tick(spawnAmbient), 1500);
    const litterTimer = window.setInterval(tick(spawnLitter), 4500);
    const ambientTimer = window.setInterval(tick(spawnAmbient), 12000);
    return () => {
      pending.forEach(window.clearTimeout);
      window.clearTimeout(first);
      window.clearInterval(litterTimer);
      window.clearInterval(ambientTimer);
    };
  }, [removeItem, spawnAmbient, spawnLitter]);

  useEffect(() => {
    if (hydrated) save(items);
  }, [items, hydrated]);

  function award(event: GameEvent, sfx: number[]): Gain {
    const gain = dispatch(event);
    const parts = [`+${gain.merit} แต้มบุญ`];
    gain.missionsDone.forEach((m) => parts.push(`ภารกิจสำเร็จ: ${m.label}`));
    gain.newBadges.forEach((b) => parts.push(`ได้ตรา ${b.emoji} ${b.label}`));
    if (gain.levelUp !== null) {
      const names = unlockedAt(gain.levelUp).map((p) => p.label);
      parts.push(
        `เลเวลอัป! Lv.${gain.levelUp}${names.length ? ` ปลดล็อก ${names.join(", ")}` : ""}`,
      );
    }
    const text = parts.join(" · ");
    setToast(text);
    setAnnounce(text);
    later(() => setToast((cur) => (cur === text ? "" : cur)), 5000);
    if (soundRef.current) playTones(gain.levelUp !== null ? SFX.levelUp : sfx);
    return gain;
  }

  function pop(e: MouseEvent<HTMLElement>, text: string) {
    const box = riverRef.current?.getBoundingClientRect();
    if (!box) return;
    // คลิกจากคีย์บอร์ดจะได้พิกัด 0,0 จึงใช้กลางองค์ประกอบแทน
    const target = e.currentTarget.getBoundingClientRect();
    const x = e.detail === 0 ? target.left + target.width / 2 : e.clientX;
    const y = e.detail === 0 ? target.top : e.clientY;
    const p: Pop = { id: nextId++, x: x - box.left, y: y - box.top, text };
    setPops((prev) => [...prev, p]);
    later(() => setPops((prev) => prev.filter((q) => q.id !== p.id)), 1000);
  }

  function collectLitter(e: MouseEvent<HTMLElement>, id: number) {
    const now = Date.now();
    const c = comboRef.current;
    c.count = now - c.at <= COMBO_WINDOW_MS ? c.count + 1 : 1;
    c.at = now;
    setCombo(c.count);
    later(() => {
      if (Date.now() - comboRef.current.at >= COMBO_WINDOW_MS) setCombo(0);
    }, COMBO_WINDOW_MS + 50);
    setLitter((prev) => prev.filter((l) => l.id !== id));
    const gain = award({ type: "litter", combo: c.count }, SFX.litter);
    pop(e, `+${gain.merit}`);
  }

  function bless(e: MouseEvent<HTMLElement>, it: Floating) {
    if (it.mine || it.blessed) return;
    setItems((prev) => prev.map((i) => (i.id === it.id ? { ...i, blessed: true } : i)));
    const gain = award({ type: "bless" }, SFX.bless);
    pop(e, `🙏 +${gain.merit}`);
  }

  async function saveImage() {
    if (!last) return;
    const url = await renderWishCard(last.design, last.wish);
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "kratong-wish.png";
    a.click();
  }

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    saveSoundEnabled(next);
    if (next) playTones(SFX.bless);
  }

  function release(e: FormEvent) {
    e.preventDefault();
    const text = wish.trim();
    if (!text) return;
    const snapshot = sanitizeDesign(design);
    const item: Floating = {
      id: nextId++,
      mine: true,
      design: snapshot,
      wish: text,
      top: 35 + Math.random() * 45,
      rest: 5 + Math.random() * 60,
      duration: 22 + Math.random() * 10,
      startedAt: Date.now(),
      offset: 0,
    };
    setItems((prev) => {
      const mine = prev.filter((i) => i.mine);
      const drop = mine.length >= MAX_MINE ? mine[0].id : null;
      return [...prev.filter((i) => i.id !== drop), item];
    });
    setLast({ design: snapshot, wish: text });
    setWish("");
    award({ type: "float" }, SFX.float);
    wishRef.current?.focus();
    // ลบด้วย timer แทน onAnimationEnd เพราะโหมดลดการเคลื่อนไหวปิด animation
    later(() => removeItem(item.id), item.duration * 1000);
  }

  const active = items.find((i) => i.id === activeId);
  const mineCount = items.filter((i) => i.mine).length;

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <form onSubmit={release} className="space-y-4 card p-5">
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

      <div className="space-y-4">
        <GameHud
          progress={progress}
          combo={combo}
          toast={toast}
          soundOn={soundOn}
          onToggleSound={toggleSound}
        />

        <div
          ref={riverRef}
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
          {mineCount === 0 && (
            <p className="absolute inset-x-0 top-1/2 text-center text-sm text-gray-400">
              เขียนคำอธิษฐานแล้วกด “ลอยกระทง”
            </p>
          )}

          {litter.map((l) => (
            <div
              key={l.id}
              className="river-drift pointer-events-none absolute left-0 w-full"
              style={
                {
                  top: `${l.top}%`,
                  "--dur": `${l.duration}s`,
                  "--rest": `${l.rest}%`,
                } as React.CSSProperties
              }
            >
              <button
                type="button"
                aria-label="ขยะในแม่น้ำ กดเพื่อเก็บ"
                onClick={(e) => collectLitter(e, l.id)}
                className="river-bob pointer-events-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/30 text-2xl opacity-90 hover:bg-black/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
              >
                <span aria-hidden="true">{l.emoji}</span>
              </button>
            </div>
          ))}

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
                role={it.mine ? "group" : "button"}
                aria-label={
                  it.mine
                    ? `กระทง คำอธิษฐาน: ${it.wish}`
                    : `กระทงของผู้อื่น คำอธิษฐาน: ${it.wish} ${it.blessed ? "(อนุโมทนาแล้ว)" : "กดเพื่ออนุโมทนา"}`
                }
                onClick={it.mine ? undefined : (e) => bless(e, it)}
                onKeyDown={
                  it.mine
                    ? undefined
                    : (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          (e.currentTarget as HTMLElement).click();
                        }
                      }
                }
                onMouseEnter={() => setActiveId(it.id)}
                onMouseLeave={() => setActiveId(null)}
                onFocus={() => setActiveId(it.id)}
                onBlur={() => setActiveId(null)}
                className={`river-bob pointer-events-auto relative inline-block w-24 rounded-lg text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${
                  it.mine ? "" : "cursor-pointer opacity-90"
                }`}
              >
                {it.blessed && (
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg"
                    aria-hidden="true"
                  >
                    ✨
                  </span>
                )}
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

          {pops.map((p) => (
            <span
              key={p.id}
              aria-hidden="true"
              className="river-pop pointer-events-none absolute z-20 text-sm font-bold text-gold"
              style={{ left: p.x, top: p.y }}
            >
              {p.text}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400">
          เคล็ดลับ: กดขยะในแม่น้ำเพื่อเก็บ (ยิ่งเก็บติดกันยิ่งได้คอมโบ)
          และกดกระทงของผู้อื่นเพื่ออนุโมทนา
          กระทงตัวอย่างของ &ldquo;เพื่อนร่วมแม่น้ำ&rdquo; ยังเป็นข้อความสมมติ
        </p>
      </div>
    </div>
  );
}
