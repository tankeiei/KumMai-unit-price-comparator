export type LanguageMode = "th" | "en";
export type ThemeMode = "dark" | "light" | "system";

export type DiscountType = "none" | "bogo" | "second_half" | "fixed" | "percent";

export type ComparisonItem = {
  id: string;
  name: string;
  price: string;   // string value from text input
  qty: string;
  unit: string;
  isPack?: boolean;       // Toggle for Pack Mode
  packCount?: string;     // Number of items per pack (e.g. "3")
  discountType?: DiscountType;
  discountValue?: string; // Amount in THB or %
};

export type ComputedItem = ComparisonItem & {
  unitPrice: number | null;
  effectiveQty: number | null;
  effectivePrice: number | null;
  valid: boolean;
  baseUnitId?: string;
  baseUnitPrice?: number | null;
  displayUnitPrice?: number | null;
  displayUnit?: string;
  discountSummary?: string | null;
};

export type RankedItem = ComputedItem & {
  rank: number;
  pctMoreExpensive: number; // 0 for rank 1
};
