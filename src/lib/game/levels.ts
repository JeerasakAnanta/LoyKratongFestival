/** แต้มบุญขั้นต่ำของแต่ละเลเวล (index = เลเวล) */
export const LEVEL_THRESHOLDS = [0, 30, 80, 150, 240, 350, 480, 630];
export const MAX_LEVEL = LEVEL_THRESHOLDS.length - 1;

export function levelFor(merit: number): number {
  let level = 0;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (merit >= LEVEL_THRESHOLDS[i]) level = i;
  }
  return level;
}

export interface LevelProgress {
  level: number;
  /** แต้มที่สะสมในเลเวลนี้ */
  current: number;
  /** แต้มที่ต้องใช้ทั้งหมดเพื่อขึ้นเลเวลถัดไป (null ถ้าถึงเลเวลสูงสุดแล้ว) */
  needed: number | null;
  /** 0–1 */
  ratio: number;
}

export function levelProgress(merit: number): LevelProgress {
  const level = levelFor(merit);
  if (level >= MAX_LEVEL) {
    return { level, current: merit - LEVEL_THRESHOLDS[level], needed: null, ratio: 1 };
  }
  const base = LEVEL_THRESHOLDS[level];
  const needed = LEVEL_THRESHOLDS[level + 1] - base;
  const current = merit - base;
  return { level, current, needed, ratio: Math.min(1, current / needed) };
}
