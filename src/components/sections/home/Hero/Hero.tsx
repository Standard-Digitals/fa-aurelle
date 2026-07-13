"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { Leaf, Droplet, Sparkles, Shield, Wind, Flame } from "lucide-react";

/* ---------------------------------------------------------
   CONFIG — tune these after scrubbing your own 26 frames
--------------------------------------------------------- */
const FRAME_COUNT = 26;
const FRAME_PATH = "/frames"; // matches your public/frames/ folder
const CAP_OPEN_END = 0.55; // scroll progress (0-1) where the cap is fully open
const STORY_HEIGHT_VH = 350; // how many viewport-heights the scroll story takes

/* ---------------------------------------------------------
   INGREDIENT RING (appears once the cap is fully open)
--------------------------------------------------------- */
type Ingredient = { icon: React.ReactNode; name: string };

const ingredients: Ingredient[] = [
  { icon: <Leaf size={16} strokeWidth={1.4} />, name: "Argan Oil" },
  { icon: <Droplet size={16} strokeWidth={1.4} />, name: "Hydrolyzed Keratin" },
  { icon: <Sparkles size={16} strokeWidth={1.4} />, name: "Silk Proteins" },
  { icon: <Shield size={16} strokeWidth={1.4} />, name: "Vitamin E" },
  { icon: <Wind size={16} strokeWidth={1.4} />, name: "Biotin" },
  { icon: <Flame size={16} strokeWidth={1.4} />, name: "Aloe Vera" },
];

function IngredientItem({
  ing,
  index,
  total,
  progress,
}: {
  ing: Ingredient;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Alternate left/right so labels sit clear of the bottle, not on top of it
  const isLeft = index % 2 === 0;
  const row = Math.floor(index / 2);
  const rowGap = 96;
  const baseY = -((Math.ceil(total / 2) - 1) * rowGap) / 2;
  const y = baseY + row * rowGap;
  const xOffset = isLeft ? -230 : 230;
  const lineLength = 70;

  const start = CAP_OPEN_END + index * 0.015;
  const itemOpacity = useTransform(progress, [start, start + 0.05], [0, 1]);
  const itemX = useTransform(
    progress,
    [start, start + 0.05],
    [isLeft ? -14 : 14, 0]
  );

  return (
    <motion.div
      style={{
        opacity: itemOpacity,
        x: itemX,
        top: `calc(50% + ${y}px)`,
        left: isLeft ? undefined : `calc(50% + ${xOffset}px)`,
        right: isLeft ? `calc(50% - ${xOffset}px)` : undefined,
      }}
      className="absolute -translate-y-1/2"
    >
      <div
        className={`flex items-center gap-2.5 ${
          isLeft ? "flex-row" : "flex-row-reverse"
        }`}
      >
        <div
          className="h-px shrink-0 bg-white/40"
          style={{ width: lineLength }}
        />
        <div
          className={`flex items-center gap-2.5 rounded-full bg-black/55 py-1.5 pl-1.5 pr-4 backdrop-blur-sm ${
            isLeft ? "" : "flex-row-reverse pl-4 pr-1.5"
          }`}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-black/70">
            {ing.icon}
          </span>
          <span className="whitespace-nowrap text-[12px] font-medium tracking-[0.03em] text-white">
            {ing.name}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function IngredientOverlay({ progress }: { progress: MotionValue<number> }) {
  const ringOpacity = useTransform(
    progress,
    [CAP_OPEN_END, CAP_OPEN_END + 0.1, 0.92, 1],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      style={{ opacity: ringOpacity }}
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      {ingredients.map((ing, i) => (
        <IngredientItem
          key={ing.name}
          ing={ing}
          index={i}
          total={ingredients.length}
          progress={progress}
        />
      ))}
    </motion.div>
  );
}

/* ---------------------------------------------------------
   FRAME-SEQUENCE SCROLL STORY (real bottle photos)
--------------------------------------------------------- */
function frameUrl(index: number) {
  const num = String(index + 1).padStart(3, "0");
  return `${FRAME_PATH}/ezgif-frame-${num}.jpg`;
}

function BottleFrameStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = frameUrl(i);
      img.onload = () => {
        loaded += 1;
        if (!cancelled) setLoadProgress(loaded / FRAME_COUNT);
        if (loaded === FRAME_COUNT && !cancelled) setIsLoaded(true);
      };
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = (progress: number) => {
      const images = imagesRef.current;
      const frameIndex = Math.min(
        images.length - 1,
        Math.max(0, Math.round(progress * (images.length - 1)))
      );
      const img = images[frameIndex];
      if (!img || !img.complete) return;

      const dpr = window.devicePixelRatio || 1;
      const { clientWidth: w, clientHeight: h } = canvas;
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.scale(dpr, dpr);
      }

      const imgRatio = img.width / img.height;
      const boxRatio = w / h;
      const PADDING_SCALE = 0.62; // shrink the bottle so it always fits with margin
      let drawW: number;
      let drawH: number;
      if (imgRatio > boxRatio) {
        drawW = w * PADDING_SCALE;
        drawH = drawW / imgRatio;
      } else {
        drawH = h * PADDING_SCALE;
        drawW = drawH * imgRatio;
      }
      const dx = (w - drawW) / 2;
      const dy = (h - drawH) / 2;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, dx, dy, drawW, drawH);
    };

    const unsubscribe = scrollYProgress.on("change", (v) => draw(v));
    draw(scrollYProgress.get());
    return () => unsubscribe();
  }, [scrollYProgress, isLoaded]);

  const headlineOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <div
      ref={containerRef}
      style={{ height: `${STORY_HEIGHT_VH}vh` }}
      className="relative bg-white"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {!isLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white">
            <div className="h-px w-32 overflow-hidden bg-black/10">
              <motion.div
                className="h-full bg-black"
                animate={{ width: `${Math.round(loadProgress * 100)}%` }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-black/40">
              Loading {Math.round(loadProgress * 100)}%
            </span>
          </div>
        )}

        {isLoaded && (
          <>
            <motion.div
              style={{ opacity: headlineOpacity }}
              className="pointer-events-none absolute left-1/2 top-16 -translate-x-1/2 px-6 text-center"
            >
              <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-black/40">
                The Elixir Ritual
              </p>
              <h2 className="mt-3 text-3xl font-light tracking-tight sm:text-4xl">
                Scroll to uncover what&apos;s inside
              </h2>
            </motion.div>

            <IngredientOverlay progress={scrollYProgress} />
          </>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   EXPORTED HERO
--------------------------------------------------------- */
export function Hero() {
  return (
    <section className="relative bg-white">
      <BottleFrameStory />
    </section>
  );
}