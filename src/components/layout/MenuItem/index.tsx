"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type MenuItemProps = {
  label: string;
  href: string;
  className?: string;
  onClick?: () => void;
};

export function MenuItem({ label, href, className, onClick }: MenuItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-block text-[13px] font-light uppercase tracking-[0.12em]",
        "transition-opacity duration-500 hover:opacity-60",
        className
      )}
    >
      <span>{label}</span>
      <span
        className="absolute bottom-0 left-0 h-px w-0 bg-current transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:w-full"
        aria-hidden="true"
      />
    </Link>
  );
}
