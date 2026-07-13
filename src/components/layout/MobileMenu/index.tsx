"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { X } from "lucide-react";
import { navigationLeft, navigationRight } from "@/config/navigation";
import { MenuItem } from "@/components/layout/MenuItem";

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const items = itemsRef.current?.children;
    if (!overlay || !items) return;

    const tl = gsap.timeline({ defaults: { ease: "power4.inOut" } });

    if (isOpen) {
      document.body.style.overflow = "hidden";
      tl.set(overlay, { display: "flex" })
        .to(overlay, { opacity: 1, duration: 0.6 })
        .fromTo(
          items,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.08 },
          "-=0.3"
        );
    } else {
      document.body.style.overflow = "";
      tl.to(items, { y: -20, opacity: 0, duration: 0.4, stagger: 0.04 })
        .to(overlay, { opacity: 0, duration: 0.5 }, "-=0.2")
        .set(overlay, { display: "none" });
    }

    return () => {
      tl.kill();
    };
  }, [isOpen]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[110] hidden flex-col items-center justify-center bg-white opacity-0"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <button
        onClick={onClose}
        aria-label="Close menu"
        className="absolute right-6 top-5 transition-opacity duration-500 hover:opacity-50"
      >
        <X size={22} strokeWidth={1.2} />
      </button>

      <nav aria-label="Mobile navigation">
        <ul ref={itemsRef} className="flex flex-col items-center gap-7">
          {[...navigationLeft, ...navigationRight].map((item) => (
            <li key={item.href} className="opacity-0">
              <MenuItem
                label={item.label}
                href={item.href}
                onClick={onClose}
                className="!text-[15px] text-black"
              />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
