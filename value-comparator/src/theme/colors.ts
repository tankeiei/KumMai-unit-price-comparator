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
  bg: "#0B0F17",
  panel: "#161F30",
  panelBorder: "#26354D",
  ink: "#F8FAFC",
  inkDim: "#94A3B8",
  accent: "#38BDF8",
  good: "#10B981",
  goodBg: "#064E3B",
  bad: "#F43F5E",
  badBg: "#4C1D24",
  paper: "#1E293B",
  paperInk: "#F8FAFC",
  warning: "#F59E0B",
  warningBg: "#451A03",
};

export const lightColors: AppColors = {
  bg: "#F8FAFC",
  panel: "#FFFFFF",
  panelBorder: "#E2E8F0",
  ink: "#0F172A",
  inkDim: "#64748B",
  accent: "#0284C7",
  good: "#059669",
  goodBg: "#ECFDF5",
  bad: "#E11D48",
  badBg: "#FFF1F2",
  paper: "#FFFFFF",
  paperInk: "#0F172A",
  warning: "#D97706",
  warningBg: "#FEF3C7",
};

export const colors = darkColors; // Default backward-compatible export

export function getAppColors(theme: ThemeMode, systemColorScheme?: ColorSchemeName): AppColors {
  if (theme === "dark") return darkColors;
  if (theme === "light") return lightColors;
  return systemColorScheme === "light" ? lightColors : darkColors;
}
