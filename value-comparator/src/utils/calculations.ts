import { ComparisonItem, ComputedItem, LanguageMode, RankedItem } from "../types";
import { getTranslation } from "../constants/translations";

/**
 * Computes unit price for a single item.
 * Valid if price > 0 and qty > 0.
 * If isPack is true, effectiveQty = qty * packCount.
 */
export function computeUnitPrice(item: ComparisonItem): ComputedItem {
  const priceNum = parseFloat(item.price);
  const qtyNum = parseFloat(item.qty);

  let packCountNum = 1;
  if (item.isPack) {
    const parsedPack = parseFloat(item.packCount || "1");
    if (!isNaN(parsedPack) && parsedPack > 0 && isFinite(parsedPack)) {
      packCountNum = parsedPack;
    }
  }

  const effectiveQty = qtyNum * packCountNum;

  const isValid =
    !isNaN(priceNum) &&
    !isNaN(qtyNum) &&
    priceNum > 0 &&
    qtyNum > 0 &&
    isFinite(priceNum) &&
    isFinite(qtyNum) &&
    effectiveQty > 0;

  if (!isValid) {
    return {
      ...item,
      unitPrice: null,
      effectiveQty: null,
      valid: false,
    };
  }

  const unitPrice = priceNum / effectiveQty;
  return {
    ...item,
    unitPrice,
    effectiveQty,
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
export function buildSummary(rankedItems: RankedItem[], lang: LanguageMode = "th"): string | null {
  if (rankedItems.length < 2) {
    return null;
  }

  const t = getTranslation(lang);
  const best = rankedItems[0];
  const worst = rankedItems[rankedItems.length - 1];

  let bestName = best.name.trim() || t.optionRankLabel(best.rank);
  if (best.isPack && best.packCount && parseFloat(best.packCount) > 1) {
    bestName += ` (${t.packTag(best.packCount)})`;
  }

  let worstName = worst.name.trim() || t.optionRankLabel(worst.rank);
  if (worst.isPack && worst.packCount && parseFloat(worst.packCount) > 1) {
    worstName += ` (${t.packTag(worst.packCount)})`;
  }

  const diffPct = worst.pctMoreExpensive;
  const formattedPct = diffPct % 1 === 0 ? diffPct.toFixed(0) : diffPct.toFixed(1);

  return t.savingsSummary(bestName, worstName, formattedPct);
}
