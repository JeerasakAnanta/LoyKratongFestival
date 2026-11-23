const KEY = "kratong-sound";

export function loadSoundEnabled(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
}

export function saveSoundEnabled(on: boolean) {
  try {
    window.localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    // ข้าม
  }
}

let ctx: AudioContext | null = null;

/** เล่นโน้ตสั้นๆ ต่อกัน (Hz) ใช้ WebAudio ไม่ต้องมีไฟล์เสียง */
export function playTones(freqs: number[], step = 0.09) {
  try {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;
    ctx ??= new Ctor();
    const now = ctx.currentTime;
    freqs.forEach((f, i) => {
      const osc = ctx!.createOscillator();
      const gain = ctx!.createGain();
      osc.type = "sine";
      osc.frequency.value = f;
      const t = now + i * step;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + step + 0.15);
      osc.connect(gain).connect(ctx!.destination);
      osc.start(t);
      osc.stop(t + step + 0.2);
    });
  } catch {
    // เสียงเล่นไม่ได้ก็ไม่เป็นไร
  }
}

export const SFX = {
  float: [523, 659, 784],
  litter: [880],
  bless: [660, 880],
  levelUp: [523, 659, 784, 1047],
};
