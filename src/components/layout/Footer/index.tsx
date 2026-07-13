import Link from "next/link";
import { Container } from "@/components/common/Container";
import { FooterLinks } from "@/components/layout/FooterLinks";
import { FooterNewsletter } from "@/components/layout/FooterNewsletter";
import { FooterBottom } from "@/components/layout/FooterBottom";

export function Footer() {
  return (
    <footer className="bg-black text-white pt-16 pb-12 md:pt-[100px] md:pb-[60px]">
      <Container>
        {/* Top grid */}
        <div className="grid grid-cols-1 gap-10 border-b border-white/[0.08] pb-12 sm:grid-cols-2 md:pb-20 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1.5fr] lg:gap-14">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              aria-label="FA ÀURELLE — Home"
              className="text-xl font-light uppercase tracking-[0.2em]"
            >
              FA ÀURELLE
            </Link>
            <p className="mt-5 max-w-[240px] text-[13px] font-light leading-[1.8] text-white/45">
              Luxury hair care, redefined. Where science meets artistry.
            </p>
          </div>

          <FooterLinks />
          <FooterNewsletter />
        </div>

        {/* Bottom bar */}
        <div className="pt-8 md:pt-10">
          <FooterBottom />
        </div>
      </Container>
    </footer>
  );
}
