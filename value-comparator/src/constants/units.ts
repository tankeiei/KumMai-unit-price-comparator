export type UnitCategory = "all" | "liquid" | "weight" | "count";

export interface UnitDefinition {
  id: string;
  aliases: string[];
  labelTh: string;
  labelEn: string;
  icon: string;
  category: UnitCategory;
  multiplierToBase: number; // Factor to convert to base unit
  baseUnitId: string;       // "g" for weight, "ml" for liquid, "pcs" for count
}

export const UNIT_DEFINITIONS: UnitDefinition[] = [
  // --- Weight (Base: g) ---
  {
    id: "g",
    aliases: ["g", "กรัม", "gram", "grams"],
    labelTh: "กรัม",
    labelEn: "g",
    icon: "⚖️",
    category: "weight",
    multiplierToBase: 1,
    baseUnitId: "g",
  },
  {
    id: "kg",
    aliases: ["kg", "กก.", "กิโลกรัม", "กิโล", "kilogram", "kilograms"],
    labelTh: "กก.",
    labelEn: "kg",
    icon: "🏋️",
    category: "weight",
    multiplierToBase: 1000,
    baseUnitId: "g",
  },
  {
    id: "mg",
    aliases: ["mg", "มก.", "มิลลิกรัม", "milligram", "milligrams"],
    labelTh: "มก.",
    labelEn: "mg",
    icon: "💊",
    category: "weight",
    multiplierToBase: 0.001,
    baseUnitId: "g",
  },
  {
    id: "lb",
    aliases: ["lb", "lbs", "ปอนด์", "pound", "pounds"],
    labelTh: "ปอนด์",
    labelEn: "lb",
    icon: "⚖️",
    category: "weight",
    multiplierToBase: 453.59237,
    baseUnitId: "g",
  },
  {
    id: "oz",
    aliases: ["oz", "ออนซ์", "ounce", "ounces"],
    labelTh: "ออนซ์",
    labelEn: "oz",
    icon: "⚖️",
    category: "weight",
    multiplierToBase: 28.349523,
    baseUnitId: "g",
  },

  // --- Liquid / Volume (Base: ml) ---
  {
    id: "ml",
    aliases: ["ml", "มล.", "มิลลิลิตร", "milliliter", "milliliters", "cc"],
    labelTh: "มล.",
    labelEn: "ml",
    icon: "💧",
    category: "liquid",
    multiplierToBase: 1,
    baseUnitId: "ml",
  },
  {
    id: "l",
    aliases: ["l", "ลิตร", "liter", "liters", "litre", "litres"],
    labelTh: "ลิตร",
    labelEn: "L",
    icon: "🥛",
    category: "liquid",
    multiplierToBase: 1000,
    baseUnitId: "ml",
  },
  {
    id: "cup",
    aliases: ["cup", "cups", "ถ้วย", "ถ้วยตวง"],
    labelTh: "ถ้วย",
    labelEn: "cup",
    icon: "☕",
    category: "liquid",
    multiplierToBase: 240,
    baseUnitId: "ml",
  },
  {
    id: "gal",
    aliases: ["gal", "gallon", "gallons", "แกลลอน"],
    labelTh: "แกลลอน",
    labelEn: "gal",
    icon: "🪣",
    category: "liquid",
    multiplierToBase: 3785.41,
    baseUnitId: "ml",
  },
  {
    id: "fl_oz",
    aliases: ["fl oz", "floz", "fl_oz", "ฟลูอิดออนซ์"],
    labelTh: "ฟลูอิดออนซ์",
    labelEn: "fl oz",
    icon: "💧",
    category: "liquid",
    multiplierToBase: 29.5735,
    baseUnitId: "ml",
  },

  // --- Count (Base: pcs) ---
  {
    id: "pcs",
    aliases: ["pcs", "pc", "ชิ้น", "อัน", "ลูก", "ตัว", "แผ่น", "ขวด", "กล่อง", "กระป๋อง", "item", "items"],
    labelTh: "ชิ้น",
    labelEn: "pcs",
    icon: "🏷️",
    category: "count",
    multiplierToBase: 1,
    baseUnitId: "pcs",
  },
  {
    id: "pack",
    aliases: ["pack", "packs", "แพ็ค", "แพค"],
    labelTh: "แพ็ค",
    labelEn: "pack",
    icon: "📦",
    category: "count",
    multiplierToBase: 1,
    baseUnitId: "pcs",
  },
  {
    id: "sachet",
    aliases: ["sachet", "sachets", "ซอง"],
    labelTh: "ซอง",
    labelEn: "sachet",
    icon: "✉️",
    category: "count",
    multiplierToBase: 1,
    baseUnitId: "pcs",
  },
  {
    id: "doz",
    aliases: ["doz", "dozen", "โหล"],
    labelTh: "โหล",
    labelEn: "doz",
    icon: "🧺",
    category: "count",
    multiplierToBase: 12,
    baseUnitId: "pcs",
  },
  {
    id: "pair",
    aliases: ["pair", "pairs", "คู่"],
    labelTh: "คู่",
    labelEn: "pair",
    icon: "👟",
    category: "count",
    multiplierToBase: 2,
    baseUnitId: "pcs",
  },
];

export interface UnitPreset {
  id: string;
  labelTh: string;
  labelEn: string;
  icon: string;
  category: UnitCategory;
}

export const UNIT_PRESETS: UnitPreset[] = UNIT_DEFINITIONS.filter((def) =>
  ["pcs", "g", "kg", "ml", "l", "pack", "sachet"].includes(def.id)
).map((def) => ({
  id: def.id,
  labelTh: def.labelTh,
  labelEn: def.labelEn,
  icon: def.icon,
  category: def.category,
}));

export function findUnitDefinition(unitStr: string): UnitDefinition | undefined {
  if (!unitStr) return undefined;
  const clean = unitStr.trim().toLowerCase();
  return UNIT_DEFINITIONS.find((def) =>
    def.aliases.some((alias) => alias.toLowerCase() === clean)
  );
}
