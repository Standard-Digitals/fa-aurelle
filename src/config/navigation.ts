import { routes } from "@/constants/routes";

export type NavItem = {
  label: string;
  href: string;
};

export const navigationLeft: NavItem[] = [
  { label: "Discover", href: routes.discover },
  { label: "Silk Botanique Fusion", href: routes.silkBotaniqueFusion },
  { label: "Transformations", href: routes.transformations },
];

export const navigationRight: NavItem[] = [
  { label: "The Inner Circle", href: routes.theInnerCircle },
  { label: "Contact", href: routes.contact },
  { label: "F&Q", href: routes.faq },
];
