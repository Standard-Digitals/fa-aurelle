import { duration, ease, stagger } from "@/constants/animations";

export type AnimationConfig = {
  duration: typeof duration;
  ease: typeof ease;
  stagger: typeof stagger;
};

export const animationConfig: AnimationConfig = {
  duration,
  ease,
  stagger,
};
