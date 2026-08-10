export type LanguageMode = "th" | "en";
export type ThemeMode = "dark" | "light" | "system";

export type ComparisonItem = {
  id: string;
  name: string;
  price: string;   // string value from text input
  qty: string;
  unit: string;
  isPack?: boolean;       // Toggle for Pack Mode
  packCount?: string;     // Number of items per pack (e.g. "3")
};

export type ComputedItem = ComparisonItem & {
  unitPrice: number | null;
  effectiveQty: number | null;
  valid: boolean;
};

export type RankedItem = ComputedItem & {
  rank: number;
  pctMoreExpensive: number; // 0 for rank 1
};
