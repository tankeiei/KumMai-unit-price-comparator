export type ComparisonItem = {
  id: string;
  name: string;
  price: string;   // string value from text input
  qty: string;
  unit: string;
};

export type ComputedItem = ComparisonItem & {
  unitPrice: number | null;
  valid: boolean;
};

export type RankedItem = ComputedItem & {
  rank: number;
  pctMoreExpensive: number; // 0 for rank 1
};
