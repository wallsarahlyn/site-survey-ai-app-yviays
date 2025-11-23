// styles.ts
// Uinspect – Neural Blue Tech Theme

export type UinspectColorKey =
  | "primary"
  | "primaryDark"
  | "primarySoft"
  | "bgRoot"
  | "bgElevated"
  | "bgSubtle"
  | "bgLight"
  | "textMain"
  | "textMuted"
  | "textInverse"
  | "borderSubtle"
  | "borderStrong"
  | "divider"
  | "accentTeal"
  | "accentCyanSoft"
  | "success"
  | "successSoft"
  | "warning"
  | "warningSoft"
  | "error"
  | "errorSoft";

export const colors: Record<UinspectColorKey, string> = {
  // Brand / primary blues
  primary: "#007BFF",
  primaryDark: "#005FCC",
  primarySoft: "#2E8FFF",

  // Backgrounds (dark UI)
  bgRoot: "#0C0E14",
  bgElevated: "#1A1F2B",
  bgSubtle: "#2A2F3C",
  bgLight: "#F5F7FA", // for light surfaces like PDFs/marketing

  // Text
  textMain: "#F9FAFF",
  textMuted: "#A7B0C3",
  textInverse: "#0C0E14",

  // Borders / dividers
  borderSubtle: "#3C4250",
  borderStrong: "#565D6D",
  divider: "#262C38",

  // Accents / AI
  accentTeal: "#00E5FF",
  accentCyanSoft: "#4DE7FF",

  // Status
  success: "#28D890",
  successSoft: "#173B2C",
  warning: "#FFC845",
  warningSoft: "#3B3118",
  error: "#FF4F4F",
  errorSoft: "#3A2224",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radii = {
  sm: 6,
  md: 8,
  lg: 12,
  pill: 999,
};

export const shadows = {
  card: "0 10px 30px rgba(0, 0, 0, 0.25)",
  elevated: "0 14px 40px rgba(0, 0, 0, 0.35)",
};

export type TypographyVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "bodyLg"
  | "body"
  | "label";

export interface TypographyStyle {
  fontSize: number;
  lineHeight: number;
  fontWeight: "400" | "500" | "600" | "700";
}

export const typography: Record<TypographyVariant, TypographyStyle> = {
  display: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "600",
  },
  h1: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "600",
  },
  h2: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "600",
  },
  h3: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "600",
  },
  bodyLg: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "500",
  },
};

// Common component tokens – handy if you use styled-components or RN StyleSheet

export const components = {
  buttonPrimary: {
    backgroundColor: colors.primary,
    color: colors.textMain,
    borderRadius: radii.md,
    paddingVertical: 10,
    paddingHorizontal: 18,
    fontSize: typography.body.fontSize,
    fontWeight: typography.label.fontWeight,
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    color: colors.textMain,
    borderColor: colors.borderStrong,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingVertical: 10,
    paddingHorizontal: 18,
    fontSize: typography.body.fontSize,
    fontWeight: typography.label.fontWeight,
  },
  card: {
    backgroundColor: colors.bgElevated,
    borderRadius: radii.md,
    padding: spacing.md,
    boxShadow: shadows.card,
    borderColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
  },
  input: {
    backgroundColor: colors.bgSubtle,
    borderColor: colors.borderSubtle,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: colors.textMain,
    placeholderColor: colors.textMuted,
    fontSize: typography.body.fontSize,
  },
  chipSeverityLow: {
    backgroundColor: "rgba(40,216,144,0.12)",
    color: colors.success,
    borderRadius: radii.pill,
    paddingVertical: 4,
    paddingHorizontal: 10,
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
  },
  chipSeverityMedium: {
    backgroundColor: "rgba(255,200,69,0.14)",
    color: colors.warning,
    borderRadius: radii.pill,
    paddingVertical: 4,
    paddingHorizontal: 10,
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
  },
  chipSeverityHigh: {
    backgroundColor: "rgba(255,79,79,0.14)",
    color: colors.error,
    borderRadius: radii.pill,
    paddingVertical: 4,
    paddingHorizontal: 10,
    fontSize: typography.label.fontSize,
    fontWeight: typography.label.fontWeight,
  },
};

// Single theme object if you like importing one thing
export const UinspectTheme = {
  colors,
  spacing,
  radii,
  shadows,
  typography,
  components,
};

export type UinspectThemeType = typeof UinspectTheme;
