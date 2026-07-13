"use client";

import { Search, User, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

type ActionButton = {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
};

const actions: ActionButton[] = [
  { label: "Search", icon: <Search size={18} strokeWidth={1.2} /> },
  { label: "Account", icon: <User size={18} strokeWidth={1.2} /> },
  { label: "Cart", icon: <ShoppingBag size={18} strokeWidth={1.2} /> },
];

type HeaderActionsProps = {
  className?: string;
};

export function HeaderActions({ className }: HeaderActionsProps) {
  return (
    <div className={cn("flex items-center gap-6", className)}>
      {actions.map(({ label, icon, onClick }) => (
        <button
          key={label}
          aria-label={label}
          onClick={onClick}
          className="transition-opacity duration-500 hover:opacity-50"
        >
          {icon}
        </button>
      ))}
    </div>
  );
}
