import { ComparisonItem, ComputedItem, RankedItem } from "../types";

/**
 * Computes unit price for a single item.
 * Valid if price > 0 and qty > 0.
 */
export function computeUnitPrice(item: ComparisonItem): ComputedItem {
  const priceNum = parseFloat(item.price);
  const qtyNum = parseFloat(item.qty);

  const isValid =
    !isNaN(priceNum) &&
    !isNaN(qtyNum) &&
    priceNum > 0 &&
    qtyNum > 0 &&
    isFinite(priceNum) &&
    isFinite(qtyNum);

  if (!isValid) {
    return {
      ...item,
      unitPrice: null,
      valid: false,
    };
  }

  const unitPrice = priceNum / qtyNum;
  return {
    ...item,
    unitPrice,
    valid: true,
  };
}

/**
 * Ranks valid items from lowest unit price (rank 1) to highest unit price.
 * Attaches rank and percentage difference compared to the best option.
 */
export function rankItems(items: ComparisonItem[]): RankedItem[] {
  const computed = items.map(computeUnitPrice);
  const validItems = computed.filter((item): item is ComputedItem & { unitPrice: number } => 
    item.valid && item.unitPrice !== null
  );

  if (validItems.length === 0) {
    return [];
  }

  // Sort ascending by unit price
  const sorted = [...validItems].sort((a, b) => a.unitPrice - b.unitPrice);

  const bestUnitPrice = sorted[0].unitPrice;

  return sorted.map((item, index) => {
    const rank = index + 1;
    let pctMoreExpensive = 0;

    if (bestUnitPrice > 0 && rank > 1) {
      pctMoreExpensive = ((item.unitPrice - bestUnitPrice) / bestUnitPrice) * 100;
    }

    return {
      ...item,
      rank,
      pctMoreExpensive,
    };
  });
}

/**
 * Builds human-readable savings summary comparing best and worst valid options.
 */
export function buildSummary(rankedItems: RankedItem[]): string | null {
  if (rankedItems.length < 2) {
    return null;
  }

  const best = rankedItems[0];
  const worst = rankedItems[rankedItems.length - 1];

  const bestName = best.name.trim() || `ตัวเลือก ${best.rank}`;
  const worstName = worst.name.trim() || `ตัวเลือก ${worst.rank}`;

  const diffPct = worst.pctMoreExpensive;
  const formattedPct = diffPct % 1 === 0 ? diffPct.toFixed(0) : diffPct.toFixed(1);

  return `ซื้อ ${bestName} แทน ${worstName} ประหยัด ${formattedPct}% ต่อหน่วย`;
}
