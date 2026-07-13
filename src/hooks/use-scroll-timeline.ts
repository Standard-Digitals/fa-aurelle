"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type ScrollProgress = {
  global: number;
  scene: number;
  sceneIndex: number;
};

/**
 * Master scroll timeline hook.
 * Pins the entire experience and exposes normalized progress (0-1)
 * for the global timeline and per-scene progress.
 */
export function useScrollTimeline(
  containerRef: React.RefObject<HTMLDivElement | null>,
  totalScenes: number,
  onUpdate: (progress: ScrollProgress) => void
) {
  const callbackRef = useRef(onUpdate);
  callbackRef.current = onUpdate;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      onUpdate: (self) => {
        const global = self.progress;
        const sceneFloat = global * totalScenes;
        const sceneIndex = Math.min(Math.floor(sceneFloat), totalScenes - 1);
        const scene = sceneFloat - sceneIndex;
        callbackRef.current({ global, scene, sceneIndex });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [containerRef, totalScenes]);
}

/**
 * Utility: map a value from one range to another, clamped.
 */
export function remap(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  const t = Math.max(0, Math.min(1, (value - inMin) / (inMax - inMin)));
  return outMin + t * (outMax - outMin);
}
