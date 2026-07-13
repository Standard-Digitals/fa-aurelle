"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ingredients = [
  { name: "Argan Oil", position: "top-left" },
  { name: "Jojoba Oil", position: "top-right" },
  { name: "Camellia Oil", position: "bottom-left" },
  { name: "Vitamin E", position: "bottom-right" },
];

function IngredientLabels({ scrollProgress }: { scrollProgress: number }) {
  const show = scrollProgress > 0.6 && scrollProgress < 0.82;
  if (!show) return null;

  const baseOpacity = Math.min(1, (scrollProgress - 0.6) / 0.08);
  const fadeOut = scrollProgress > 0.78 ? Math.max(0, 1 - (scrollProgress - 0.78) / 0.04) : 1;
  const opacity = baseOpacity * fadeOut;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity }}>
      {ingredients.map((ing, i) => {
        const delay = i * 0.03;
        const itemProgress = Math.max(0, Math.min(1, (scrollProgress - 0.6 - delay) / 0.06));
        const positions: Record<string, string> = {
          "top-left": "top-[10%] left-[-60%]",
          "top-right": "top-[10%] right-[-60%]",
          "bottom-left": "bottom-[25%] left-[-60%]",
          "bottom-right": "bottom-[25%] right-[-60%]",
        };

        return (
          <div
            key={ing.name}
            className={`absolute ${positions[ing.position]} flex items-center gap-2`}
            style={{
              opacity: itemProgress,
              transform: `translateY(${(1 - itemProgress) * 10}px)`,
            }}
          >
            <div className="h-[1px] w-6 bg-black/20" />
            <span className="whitespace-nowrap text-[10px] font-medium tracking-[0.05em] text-black/60">
              {ing.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

const FloatingBottle = dynamic(
  () => import("@/components/three/FloatingBottle").then((m) => m.FloatingBottle),
  { ssr: false }
);

export function Hero() {
  const pageRef = useRef<HTMLDivElement>(null);
  const bottleRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const page = pageRef.current;
    const bottle = bottleRef.current;
    if (!page || !bottle) return;

    ScrollTrigger.create({
      trigger: page,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
      onUpdate: (self) => setScrollProgress(self.progress),
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: page,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
    });

    // Hero: right side
    tl.set(bottle, {
      top: "50%",
      left: "auto",
      right: "4%",
      xPercent: 0,
      yPercent: -50,
      scale: 1,
      opacity: 1,
    });

    // → Moves toward center-right
    tl.to(bottle, {
      right: "25%",
      top: "48%",
      scale: 0.95,
      duration: 0.08,
      ease: "power2.inOut",
    });

    // → Section 2 (Silk Fusion): right side
    tl.to(bottle, {
      right: "2%",
      top: "50%",
      scale: 0.85,
      duration: 0.1,
      ease: "power2.inOut",
    });

    // → Section 3 (Benefits): right
    tl.to(bottle, {
      right: "3%",
      top: "50%",
      scale: 0.85,
      duration: 0.12,
      ease: "power2.inOut",
    });

    // → Section 4 (Transformation): center-right
    tl.to(bottle, {
      right: "30%",
      top: "50%",
      scale: 0.9,
      duration: 0.1,
      ease: "power2.inOut",
    });

    // → Section 5 (How to use): center — CAP OPENS + INGREDIENTS
    tl.to(bottle, {
      right: "32%",
      top: "50%",
      scale: 1,
      duration: 0.15,
      ease: "power2.inOut",
    });

    // → Section 6 (Lady): left
    tl.to(bottle, {
      right: "auto",
      left: "4%",
      top: "50%",
      scale: 0.85,
      duration: 0.15,
      ease: "power2.inOut",
    });

    // → Section 7 (Best Seller): center
    tl.to(bottle, {
      left: "auto",
      right: "30%",
      top: "45%",
      scale: 0.9,
      duration: 0.1,
      ease: "power2.inOut",
    });

    // → Reviews: fade out
    tl.to(bottle, {
      right: "30%",
      top: "50%",
      scale: 0.7,
      opacity: 0,
      duration: 0.08,
      ease: "power2.out",
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={pageRef}>
      {/* ═══ FIXED 3D BOTTLE ═══ */}
      <div
        ref={bottleRef}
        className="fixed z-30 pointer-events-none"
        style={{
          width: "320px",
          height: "440px",
          top: "50%",
          right: "4%",
          transform: "translateY(-50%)",
        }}
      >
        <FloatingBottle scrollProgress={scrollProgress} />
        <IngredientLabels scrollProgress={scrollProgress} />
      </div>

      {/* ═══ SECTION 1: HERO ═══ */}
      <section className="relative flex min-h-screen items-center bg-white">
        <div className="mx-auto w-full max-w-[1316px] px-6">
          <div className="max-w-[520px] py-32">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.3em] text-black/40">
              Luxury Hair Science
            </p>
            <h1 className="text-[clamp(2.2rem,4.5vw,4rem)] font-light leading-[1.06] tracking-[-0.02em] text-black">
              Mirror-Like Shine.
              <br />
              <em className="font-light italic">Weightless Elegance.</em>
            </h1>
            <p className="mt-6 max-w-[380px] text-[14px] font-light leading-[1.9] text-black/45">
              Transform dull, frizzy hair into silky, luminous strands with
              exceptional glass-like radiance powered by Silk Botanique Fusion™.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <button className="bg-black px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-500 hover:bg-black/85">
                Discover Elixir
              </button>
              <button className="border border-black/15 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-black transition-all duration-500 hover:border-black/40">
                Shop Now
              </button>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-2">
          <span className="text-[9px] uppercase tracking-[0.25em] text-black/25">Scroll</span>
          <div className="h-8 w-px animate-pulse bg-gradient-to-b from-black/20 to-transparent" />
        </div>
      </section>

      {/* ═══ SECTION 2: SILK BOTANIQUE FUSION ═══ */}
      <section className="relative bg-[#faf9f7] py-32">
        <div className="mx-auto w-full max-w-[1316px] px-6">
          <div className="max-w-[550px]">
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-black/35">
              The Science
            </p>
            <h2 className="text-[clamp(1.8rem,3vw,2.8rem)] font-light leading-[1.12] tracking-[-0.01em] text-black">
              Powered by
              <br />
              <em className="italic">Silk Botanique Fusion™</em>
            </h2>
            <p className="mt-6 text-[14px] font-light leading-[1.9] text-black/50">
              A proprietary blend of botanical silk proteins and rare plant
              extracts that coat each strand in liquid glass. Our patented
              micro-encapsulation technology delivers active ingredients
              directly to the hair cortex for lasting transformation.
            </p>
            <div className="mt-8 flex items-center gap-6">
              <div className="text-center">
                <p className="text-[28px] font-light text-black">97%</p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-black/40">Shinier Hair</p>
              </div>
              <div className="h-8 w-px bg-black/10" />
              <div className="text-center">
                <p className="text-[28px] font-light text-black">72hr</p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-black/40">Frizz Control</p>
              </div>
              <div className="h-8 w-px bg-black/10" />
              <div className="text-center">
                <p className="text-[28px] font-light text-black">100%</p>
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-black/40">Vegan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3: BENEFITS ═══ */}
      <section className="relative bg-black py-32 text-white">
        <div className="mx-auto w-full max-w-[1316px] px-6">
          <div className="max-w-[550px]">
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-white/35">Key Benefits</p>
            <h2 className="text-[clamp(1.6rem,2.5vw,2.4rem)] font-light tracking-[-0.01em] text-white">
              Everything your hair deserves
            </h2>
            <div className="mt-12 flex flex-col gap-8">
              {[
                { num: "01", title: "Mirror-Like Shine", desc: "Glass-like radiance that catches light from every angle" },
                { num: "02", title: "72hr Humidity Defence", desc: "Advanced polymer shield locks out moisture and frizz" },
                { num: "03", title: "Weightless Formula", desc: "Zero residue, zero buildup — just pure silk" },
                { num: "04", title: "Instant Frizz Control", desc: "Tames flyaways from the very first application" },
                { num: "05", title: "Silk Touch Finish", desc: "Salon-smooth texture that lasts between washes" },
              ].map((b) => (
                <div key={b.num} className="flex gap-5 border-b border-white/[0.06] pb-6">
                  <span className="text-[11px] font-light text-white/20">{b.num}</span>
                  <div>
                    <h3 className="text-[14px] font-medium tracking-[0.02em] text-white/90">{b.title}</h3>
                    <p className="mt-1 text-[12px] font-light text-white/40">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 4: TRANSFORMATION ═══ */}
      <section className="relative bg-white py-32">
        <div className="mx-auto w-full max-w-[1316px] px-6">
          <div className="text-center">
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-black/35">Transformations</p>
            <h2 className="text-[clamp(1.6rem,2.5vw,2.4rem)] font-light tracking-[-0.01em] text-black">
              See the difference
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { before: "Dry & Damaged", after: "Silky & Smooth" },
              { before: "Frizzy & Unruly", after: "Sleek & Controlled" },
              { before: "Dull & Lifeless", after: "Mirror-Like Shine" },
            ].map((t, i) => (
              <div key={i} className="group overflow-hidden rounded-sm">
                <div className="relative aspect-[3/4] bg-gradient-to-b from-[#f5f3f0] to-[#ebe7e2]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-black/25">Before & After</p>
                  </div>
                </div>
                <div className="flex items-center justify-between bg-[#faf9f7] px-5 py-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-black/30">Before</p>
                    <p className="text-[12px] font-medium text-black/60">{t.before}</p>
                  </div>
                  <div className="h-px w-8 bg-black/10" />
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-wider text-black/30">After</p>
                    <p className="text-[12px] font-medium text-black/80">{t.after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5: HOW TO USE — Cap opens here ═══ */}
      <section className="relative bg-[#faf9f7] py-32">
        <div className="mx-auto w-full max-w-[1316px] px-6">
          <div className="max-w-[480px]">
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-black/35">The Ritual</p>
            <h2 className="text-[clamp(1.6rem,2.5vw,2.4rem)] font-light tracking-[-0.01em] text-black">
              How to use
            </h2>
            <div className="mt-12 flex flex-col gap-10">
              {[
                { step: "01", title: "Dispense", desc: "Press pump 2-3 times for medium-length hair. Warm between palms." },
                { step: "02", title: "Apply", desc: "Distribute evenly through damp or dry hair, focusing on mid-lengths to ends." },
                { step: "03", title: "Style", desc: "Blow dry or air dry. The elixir activates with heat for enhanced shine." },
              ].map((s) => (
                <div key={s.step} className="flex gap-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-medium text-black/50 shadow-[0_2px_12px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.04]">
                    {s.step}
                  </span>
                  <div>
                    <h3 className="text-[14px] font-medium text-black">{s.title}</h3>
                    <p className="mt-1 text-[12px] font-light leading-[1.7] text-black/45">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 6: LADY WITH BOTTLE ═══ */}
      <section className="relative bg-white py-32">
        <div className="mx-auto w-full max-w-[1316px] px-6">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-gradient-to-b from-[#f8f5f2] to-[#ede8e2]">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <p className="text-[11px] uppercase tracking-[0.2em] text-black/20">Lady Holding Bottle</p>
                <p className="text-[10px] text-black/15">Applying to hair & closing cap</p>
              </div>
            </div>
            <div className="max-w-[420px]">
              <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-black/35">The Experience</p>
              <h2 className="text-[clamp(1.6rem,2.5vw,2.4rem)] font-light leading-[1.15] tracking-[-0.01em] text-black">
                Luxury in
                <br />
                <em className="italic">every drop</em>
              </h2>
              <p className="mt-6 text-[14px] font-light leading-[1.9] text-black/45">
                From the moment you press the pump to the final stroke through
                your hair — every interaction with FA ÀURELLE is designed to
                feel like a ritual, not a routine.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 7: BEST SELLER ═══ */}
      <section className="relative bg-[#faf9f7] py-32">
        <div className="mx-auto w-full max-w-[1316px] px-6">
          <div className="flex flex-col items-center text-center">
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-black/35">Best Seller</p>
            <h2 className="text-[clamp(1.6rem,2.5vw,2.4rem)] font-light tracking-[-0.01em] text-black">
              FA ÀURELLE Hair Elixir
            </h2>
            <p className="mt-3 text-[13px] font-light text-black/40">
              20ml · Luxury Hair Serum · Silk Botanique Fusion™
            </p>
            <p className="mt-6 text-[22px] font-medium tracking-wide text-black">₹1,499</p>
            <p className="mt-1 text-[11px] font-light text-black/35">Inclusive of all taxes · Free shipping</p>
            <div className="mt-8 flex items-center gap-4">
              <button className="bg-black px-10 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-all duration-500 hover:scale-[1.02] hover:bg-black/85">
                Add to Cart
              </button>
              <button className="border border-black/12 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-black/60 transition-all duration-500 hover:border-black/30 hover:text-black">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 8: REVIEWS ═══ */}
      <section className="relative overflow-hidden bg-white py-32">
        <div className="mx-auto w-full max-w-[1316px] px-6">
          <div className="text-center">
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-black/35">Reviews</p>
            <h2 className="text-[clamp(1.6rem,2.5vw,2.4rem)] font-light tracking-[-0.01em] text-black">
              What they&apos;re saying
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { name: "Priya S.", text: "My hair has never looked this shiny. It's like glass — people keep asking what I use.", rating: 5 },
              { name: "Ananya R.", text: "Lightweight, no residue, and the frizz control lasts all day even in Mumbai humidity.", rating: 5 },
              { name: "Meera K.", text: "The packaging alone feels luxury. But the results? Absolutely salon-level every single day.", rating: 5 },
            ].map((r, i) => (
              <div key={i} className="rounded-sm border border-black/[0.04] bg-[#faf9f7] p-8">
                <div className="flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <span key={j} className="text-[12px] text-black/70">★</span>
                  ))}
                </div>
                <p className="mt-4 text-[13px] font-light leading-[1.8] text-black/60">
                  &ldquo;{r.text}&rdquo;
                </p>
                <p className="mt-4 text-[11px] font-medium tracking-[0.05em] text-black/40">— {r.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
