export type LanguageMode = "th" | "en";
export type ThemeMode = "dark" | "light" | "system";

export type DiscountType = "none" | "bogo" | "second_half" | "fixed" | "percent";
export type PromoType = "STANDARD" | "BUNDLE_PRICE" | "BUY_X_GET_Y" | "SECOND_ITEM_DISCOUNT";

export type ComparisonItem = {
  id: string;
  name: string;
  price: string;   // string value from text input
  qty: string;     // quantity per piece
  unit: string;
  promoType?: PromoType;
  bundleQty?: string;         // e.g. "2" for "2 items 35 THB"
  bundlePrice?: string;       // e.g. "35"
  buyQty?: string;            // e.g. "2" for "Buy 2 Get 1 Free"
  freeQty?: string;           // e.g. "1"
  secondDiscountType?: "FIXED_PRICE" | "PERCENT";
  secondDiscountValue?: string; // e.g. "1" THB or "50"%
  isPack?: boolean;       // Toggle for Pack Mode
  packCount?: string;     // Number of items per pack (e.g. "3")
  discountType?: DiscountType;
  discountValue?: string; // Amount in THB or %
};

export type ComputedItem = ComparisonItem & {
  unitPrice: number | null;
  effectiveQty: number | null;
  effectivePrice: number | null;
  totalPayPrice?: number | null;
  totalPieces?: number | null;
  totalVolume?: number | null;
  effectivePricePerPiece?: number | null;
  valid: boolean;
  baseUnitId?: string;
  baseUnitPrice?: number | null;
  displayUnitPrice?: number | null;
  displayUnit?: string;
  discountSummary?: string | null;
  promoSummary?: string | null;
};

export type RankedItem = ComputedItem & {
  rank: number;
  pctMoreExpensive: number; // 0 for rank 1
};

