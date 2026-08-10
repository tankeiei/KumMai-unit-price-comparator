import { ColorSchemeName } from "react-native";
import { ThemeMode } from "../types";

export const darkColors = {
  bg: "#0F1B13",
  panel: "#182A1D",
  panelBorder: "#2A4530",
  ink: "#F5F1E6",
  inkDim: "#8FA391",
  accent: "#E3A73F",
  good: "#5FBE85",
  goodBg: "#1D3626",
  bad: "#E2735A",
  badBg: "#3A241F",
  paper: "#FBF6EA",
  paperInk: "#23301F",
} as const;

export const lightColors = {
  bg: "#F2F6F3",
  panel: "#FFFFFF",
  panelBorder: "#D2E0D4",
  ink: "#1A2E20",
  inkDim: "#5B7561",
  accent: "#B87A14",
  good: "#268246",
  goodBg: "#E3F5E9",
  bad: "#C9442A",
  badBg: "#FCEBE8",
  paper: "#FAF4E6",
  paperInk: "#23301F",
} as const;

export type AppColors = typeof darkColors;

export const colors = darkColors; // Default backward-compatible export

export function getAppColors(theme: ThemeMode, systemColorScheme?: ColorSchemeName): AppColors {
  if (theme === "dark") return darkColors;
  if (theme === "light") return lightColors;
  return systemColorScheme === "light" ? lightColors : darkColors;
}
