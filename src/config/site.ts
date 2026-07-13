import { seo } from "@/constants/seo";

export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  twitter: string;
  locale: string;
};

export const siteConfig: SiteConfig = {
  name: seo.title,
  description: seo.description,
  url: seo.url,
  ogImage: seo.ogImage,
  twitter: seo.twitter,
  locale: seo.locale,
};
