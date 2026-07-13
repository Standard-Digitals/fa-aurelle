"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { HeaderActions } from "@/components/layout/HeaderActions";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Container } from "@/components/common/Container";
import { navigationLeft, navigationRight } from "@/config/navigation";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 50;

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    gsap.to(header, {
      backgroundColor: isScrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0)",
      backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
      duration: 0.6,
      ease: "power2.out",
    });
  }, [isScrolled]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed left-0 top-0 z-[100] w-full text-black",
          "transition-colors duration-700"
        )}
      >
        <Container className="relative flex h-16 items-center lg:h-20">
          {/* Left — Desktop Nav / Mobile Menu Toggle */}
          <div className="flex-1">
            <Navbar items={navigationLeft} />
            <button
              onClick={toggleMobileMenu}
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden transition-opacity duration-500 hover:opacity-50"
            >
              <Menu size={20} strokeWidth={1.2} />
            </button>
          </div>

          {/* Center — Logo */}
          <Link
            href="/"
            aria-label="FA ÀURELLE — Home"
            className="text-[14px] font-light uppercase tracking-[0.2em] transition-opacity duration-500 hover:opacity-70 lg:text-[17px]"
          >
            FA ÀURELLE
          </Link>

          {/* Right — Desktop Nav + Actions / Mobile Actions */}
          <div className="flex flex-1 items-center justify-end gap-10">
            <Navbar items={navigationRight} />
            <HeaderActions className="hidden lg:flex" />
            <div className="flex items-center gap-5 lg:hidden">
              <HeaderActions className="[&>button:not(:last-child)]:hidden" />
            </div>
          </div>
        </Container>
      </header>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
    </>
  );
}
