export type UnitCategory = "all" | "liquid" | "weight" | "count";

export interface UnitPreset {
  id: string;
  labelTh: string;
  labelEn: string;
  icon: string;
  category: UnitCategory;
}

export const UNIT_PRESETS: UnitPreset[] = [
  { id: "pcs", labelTh: "ชิ้น", labelEn: "pcs", icon: "🏷️", category: "count" },
  { id: "g", labelTh: "กรัม", labelEn: "g", icon: "⚖️", category: "weight" },
  { id: "kg", labelTh: "กก.", labelEn: "kg", icon: "🏋️", category: "weight" },
  { id: "ml", labelTh: "มล.", labelEn: "ml", icon: "💧", category: "liquid" },
  { id: "l", labelTh: "ลิตร", labelEn: "L", icon: "🥛", category: "liquid" },
  { id: "pack", labelTh: "แพ็ค", labelEn: "pack", icon: "📦", category: "count" },
  { id: "sachet", labelTh: "ซอง", labelEn: "sachet", icon: "✉️", category: "count" },
];
