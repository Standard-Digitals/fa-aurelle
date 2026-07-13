"use client";

import type { WithChildren } from "@/types";
import { SmoothScrollProvider } from "./smooth-scroll-provider";

export function Providers({ children }: WithChildren) {
  return <SmoothScrollProvider>{children}</SmoothScrollProvider>;
}
