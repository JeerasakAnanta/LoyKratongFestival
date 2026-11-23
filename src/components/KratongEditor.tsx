"use client";

import {
  BASES,
  CANDLES,
  COLORS,
  DECORS,
  FLOWERS,
  MAX_DECORS,
  MAX_FLOWERS,
  isUnlocked,
  randomDesign,
  type KratongDesign,
  type Part,
} from "@/lib/kratong/design";
import KratongView from "./KratongView";

interface Props {
  design: KratongDesign;
  onChange: (next: KratongDesign) => void;
  /** เลเวลผู้เล่น ใช้ตัดสินว่าชิ้นไหนปลดล็อกแล้ว */
  level: number;
}

function toggle(list: string[], id: string, max: number): string[] {
  if (list.includes(id)) return list.filter((x) => x !== id);
  return list.length >= max ? [...list.slice(1), id] : [...list, id];
}

function Chip({
  part,
  selected,
  level,
  onPick,
  swatch,
}: {
  part: Part;
  selected: boolean;
  level: number;
  onPick: () => void;
  swatch?: string;
}) {
  const open = isUnlocked(part, level);
  return (
    <button
      type="button"
      onClick={onPick}
      disabled={!open}
      aria-pressed={selected}
      title={open ? undefined : `ปลดล็อกที่เลเวล ${part.unlock}`}
      className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold ${
        selected
          ? "border-gold bg-gold/15 text-white"
          : "border-white/10 text-gray-300 hover:bg-white/5"
      } disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {swatch && (
        <span
          className="h-3.5 w-3.5 rounded-full border border-white/30"
          style={{ background: swatch }}
          aria-hidden="true"
        />
      )}
      {part.label}
      {!open && <span className="text-xs">🔒 Lv.{part.unlock}</span>}
    </button>
  );
}

function Group({ legend, hint, children }: { legend: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium text-gold">
        {legend}
        {hint && <span className="ml-2 text-xs font-normal text-gray-400">{hint}</span>}
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

export default function KratongEditor({ design, onChange, level }: Props) {
  const set = (patch: Partial<KratongDesign>) => onChange({ ...design, ...patch });

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="h-28 w-28 shrink-0 rounded-2xl border border-white/10 bg-[#0b1a33] p-2">
          <KratongView design={design} />
        </div>
        <button
          type="button"
          onClick={() => onChange(randomDesign(level))}
          className="btn-ghost"
        >
          🎲 สุ่มกระทง
        </button>
      </div>

      <Group legend="ฐานกระทง">
        {BASES.map((p) => (
          <Chip key={p.id} part={p} level={level} selected={design.base === p.id} onPick={() => set({ base: p.id })} />
        ))}
      </Group>

      <Group legend="ดอกไม้" hint={`เลือกได้ ${MAX_FLOWERS} อย่าง`}>
        {FLOWERS.map((p) => (
          <Chip
            key={p.id}
            part={p}
            level={level}
            selected={design.flowers.includes(p.id)}
            onPick={() => set({ flowers: toggle(design.flowers, p.id, MAX_FLOWERS) })}
          />
        ))}
      </Group>

      <Group legend="สีเทียนและริบบิ้น">
        {COLORS.map((p) => (
          <Chip key={p.id} part={p} level={level} swatch={p.hex} selected={design.color === p.id} onPick={() => set({ color: p.id })} />
        ))}
      </Group>

      <Group legend="เทียน">
        {CANDLES.map((p) => (
          <Chip key={p.id} part={p} level={level} selected={design.candle === p.id} onPick={() => set({ candle: p.id })} />
        ))}
      </Group>

      <Group legend="ของประดับ" hint={`เลือกได้ ${MAX_DECORS} อย่าง`}>
        {DECORS.map((p) => (
          <Chip
            key={p.id}
            part={p}
            level={level}
            selected={design.decor.includes(p.id)}
            onPick={() => set({ decor: toggle(design.decor, p.id, MAX_DECORS) })}
          />
        ))}
      </Group>
    </div>
  );
}
