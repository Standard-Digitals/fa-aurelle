export const duration = {
  fast: 0.3,
  normal: 0.6,
  slow: 1.0,
  cinematic: 1.6,
} as const;

export const ease = {
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.76, 0, 0.24, 1] as const,
  smooth: [0.43, 0.13, 0.23, 0.96] as const,
};

export const stagger = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.2,
} as const;
