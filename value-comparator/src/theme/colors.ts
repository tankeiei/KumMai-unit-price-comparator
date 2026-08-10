export const colors = {
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

export type ColorKey = keyof typeof colors;
