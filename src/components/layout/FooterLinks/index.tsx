import Link from "next/link";
import { footerNavigation } from "@/config/footer";

export function FooterLinks() {
  return (
    <>
      {footerNavigation.map((section) => (
        <div key={section.title}>
          <h3 className="mb-6 text-[11px] font-medium uppercase tracking-[0.15em] text-white">
            {section.title}
          </h3>
          <ul className="flex flex-col gap-3.5">
            {section.links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[13px] font-light text-white/50 transition-colors duration-500 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
