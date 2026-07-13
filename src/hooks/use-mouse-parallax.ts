"use client";

import { useEffect, useRef } from "react";

export type MousePosition = { x: number; y: number };

/**
 * Tracks normalized mouse position (-1 to 1) with lerp smoothing.
 */
export function useMouseParallax(strength = 0.02) {
  const mouse = useRef<MousePosition>({ x: 0, y: 0 });
  const smoothed = useRef<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2 * strength;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2 * strength;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [strength]);

  const update = (lerp = 0.05) => {
    smoothed.current.x += (mouse.current.x - smoothed.current.x) * lerp;
    smoothed.current.y += (mouse.current.y - smoothed.current.y) * lerp;
    return smoothed.current;
  };

  return { mouse: smoothed, update };
}
