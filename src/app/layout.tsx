import type { Metadata } from "next";
import { Providers } from "@/providers";
import { Header } from "@/components/layout";
import { baseMetadata } from "@/config/metadata";
import { raleway } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = baseMetadata;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${raleway.variable} ${raleway.className}`} suppressHydrationWarning>
      <body className="antialiased">
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
