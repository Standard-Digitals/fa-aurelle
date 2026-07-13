import Link from "next/link";
import { footerLegal } from "@/config/footer";

export function FooterBottom() {
  const year = new Date().getFullYear();

  return (
    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
      <p className="text-[11px] font-light text-white/35">
        &copy; {year} FA ÀURELLE. All rights reserved.
      </p>
      <nav aria-label="Legal">
        <ul className="flex flex-wrap gap-6">
          {footerLegal.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[11px] font-light text-white/35 transition-colors duration-500 hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
