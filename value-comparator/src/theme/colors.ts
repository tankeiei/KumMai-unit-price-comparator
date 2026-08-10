import { ColorSchemeName } from "react-native";
import { ThemeMode } from "../types";

export const darkColors = {
  bg: "#0D1117",
  panel: "#161B22",
  panelBorder: "#30363D",
  ink: "#F0F6FC",
  inkDim: "#8B949E",
  accent: "#F0B90B",
  good: "#3FB950",
  goodBg: "#11271D",
  bad: "#F85149",
  badBg: "#2B1A1D",
  paper: "#FAF4E6",
  paperInk: "#1C2128",
} as const;

export const lightColors = {
  bg: "#F6F8FA",
  panel: "#FFFFFF",
  panelBorder: "#D0D7DE",
  ink: "#1F2328",
  inkDim: "#6E7681",
  accent: "#D97706",
  good: "#1F883D",
  goodBg: "#DAFBE1",
  bad: "#CF222E",
  badBg: "#FFEBE9",
  paper: "#FAF4E6",
  paperInk: "#1C2128",
} as const;

export type AppColors = typeof darkColors;

export const colors = darkColors; // Default backward-compatible export

export function getAppColors(theme: ThemeMode, systemColorScheme?: ColorSchemeName): AppColors {
  if (theme === "dark") return darkColors;
  if (theme === "light") return lightColors;
  return systemColorScheme === "light" ? lightColors : darkColors;
}
