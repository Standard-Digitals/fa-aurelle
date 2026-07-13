import { colors } from "@/constants/colors";
import { fonts, fontWeights, letterSpacing, lineHeight } from "@/constants/fonts";

export type ThemeConfig = {
  colors: typeof colors;
  fonts: typeof fonts;
  fontWeights: typeof fontWeights;
  letterSpacing: typeof letterSpacing;
  lineHeight: typeof lineHeight;
};

export const themeConfig: ThemeConfig = {
  colors,
  fonts,
  fontWeights,
  letterSpacing,
  lineHeight,
};
