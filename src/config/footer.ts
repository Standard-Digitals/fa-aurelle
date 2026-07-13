export type FooterLink = {
  label: string;
  href: string;
};

export type FooterSection = {
  title: string;
  links: FooterLink[];
};

export const footerNavigation: FooterSection[] = [
  {
    title: "Navigation",
    links: [
      { label: "Discover", href: "/discover" },
      { label: "Silk Botanique Fusion", href: "/silk-botanique-fusion" },
      { label: "Transformations", href: "/transformations" },
      { label: "The Inner Circle", href: "/the-inner-circle" },
    ],
  },
  {
    title: "Customer Care",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "F&Q", href: "/faq" },
      { label: "Shipping & Returns", href: "/shipping" },
      { label: "Track Order", href: "/track-order" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Pinterest", href: "https://pinterest.com" },
      { label: "YouTube", href: "https://youtube.com" },
    ],
  },
];

export const footerLegal: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund Policy", href: "/refund" },
  { label: "Shipping Policy", href: "/shipping-policy" },
  { label: "Accessibility", href: "/accessibility" },
];
