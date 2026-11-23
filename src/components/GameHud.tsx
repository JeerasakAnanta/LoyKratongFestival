import { levelProgress } from "@/lib/game/levels";
import { BADGES, MISSIONS, type Progress } from "@/lib/game/progress";

interface Props {
  progress: Progress;
  combo: number;
  toast: string;
  soundOn: boolean;
  onToggleSound: () => void;
}

export default function GameHud({
  progress,
  combo,
  toast,
  soundOn,
  onToggleSound,
}: Props) {
  const lv = levelProgress(progress.merit);
  const earned = BADGES.filter((b) => progress.badges.includes(b.id));

  return (
    <section aria-label="ความคืบหน้าของคุณ" className="card space-y-3 p-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="font-serif text-lg font-bold text-gold">Lv.{lv.level}</p>
        <div className="min-w-[140px] flex-1">
          <div
            role="progressbar"
            aria-label="แต้มบุญถึงเลเวลถัดไป"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(lv.ratio * 100)}
            className="h-2.5 overflow-hidden rounded-full bg-white/10"
          >
            <div
              className="h-full rounded-full bg-gold transition-[width] duration-500"
              style={{ width: `${lv.ratio * 100}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">
            แต้มบุญ {progress.merit}
            {lv.needed !== null && ` · อีก ${lv.needed - lv.current} แต้มถึง Lv.${lv.level + 1}`}
          </p>
        </div>
        <p className="text-sm text-gray-200" title="ลอยกระทงติดต่อกันกี่วัน">
          🔥 {progress.streak} วัน
        </p>
        {combo >= 2 && (
          <p className="rounded-full bg-gold/15 px-2.5 py-0.5 text-sm font-semibold text-gold">
            คอมโบ ×{combo}
          </p>
        )}
        <button
          type="button"
          onClick={onToggleSound}
          aria-pressed={soundOn}
          className="min-h-[36px] rounded-full border border-white/10 px-3 text-xs text-gray-300 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
        >
          {soundOn ? "🔊 เสียงเปิด" : "🔇 เสียงปิด"}
        </button>
      </div>

      <div>
        <h3 className="mb-1.5 text-xs font-medium text-gold">ภารกิจวันนี้</h3>
        <ul className="grid gap-1.5 sm:grid-cols-3">
          {MISSIONS.map((m) => {
            const count = Math.min(progress.missions.counts[m.id], m.target);
            const done = progress.missions.claimed.includes(m.id);
            return (
              <li
                key={m.id}
                className={`rounded-xl border px-3 py-2 text-xs ${
                  done
                    ? "border-gold/50 bg-gold/10 text-white"
                    : "border-white/10 text-gray-300"
                }`}
              >
                <span className="block">
                  {done ? "✅ " : ""}
                  {m.label}
                </span>
                <span className="text-gray-400">
                  {count}/{m.target} · +{m.reward} แต้ม
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {earned.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="ตราที่ได้รับ">
          {earned.map((b) => (
            <li
              key={b.id}
              className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-gray-200"
            >
              {b.emoji} {b.label}
            </li>
          ))}
        </ul>
      )}

      <p role="status" className="min-h-[1.25rem] text-sm font-medium text-gold">
        {toast}
      </p>
    </section>
  );
}
