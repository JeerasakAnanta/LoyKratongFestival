"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { bangkokDateString } from "@/lib/countdown";
import {
  applyEvent,
  createProgress,
  loadProgress,
  saveProgress,
  type Gain,
  type GameEvent,
  type Progress,
} from "./progress";

/** ความคืบหน้าของผู้เล่น เก็บใน localStorage ของเครื่องนี้ */
export function useProgress() {
  const [progress, setProgress] = useState<Progress>(() =>
    createProgress(bangkokDateString(new Date())),
  );
  // ref ถือค่าล่าสุดเสมอ เพื่อให้ dispatch ซ้อนกันเร็วๆ ไม่ทับกัน
  const ref = useRef(progress);

  useEffect(() => {
    const loaded = loadProgress(bangkokDateString(new Date()));
    ref.current = loaded;
    setProgress(loaded);
  }, []);

  const dispatch = useCallback((event: GameEvent): Gain => {
    const { progress: next, gain } = applyEvent(
      ref.current,
      event,
      bangkokDateString(new Date()),
    );
    ref.current = next;
    setProgress(next);
    saveProgress(next);
    return gain;
  }, []);

  return { progress, dispatch };
}
