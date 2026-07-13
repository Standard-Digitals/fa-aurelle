"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { WithChildren } from "@/types";

gsap.registerPlugin(ScrollTrigger);

function ScrollTriggerSync() {
  useLenis(() => {
    ScrollTrigger.update();
  });
  return null;
}

export function SmoothScrollProvider({ children }: WithChildren) {
  useEffect(() => {
    // Sync Lenis with GSAP ticker
    const ticker = gsap.ticker;
    let lenis: any;

    const raf = (time: number) => {
      lenis?.raf(time * 1000);
    };

    ticker.add(raf);
    ticker.lagSmoothing(0);

    return () => {
      ticker.remove(raf);
    };
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.6,
        smoothWheel: true,
        syncTouch: true,
      }}
    >
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  );
}
