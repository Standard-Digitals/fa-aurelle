"use client";

import { MenuItem } from "@/components/layout/MenuItem";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/config/navigation";

type NavbarProps = {
  items: NavItem[];
  className?: string;
};

export function Navbar({ items, className }: NavbarProps) {
  return (
    <nav aria-label="Main navigation" className={cn("hidden lg:block", className)}>
      <ul className="flex items-center gap-8">
        {items.map((item) => (
          <li key={item.href}>
            <MenuItem label={item.label} href={item.href} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
