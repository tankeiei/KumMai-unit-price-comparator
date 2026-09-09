import { ColorSchemeName } from "react-native";
import { ThemeMode } from "../types";

export interface AppColors {
  bg: string;
  panel: string;
  panelBorder: string;
  ink: string;
  inkDim: string;
  accent: string;
  good: string;
  goodBg: string;
  bad: string;
  badBg: string;
  paper: string;
  paperInk: string;
  warning: string;
  warningBg: string;
}

export const darkColors: AppColors = {
  bg: "#132219",
  panel: "#1D3226",
  panelBorder: "#2D4B39",
  ink: "#F3EFE3",
  inkDim: "#9FB0A0",
  accent: "#E8B23D",
  good: "#7FD9A8",
  goodBg: "#173B28",
  bad: "#E8735A",
  badBg: "#3D201A",
  paper: "#F4EFE0",
  paperInk: "#22331F",
  warning: "#F59E0B",
  warningBg: "#382914",
};

export const lightColors: AppColors = {
  bg: "#F4F7F4",
  panel: "#FFFFFF",
  panelBorder: "#D5E0D7",
  ink: "#1D3226",
  inkDim: "#5C7564",
  accent: "#C68A1B",
  good: "#1F884D",
  goodBg: "#E3F7EB",
  bad: "#CF3A27",
  badBg: "#FDEAE8",
  paper: "#FAF5E8",
  paperInk: "#22331F",
  warning: "#D97706",
  warningBg: "#FEF3C7",
};

export const colors = darkColors; // Default backward-compatible export

export function getAppColors(theme: ThemeMode, systemColorScheme?: ColorSchemeName): AppColors {
  if (theme === "dark") return darkColors;
  if (theme === "light") return lightColors;
  return systemColorScheme === "light" ? lightColors : darkColors;
}
