"use client";

import { useRef, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Puzzle, Star, Wind, Droplet, Shield, Sparkles, CheckCircle, Sun, Diamond } from "lucide-react";

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

const ProductModel = dynamic(
  () => import("@/components/three/ProductModel").then((m) => m.ProductModel),
  { ssr: false }
);

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

    // → Section 2 (Before/After): right side
    tl.to(bottle, {
      right: "2%",
      top: "50%",
      scale: 0.85,
      duration: 0.1,
      ease: "power2.inOut",
    });

    // → Section 3 (Scent + Ingredients): right
    tl.to(bottle, {
      right: "3%",
      top: "50%",
      scale: 0.85,
      duration: 0.12,
      ease: "power2.inOut",
    });

    // → Section 4 (Silk Botanicals): center-right
    tl.to(bottle, {
      right: "30%",
      top: "50%",
      scale: 0.9,
      duration: 0.1,
      ease: "power2.inOut",
    });

    // → Section 5 (Best Seller): center — CAP OPENS + INGREDIENTS
    tl.to(bottle, {
      right: "32%",
      top: "50%",
      scale: 1,
      duration: 0.15,
      ease: "power2.inOut",
    });

    // → Section 6 (Testimonials): left
    tl.to(bottle, {
      right: "auto",
      left: "4%",
      top: "50%",
      scale: 0.85,
      duration: 0.15,
      ease: "power2.inOut",
    });

    // → Section 7 (Reviews): center then fade
    tl.to(bottle, {
      left: "auto",
      right: "30%",
      top: "45%",
      scale: 0.9,
      duration: 0.1,
      ease: "power2.inOut",
    });

    // → Fade out
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

  // GSAP scroll-triggered animations for sections
  useEffect(() => {
    // Animate section elements on scroll
    const animateEls = document.querySelectorAll("[data-animate]");
    animateEls.forEach((el) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
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
          width: "500px",
          height: "600px",
          top: "50%",
          right: "8%",
          transform: "translateY(-50%)",
        }}
      >
        <FloatingBottle scrollProgress={scrollProgress} />
      </div>

      {/* ═══ SECTION 1: HERO ═══ */}
      <section className="relative flex min-h-screen flex-col justify-center bg-white">
        <div className="mx-auto w-full max-w-[1316px] px-6">
          <div className="max-w-[550px] py-32">
            <h1 className="text-[clamp(2.5rem,5vw,4.2rem)] font-light leading-[1.08] tracking-[-0.02em] text-black">
              Mirror-Like Shine.
              <br />
              Weightless Elegance.
            </h1>
            <p className="mt-8 max-w-[440px] text-[15px] font-light leading-[1.9] text-black/50">
              Transform dull, frizzy hair into silky, luminous strands with exceptional
              glass-like radiance powered by Silk Botanique Fusion™.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <button className="cursor-pointer group relative overflow-hidden bg-black px-10 py-4 text-[11px] font-medium uppercase tracking-[0.15em] text-white transition-all duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                <span className="relative z-10">Discover Elixir</span>
                <div className="absolute inset-0 -translate-x-full bg-[#1a1a1a] transition-transform duration-500 ease-out group-hover:translate-x-0" />
              </button>
              <button className="cursor-pointer group relative overflow-hidden border border-black/15 px-10 py-4 text-[11px] font-medium uppercase tracking-[0.15em] text-black transition-all duration-500 hover:border-black hover:text-white">
                <span className="relative z-10">Shop Now</span>
                <div className="absolute inset-0 -translate-x-full bg-black transition-transform duration-500 ease-out group-hover:translate-x-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature bar */}
        <div className="absolute inset-x-0 bottom-0 bg-[#f7f7f7]">
          <div className="mx-auto flex w-full max-w-[1316px] items-center justify-between px-6 py-5">
            {[
              { label: "Botanical Infusions", icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" },
              { label: "Lightweight", icon: "M12 3c-1.1 0-2 .9-2 2v6.5c-1.14.58-2 1.72-2 3.08 0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5c0-1.36-.86-2.5-2-3.08V5c0-1.1-.9-2-2-2zm.5 2v7.13c.95.41 1.5 1.28 1.5 2.29 0 1.38-1.12 2.5-2.5 2.5S9 15.8 9 14.42c0-1.01.55-1.88 1.5-2.29V5h1z" },
              { label: "Instant Deep Shine", icon: "M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2zm0 3.84L16.27 17.3 12 15.54l-4.27 1.76L12 5.84z" },
              { label: "Strengthens", icon: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.83-3.13 9.37-7 10.5-3.87-1.13-7-5.67-7-10.5V6.3l7-3.12z" },
              { label: "Frizz & Flyaway", icon: "M14.5 17c0 1.65-1.35 3-3 3s-3-1.35-3-3h2c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1H2v-2h9.5c1.65 0 3 1.35 3 3zM19 6.5C19 4.57 17.43 3 15.5 3S12 4.57 12 6.5h2c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S16.33 8 15.5 8H2v2h13.5C17.43 10 19 8.43 19 6.5zM18.5 11H2v2h16.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5v2c1.93 0 3.5-1.57 3.5-3.5S20.43 11 18.5 11z" },
              { label: "Heat Protection", icon: "M12 12.9a2.1 2.1 0 100 4.2 2.1 2.1 0 000-4.2zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" },
            ].map((f, i) => (
              <div
                key={f.label}
                className={`flex flex-col items-center gap-2.5 px-6 ${
                  i < 5 ? "border-r border-black/[0.06]" : ""
                }`}
              >
                <svg className="h-5 w-5 text-black/40" viewBox="0 0 24 24" fill="currentColor">
                  <path d={f.icon} />
                </svg>
                <span className="text-[11px] font-medium tracking-[0.02em] text-black/55">
                  {f.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2: BEFORE & AFTER ═══ */}
      <section className="relative bg-[#c8c4bf] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr]">
          {/* Left: Text Content */}
          <div className="flex flex-col justify-center px-10 lg:px-16 py-20" data-animate>
            <p className="text-[11px] font-medium uppercase tracking-[0.3em] text-black/40 mb-6">
              Before
            </p>
            <h2 className="text-[clamp(2.5rem,4vw,4rem)] font-bold leading-[1.05] tracking-[-0.02em] text-[#2a2a2a]">
              DULL. DRY.
              <br />
              LIFELESS.
            </h2>
            <p className="mt-6 max-w-[380px] text-[15px] font-light leading-[1.7] text-black/50">
              Hair that lacks shine, feels rough,
              and is difficult to manage.
            </p>

            <div className="mt-10 flex flex-col gap-5">
              {[
                { icon: <Sparkles size={20} strokeWidth={1.3} />, label: "Dull & Lackluster" },
                { icon: <Sun size={20} strokeWidth={1.3} />, label: "Dry & Rough Texture" },
                { icon: <Wind size={20} strokeWidth={1.3} />, label: "Frizz & Flyaways" },
                { icon: <Diamond size={20} strokeWidth={1.3} />, label: "Hard to Manage" },
                { icon: <Sun size={20} strokeWidth={1.3} />, label: "Lack of Shine" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-black/[0.08] bg-[#b8b3ad]/40 text-black/40">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[14px] font-medium text-[#2a2a2a]">{item.label}</p>
                    <div className="mt-2 h-px w-24 bg-black/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Before/After Image Slider */}
          <div className="relative min-h-[500px] lg:min-h-full">
            {/* Before Image */}
            <div className="absolute inset-0">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80"
                alt="Before - Dull hair"
                className="w-full h-full object-cover"
              />
            </div>
            {/* After Image (clipped by slider) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 0 0 var(--slider-pos, 50%))` }}
            >
              <img
                src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&auto=format&fit=crop&q=80"
                alt="After - Shiny hair"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Slider Handle */}
            <div
              className="absolute inset-y-0 z-10 flex items-center cursor-ew-resize"
              style={{ left: `var(--slider-pos, 50%)`, transform: 'translateX(-50%)' }}
              onMouseDown={(e) => {
                const container = e.currentTarget.parentElement;
                if (!container) return;
                const onMove = (ev: MouseEvent) => {
                  const rect = container.getBoundingClientRect();
                  const x = Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width));
                  container.style.setProperty('--slider-pos', `${x * 100}%`);
                };
                const onUp = () => {
                  document.removeEventListener('mousemove', onMove);
                  document.removeEventListener('mouseup', onUp);
                };
                document.addEventListener('mousemove', onMove);
                document.addEventListener('mouseup', onUp);
              }}
              onTouchStart={(e) => {
                const container = e.currentTarget.parentElement;
                if (!container) return;
                const onMove = (ev: TouchEvent) => {
                  const rect = container.getBoundingClientRect();
                  const x = Math.max(0, Math.min(1, (ev.touches[0].clientX - rect.left) / rect.width));
                  container.style.setProperty('--slider-pos', `${x * 100}%`);
                };
                const onEnd = () => {
                  document.removeEventListener('touchmove', onMove);
                  document.removeEventListener('touchend', onEnd);
                };
                document.addEventListener('touchmove', onMove);
                document.addEventListener('touchend', onEnd);
              }}
            >
              <div className="w-px h-full bg-white/80" />
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 shadow-lg backdrop-blur-sm">
                <span className="text-[14px] text-black/70">◂▸</span>
              </div>
            </div>
            {/* Labels */}
            <div className="absolute top-6 left-6 z-10 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded text-[11px] font-medium text-white/80 tracking-wider">
              Before
            </div>
            <div className="absolute top-6 right-6 z-10 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded text-[11px] font-medium text-white/80 tracking-wider">
              After
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 3: KEY INGREDIENTS (Left) + ESSENCE BLEND (Right) ═══ */}
      <section className="relative bg-[#f9f8f6] py-36 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />

        <div className="mx-auto w-full max-w-[1316px] px-6">
          <div className="grid grid-cols-1 gap-20 lg:grid-cols-2">

            {/* LEFT — Key Ingredients */}
            <div data-animate>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/35 mb-4">
                Key Ingredients
              </p>
              <h2 className="text-[clamp(2rem,3vw,2.8rem)] font-light tracking-[-0.02em] text-black leading-[1.15]">
                The Science Inside
              </h2>
              <p className="mt-5 max-w-[440px] text-[14px] font-light leading-[1.85] text-black/45">
                Advanced actives that repair, protect and transform your hair from within.
              </p>

              <div className="mt-14 flex flex-col gap-8">
                {[
                  {
                    icon: <Puzzle size={20} strokeWidth={1.3} />,
                    name: "Bis-Aminopropyl Dimethicone",
                    tag: "Bond Repair",
                    desc: "Targets damaged areas to improve strength and reduce breakage while enhancing softness.",
                  },
                  {
                    icon: <Star size={20} strokeWidth={1.3} />,
                    name: "Phenyl Trimethicone",
                    tag: "Mirror Shine",
                    desc: "Enhances light reflection for instant glossy, weightless shine on every strand.",
                  },
                  {
                    icon: <Wind size={20} strokeWidth={1.3} />,
                    name: "Dimethiconol",
                    tag: "Frizz Shield",
                    desc: "Smooths the cuticle and locks in moisture for lasting humidity resistance.",
                  },
                  {
                    icon: <Droplet size={20} strokeWidth={1.3} />,
                    name: "Tocopherol (Vitamin E)",
                    tag: "Antioxidant Guard",
                    desc: "Protects against environmental stressors and promotes a healthy finish.",
                  },
                ].map((ing) => (
                  <div key={ing.name} className="group flex gap-5">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white border border-black/[0.05] text-black/40 transition-colors duration-300 group-hover:border-black/[0.1] group-hover:text-black/60">
                      {ing.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-[14.5px] font-medium text-black">{ing.name}</h3>
                      </div>
                      <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-black/25">
                        {ing.tag}
                      </p>
                      <p className="mt-2.5 text-[12.5px] font-light leading-[1.75] text-black/45">
                        {ing.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Botanical Essence Blend */}
            <div data-animate>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-black/35 mb-4">
                Botanical Blend
              </p>
              <h2 className="text-[clamp(2rem,3vw,2.8rem)] font-light tracking-[-0.02em] text-black leading-[1.15]">
                Nature&apos;s Finest Oils
              </h2>
              <p className="mt-5 max-w-[440px] text-[14px] font-light leading-[1.85] text-black/45">
                Botanical nutrients working in harmony to nourish, hydrate and enhance your hair.
              </p>

              <div className="mt-14 flex flex-col gap-5">
                {[
                  {
                    name: "Argan Oil",
                    origin: "Morocco",
                    desc: "Rich in essential fatty acids and antioxidants. Deeply nourishes dry, damaged hair while restoring softness and shine.",
                  },
                  {
                    name: "Jojoba Oil",
                    origin: "Americas",
                    desc: "Mimics hair\u2019s natural oils for lightweight hydration. Maintains moisture balance and exceptional softness.",
                  },
                  {
                    name: "Camellia Oil",
                    origin: "East Asia",
                    desc: "Locks in moisture while taming frizz and flyaways. Enhances radiant shine and long-lasting smoothness.",
                  },
                ].map((oil) => (
                  <div
                    key={oil.name}
                    className="group rounded-2xl bg-white border border-black/[0.04] p-7 transition-all duration-500 hover:shadow-[0_8px_40px_rgba(0,0,0,0.05)] hover:border-black/[0.08]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f2ef] text-black/35">
                        <Droplet size={18} strokeWidth={1.3} />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-medium text-black">{oil.name}</h3>
                        <p className="text-[9px] font-medium uppercase tracking-[0.15em] text-black/25">{oil.origin}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-[12.5px] font-light leading-[1.75] text-black/45">
                      {oil.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Feature badges */}
              <div className="mt-10 grid grid-cols-2 gap-3">
                {[
                  { icon: <Shield size={15} strokeWidth={1.3} />, label: "Repairs & Strengthens" },
                  { icon: <Star size={15} strokeWidth={1.3} />, label: "Mirror-Like Shine" },
                  { icon: <Wind size={15} strokeWidth={1.3} />, label: "Frizz Control" },
                  { icon: <Droplet size={15} strokeWidth={1.3} />, label: "Deep Nourishment" },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-2.5 rounded-lg bg-[#f4f2ef] px-4 py-3">
                    <span className="text-black/30">{f.icon}</span>
                    <span className="text-[10px] font-medium uppercase tracking-[0.06em] text-black/50">{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══ SECTION 4: SILK BOTANICALS (Animated Background) ═══ */}
      <section className="relative overflow-hidden bg-[#0a0a0a] py-32 text-white">
        {/* Animated layered background */}
        <div className="absolute inset-0">
          {/* Slow rotating gold orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] animate-[spin_30s_linear_infinite] rounded-full bg-gradient-to-br from-[#C5A028]/8 via-transparent to-[#8B4513]/8 blur-[100px]" />
          {/* Pulsing radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[800px] animate-[pulse_6s_ease-in-out_infinite] rounded-full bg-[radial-gradient(ellipse,_#C5A028_0%,_transparent_70%)] opacity-[0.06]" />
          {/* Drifting accent left */}
          <div className="absolute -left-32 top-0 h-full w-1/2 animate-[pulse_10s_ease-in-out_infinite_1s] bg-gradient-to-r from-[#C5A028]/5 to-transparent" />
          {/* Drifting accent right */}
          <div className="absolute -right-32 bottom-0 h-full w-1/2 animate-[pulse_10s_ease-in-out_infinite_3s] bg-gradient-to-l from-[#8B4513]/5 to-transparent" />
          {/* Subtle noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.85%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E")' }} />
          {/* Floating particles (gold dots) */}
          <div className="absolute top-[20%] left-[15%] h-1 w-1 rounded-full bg-[#C5A028]/30 animate-[pulse_4s_ease-in-out_infinite]" />
          <div className="absolute top-[60%] left-[75%] h-1.5 w-1.5 rounded-full bg-[#C5A028]/20 animate-[pulse_5s_ease-in-out_infinite_1s]" />
          <div className="absolute top-[35%] left-[85%] h-1 w-1 rounded-full bg-[#C5A028]/25 animate-[pulse_6s_ease-in-out_infinite_2s]" />
          <div className="absolute top-[75%] left-[25%] h-1 w-1 rounded-full bg-[#C5A028]/20 animate-[pulse_4.5s_ease-in-out_infinite_0.5s]" />
          <div className="absolute top-[10%] left-[55%] h-0.5 w-0.5 rounded-full bg-white/20 animate-[pulse_3s_ease-in-out_infinite_1.5s]" />
          <div className="absolute top-[80%] left-[60%] h-0.5 w-0.5 rounded-full bg-white/15 animate-[pulse_3.5s_ease-in-out_infinite_2.5s]" />
        </div>

        <div className="relative mx-auto w-full max-w-[1316px] px-6">
          <div className="text-center" data-animate>
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-white/35">
              The Science
            </p>
            <h2 className="text-[clamp(1.8rem,3vw,2.8rem)] font-light leading-[1.12] tracking-[-0.01em] text-white">
              Powered by
              <br />
              <em className="italic">Silk Botanique Fusion™</em>
            </h2>
            <p className="mx-auto mt-6 max-w-[500px] text-[14px] font-light leading-[1.9] text-white/45">
              A proprietary blend of botanical silk proteins and rare plant
              extracts that coat each strand in liquid glass. Our patented
              micro-encapsulation technology delivers active ingredients
              directly to the hair cortex.
            </p>
          </div>

          <div className="mt-16 flex items-center justify-center gap-12" data-animate>
            <div className="text-center">
              <p className="text-[32px] font-light text-white">97%</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/35">Shinier Hair</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-center">
              <p className="text-[32px] font-light text-white">72hr</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/35">Frizz Control</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-center">
              <p className="text-[32px] font-light text-white">100%</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/35">Vegan</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div className="text-center">
              <p className="text-[32px] font-light text-white">0%</p>
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-white/35">Parabens</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 5: BEST SELLER ═══ */}
      <section className="relative bg-white py-32">
        <div className="mx-auto w-full max-w-[1316px] px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2" data-animate>
            {/* Product 3D Model */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-gradient-to-b from-[#f5f3f0] to-[#ebe7e2]">
              <ProductModel />
            </div>

            {/* Product Details */}
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-black">Bestseller</p>
              <h2 className="mt-4 text-[clamp(1.8rem,3vw,2.8rem)] font-light tracking-[-0.02em] text-black">
                Hair Elixir Oil-In Serum
              </h2>
              <p className="mt-3 text-[14px] italic font-light text-black/50">
                Mirror-Like Shine . Silk-Touch Softness . Weightless Elegance
              </p>

              {/* Rating */}
              <div className="mt-4 flex items-center gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-[14px] text-[#C5A028]">★</span>
                  ))}
                </div>
                <span className="text-[12px] font-medium text-black/60">4.9/5 (762 Reviews)</span>
              </div>

              {/* Benefits grid */}
              <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-3">
                {[
                  "Instantly Boosts Shine & Radiance",
                  "Improves Manageability",
                  "Controls Frizz & Flyaways",
                  "Salon-Finish Effect At Home",
                  "Lightweight, Non-Greasy Formula",
                  "Humidity Defence",
                  "Suitable For All Hair Types",
                  "Silk-Touch Softness",
                ].map((b) => (
                  <div key={b} className="flex items-center gap-2">
                    <CheckCircle size={14} strokeWidth={1.5} className="shrink-0 text-black/50" />
                    <span className="text-[13px] font-light text-black/70">{b}</span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="mt-8 h-px w-full bg-black/[0.06]" />

              {/* Price */}
              <div className="mt-8 flex items-baseline gap-3">
                <span className="text-[36px] font-light tracking-tight text-black">₹999</span>
                <span className="text-[13px] font-light text-black/40">(Inc. of all taxes)</span>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex items-center gap-4">
                <button className="cursor-pointer group relative overflow-hidden flex items-center gap-2.5 bg-black px-10 py-4 text-[11px] font-medium uppercase tracking-[0.15em] text-white transition-all duration-500 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                  <svg className="relative z-10 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                  <span className="relative z-10">Add to Cart</span>
                  <div className="absolute inset-0 -translate-x-full bg-[#1a1a1a] transition-transform duration-500 ease-out group-hover:translate-x-0" />
                </button>
                <button className="cursor-pointer group relative overflow-hidden border border-black/15 px-10 py-4 text-[11px] font-medium uppercase tracking-[0.15em] text-black transition-all duration-500 hover:border-black hover:text-white">
                  <span className="relative z-10">Buy Now</span>
                  <div className="absolute inset-0 -translate-x-full bg-black transition-transform duration-500 ease-out group-hover:translate-x-0" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SECTION 6: TESTIMONIALS ═══ */}
      <section className="relative overflow-hidden bg-[#1a1a1a] py-0">
        {/* Cross-parallax vertical columns background */}
        <div className="absolute inset-0 overflow-hidden flex gap-3 px-3 rotate-30 h-full">
          {/* Column 1 - scrolls UP */}
          <div className="flex-1 overflow-hidden">
            <div className="animate-[scrollUp_30s_linear_infinite] flex flex-col gap-3">
              {[
                { img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60", name: "Sneha M.", text: "My hair has never looked this shiny. People keep asking what I use." },
                { img: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=400&auto=format&fit=crop&q=60", name: "Dr. Kavita R.", text: "The formulation genuinely repairs damaged cuticles." },
                { img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60", name: "Aisha K.", text: "My clients ask for this by name now." },
                { img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60", name: "Sneha M.", text: "My hair has never looked this shiny. People keep asking what I use." },
                { img: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=400&auto=format&fit=crop&q=60", name: "Dr. Kavita R.", text: "The formulation genuinely repairs damaged cuticles." },
                { img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60", name: "Aisha K.", text: "My clients ask for this by name now." },
              ].map((t, i) => (
                <div key={`c1-${i}`} className="rounded-lg overflow-hidden border border-white/[0.08]">
                  <div className="aspect-[4/5] relative">
                    <img src={t.img} alt={t.name} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="bg-[#222] p-3">
                    <div className="flex gap-0.5 mb-1">{Array(5).fill(0).map((_, j) => <span key={j} className="text-[9px] text-[#C5A028]">★</span>)}</div>
                    <p className="text-[10px] leading-[1.5] text-white/50 line-clamp-2">&ldquo;{t.text}&rdquo;</p>
                    <p className="mt-1.5 text-[9px] font-medium text-white/30">{t.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Column 2 - scrolls DOWN */}
          <div className="flex-1 overflow-hidden">
            <div className="animate-[scrollDown_35s_linear_infinite] flex flex-col gap-3">
              {[
                { img: "https://images.unsplash.com/flagged/photo-1573740144655-bbb6e88fb18a?w=400&auto=format&fit=crop&q=60", name: "Riya P.", text: "My hair looked professionally styled every single day." },
                { img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60", name: "Ananya R.", text: "Lightweight, no residue, frizz control lasts all day." },
                { img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60", name: "Divya T.", text: "Finally a serum that doesn't make my fine hair greasy." },
                { img: "https://images.unsplash.com/flagged/photo-1573740144655-bbb6e88fb18a?w=400&auto=format&fit=crop&q=60", name: "Riya P.", text: "My hair looked professionally styled every single day." },
                { img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60", name: "Ananya R.", text: "Lightweight, no residue, frizz control lasts all day." },
                { img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60", name: "Divya T.", text: "Finally a serum that doesn't make my fine hair greasy." },
              ].map((t, i) => (
                <div key={`c2-${i}`} className="rounded-lg overflow-hidden border border-white/[0.08]">
                  <div className="aspect-[4/5] relative">
                    <img src={t.img} alt={t.name} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="bg-[#222] p-3">
                    <div className="flex gap-0.5 mb-1">{Array(5).fill(0).map((_, j) => <span key={j} className="text-[9px] text-[#C5A028]">★</span>)}</div>
                    <p className="text-[10px] leading-[1.5] text-white/50 line-clamp-2">&ldquo;{t.text}&rdquo;</p>
                    <p className="mt-1.5 text-[9px] font-medium text-white/30">{t.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Column 3 - scrolls UP */}
          <div className="flex-1 overflow-hidden">
            <div className="animate-[scrollUp_28s_linear_infinite] flex flex-col gap-3">
              {[
                { img: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=400&auto=format&fit=crop&q=60", name: "Meera K.", text: "The packaging feels luxury. Results are salon-level." },
                { img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60", name: "Nisha G.", text: "The scent is divine. Frizz-free for 3 days straight." },
                { img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60", name: "Pooja L.", text: "My colorist said my hair health has visibly improved." },
                { img: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=400&auto=format&fit=crop&q=60", name: "Meera K.", text: "The packaging feels luxury. Results are salon-level." },
                { img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60", name: "Nisha G.", text: "The scent is divine. Frizz-free for 3 days straight." },
                { img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60", name: "Pooja L.", text: "My colorist said my hair health has visibly improved." },
              ].map((t, i) => (
                <div key={`c3-${i}`} className="rounded-lg overflow-hidden border border-white/[0.08]">
                  <div className="aspect-[4/5] relative">
                    <img src={t.img} alt={t.name} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="bg-[#222] p-3">
                    <div className="flex gap-0.5 mb-1">{Array(5).fill(0).map((_, j) => <span key={j} className="text-[9px] text-[#C5A028]">★</span>)}</div>
                    <p className="text-[10px] leading-[1.5] text-white/50 line-clamp-2">&ldquo;{t.text}&rdquo;</p>
                    <p className="mt-1.5 text-[9px] font-medium text-white/30">{t.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Column 4 - scrolls DOWN */}
          <div className="flex-1 overflow-hidden">
            <div className="animate-[scrollDown_32s_linear_infinite] flex flex-col gap-3">
              {[
                { img: "https://images.unsplash.com/flagged/photo-1573740144655-bbb6e88fb18a?w=400&auto=format&fit=crop&q=60", name: "Priya S.", text: "It\u2019s like glass \u2014 people keep asking what I use." },
                { img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60", name: "Sneha M.", text: "True glass hair without weighing it down." },
                { img: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=400&auto=format&fit=crop&q=60", name: "Aisha K.", text: "Instant transformation that lasts days." },
                { img: "https://images.unsplash.com/flagged/photo-1573740144655-bbb6e88fb18a?w=400&auto=format&fit=crop&q=60", name: "Priya S.", text: "It\u2019s like glass \u2014 people keep asking what I use." },
                { img: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=60", name: "Sneha M.", text: "True glass hair without weighing it down." },
                { img: "https://images.unsplash.com/photo-1546961329-78bef0414d7c?w=400&auto=format&fit=crop&q=60", name: "Aisha K.", text: "Instant transformation that lasts days." },
              ].map((t, i) => (
                <div key={`c4-${i}`} className="rounded-lg overflow-hidden border border-white/[0.08]">
                  <div className="aspect-[4/5] relative">
                    <img src={t.img} alt={t.name} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="bg-[#222] p-3">
                    <div className="flex gap-0.5 mb-1">{Array(5).fill(0).map((_, j) => <span key={j} className="text-[9px] text-[#C5A028]">★</span>)}</div>
                    <p className="text-[10px] leading-[1.5] text-white/50 line-clamp-2">&ldquo;{t.text}&rdquo;</p>
                    <p className="mt-1.5 text-[9px] font-medium text-white/30">{t.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Column 5 - scrolls UP */}
          <div className="flex-1 overflow-hidden">
            <div className="animate-[scrollUp_33s_linear_infinite] flex flex-col gap-3">
              {[
                { img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60", name: "Riya P.", text: "Used this for my wedding prep. Absolutely stunning." },
                { img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60", name: "Dr. Kavita R.", text: "Botanical oils with silk proteins \u2014 impressive." },
                { img: "https://images.unsplash.com/flagged/photo-1573740144655-bbb6e88fb18a?w=400&auto=format&fit=crop&q=60", name: "Divya T.", text: "Pure silk feeling without any greasiness." },
                { img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=60", name: "Riya P.", text: "Used this for my wedding prep. Absolutely stunning." },
                { img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60", name: "Dr. Kavita R.", text: "Botanical oils with silk proteins \u2014 impressive." },
                { img: "https://images.unsplash.com/flagged/photo-1573740144655-bbb6e88fb18a?w=400&auto=format&fit=crop&q=60", name: "Divya T.", text: "Pure silk feeling without any greasiness." },
              ].map((t, i) => (
                <div key={`c5-${i}`} className="rounded-lg overflow-hidden border border-white/[0.08]">
                  <div className="aspect-[4/5] relative">
                    <img src={t.img} alt={t.name} className="absolute inset-0 w-full h-full object-cover" />
                  </div>
                  <div className="bg-[#222] p-3">
                    <div className="flex gap-0.5 mb-1">{Array(5).fill(0).map((_, j) => <span key={j} className="text-[9px] text-[#C5A028]">★</span>)}</div>
                    <p className="text-[10px] leading-[1.5] text-white/50 line-clamp-2">&ldquo;{t.text}&rdquo;</p>
                    <p className="mt-1.5 text-[9px] font-medium text-white/30">{t.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-[#1a1a1a]/70" />
        </div>

        {/* Center content */}
        <div className="relative z-10 flex min-h-[85vh] flex-col items-center justify-center px-6 text-center">
          <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-white/35">
            Testimonials
          </p>
          <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.15] tracking-[-0.01em] text-white">
            Real Results. Real Women.
            <br />
            Real Confidence.
          </h2>
          <button className="cursor-pointer group relative mt-10 overflow-hidden bg-white px-12 py-5 text-[12px] font-medium uppercase tracking-[0.15em] text-black transition-all duration-500 hover:shadow-[0_8px_30px_rgba(255,255,255,0.15)]">
            <span className="relative z-10">Get the Elixir</span>
            <div className="absolute inset-0 -translate-x-full bg-[#DEDEDE] transition-transform duration-500 ease-out group-hover:translate-x-0" />
          </button>
        </div>
      </section>

      {/* ═══ SECTION 7: REVIEWS ═══ */}
      <section className="relative overflow-hidden bg-white py-32">
        <div className="mx-auto w-full max-w-[1316px] px-6">
          <div className="text-center" data-animate>
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.3em] text-black/35">Reviews</p>
            <h2 className="text-[clamp(1.6rem,2.5vw,2.4rem)] font-light tracking-[-0.01em] text-black">
              What they&apos;re saying
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3" data-animate>
            {[
              { name: "Priya S.", text: "My hair has never looked this shiny. It's like glass — people keep asking what I use.", rating: 5 },
              { name: "Ananya R.", text: "Lightweight, no residue, and the frizz control lasts all day even in Mumbai humidity.", rating: 5 },
              { name: "Meera K.", text: "The packaging alone feels luxury. But the results? Absolutely salon-level every single day.", rating: 5 },
              { name: "Divya T.", text: "Finally a serum that doesn't make my fine hair greasy. Pure silk feeling.", rating: 5 },
              { name: "Nisha G.", text: "The scent is divine — subtle, elegant. And my hair stays frizz-free for 3 days straight.", rating: 5 },
              { name: "Pooja L.", text: "Worth every rupee. My colorist said my hair health has visibly improved since I started using this.", rating: 5 },
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

      {/* ═══ PRE-FOOTER: Inner Circle + Trust Badges ═══ */}
      {/* The Inner Circle Banner */}
      <section className="bg-[#2a2520] py-5">
        <div className="mx-auto w-full max-w-[1316px] px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-[18px] font-semibold text-white">The Inner Circle</h3>
            <p className="text-[13px] text-white/50">More Than Beauty. It&apos;s A Privilege.</p>
          </div>
          <p className="text-[13.5px] text-white/60">
            Earn Beauty Credits &bull; Unlock Exclusive Rewards &bull; Redeem Premium Experiences
          </p>
          <button className="cursor-pointer group relative overflow-hidden border border-white/15 px-10 py-4 text-[11px] font-medium uppercase tracking-[0.15em] text-white transition-all duration-500 hover:text-black">
            <span className="relative z-10">Know More</span>
            <div className="absolute inset-0 -translate-x-full bg-[#DEDEDE] transition-transform duration-500 ease-out group-hover:translate-x-0" />
          </button>
        </div>
      </section>

      {/* Trust Badges Strip */}
      <section className="bg-[#f5f4f2] py-7 border-t border-black/[0.04]">
        <div className="mx-auto w-full max-w-[1316px] px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-black/50"><path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2.81A2 2 0 0 1 20 8v8a2 2 0 0 1-2 2h-2"/><path d="M12 18V6"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M5 10h4"/><path d="M15 10h4"/></svg>
              <div>
                <p className="text-[13.5px] font-semibold text-black/80">Free Shipping</p>
                <p className="text-[11px] text-black/40">On all orders</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-black/50"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/><path d="M12 14l2 2 4-4"/></svg>
              <div>
                <p className="text-[13.5px] font-semibold text-black/80">Secure Payment</p>
                <p className="text-[11px] text-black/40">100% Protected</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-black/50"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/><path d="M12 7v5l3 3"/></svg>
              <div>
                <p className="text-[13.5px] font-semibold text-black/80">Easy Returns</p>
                <p className="text-[11px] text-black/40">Hassle-Free</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-black/50"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <div>
                <p className="text-[13.5px] font-semibold text-black/80">Premium Quality</p>
                <p className="text-[11px] text-black/40">Salon grade formula</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-[#0a0a0a] pt-20 pb-8 text-white">
        <div className="mx-auto w-full max-w-[1316px] px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div>
              <h3 className="text-[18px] font-light tracking-[0.05em]">FA ÀURELLE</h3>
              <p className="mt-4 text-[12px] font-light leading-[1.8] text-white/40">
                Luxury hair care powered by Silk Botanique Fusion™. Mirror-like shine, weightless elegance.
              </p>
              <div className="mt-6 flex gap-4">
                {["Instagram", "Facebook", "YouTube"].map((s) => (
                  <a key={s} href="#" className="text-[11px] font-medium text-white/30 transition-colors hover:text-white/70">{s}</a>
                ))}
              </div>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">Shop</h4>
              <ul className="mt-5 flex flex-col gap-3">
                {["Hair Elixir Oil-In Serum", "Gift Sets", "Bundles", "New Arrivals"].map((l) => (
                  <li key={l}><a href="#" className="text-[12px] font-light text-white/35 transition-colors hover:text-white/70">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">Company</h4>
              <ul className="mt-5 flex flex-col gap-3">
                {["About Us", "Our Story", "Ingredients", "Sustainability", "Contact"].map((l) => (
                  <li key={l}><a href="#" className="text-[12px] font-light text-white/35 transition-colors hover:text-white/70">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">Stay Updated</h4>
              <p className="mt-5 text-[12px] font-light text-white/35">Get exclusive offers & hair care tips.</p>
              <div className="mt-4 flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 border border-white/10 bg-transparent px-4 py-3 text-[11px] text-white/70 placeholder:text-white/25 outline-none focus:border-white/30"
                />
                <button className="bg-white px-5 py-3 text-[10px] font-semibold uppercase tracking-wider text-black transition-colors hover:bg-white/90">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 md:flex-row">
            <p className="text-[10px] font-light text-white/25">
              © 2025 FA ÀURELLE. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Shipping & Returns"].map((l) => (
                <a key={l} href="#" className="text-[10px] font-light text-white/25 transition-colors hover:text-white/50">{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
