/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
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
      },
      fontFamily: {
        mitr: ["Mitr_600SemiBold"],
        sarabun: ["Sarabun_400Regular"],
        mono: ["JetBrainsMono_500Medium"],
      },
    },
  },
  plugins: [],
};
