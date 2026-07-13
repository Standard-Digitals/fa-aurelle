export const fonts = {
  heading: "var(--font-heading)",
  body: "var(--font-body)",
} as const;

export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
} as const;

export const letterSpacing = {
  tight: "-0.02em",
  normal: "0em",
  wide: "0.05em",
  editorial: "0.12em",
} as const;

export const lineHeight = {
  tight: 1.1,
  normal: 1.5,
  relaxed: 1.8,
} as const;
