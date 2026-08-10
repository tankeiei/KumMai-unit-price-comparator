import { ComparisonItem, ComputedItem, LanguageMode, RankedItem } from "../types";
import { getTranslation } from "../constants/translations";
import { findUnitDefinition } from "../constants/units";

/**
 * Computes unit price and normalized base unit price for a single item.
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

  const unitDef = findUnitDefinition(item.unit);
  const multiplier = unitDef ? unitDef.multiplierToBase : 1;
  const baseUnitId = unitDef ? unitDef.baseUnitId : item.unit.trim().toLowerCase() || "unit";

  const effectiveQty = qtyNum * packCountNum * multiplier;

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

  const rawUnitPrice = priceNum / (qtyNum * packCountNum);
  const baseUnitPrice = priceNum / effectiveQty;

  return {
    ...item,
    unitPrice: rawUnitPrice,
    effectiveQty,
    valid: true,
    baseUnitId,
    baseUnitPrice,
  };
}

/**
 * Ranks valid items from lowest base unit price (rank 1) to highest.
 * Automatically normalizes unit scales (e.g., g vs kg, ml vs L, doz vs pcs).
 */
export function rankItems(items: ComparisonItem[], lang: LanguageMode = "th"): RankedItem[] {
  const computed = items.map(computeUnitPrice);
  const validItems = computed.filter(
    (item): item is ComputedItem & { baseUnitPrice: number; unitPrice: number } =>
      item.valid && item.baseUnitPrice !== undefined && item.baseUnitPrice !== null
  );

  if (validItems.length === 0) {
    return [];
  }

  // Sort ascending by base unit price
  const sorted = [...validItems].sort((a, b) => a.baseUnitPrice - b.baseUnitPrice);

  const bestBaseUnitPrice = sorted[0].baseUnitPrice;

  // Determine if items share the same baseUnitId (e.g., all "g", all "ml", or all "pcs")
  const primaryBaseUnitId = sorted[0].baseUnitId;
  const allSameCategory = sorted.every((it) => it.baseUnitId === primaryBaseUnitId);

  return sorted.map((item, index) => {
    const rank = index + 1;
    let pctMoreExpensive = 0;

    if (bestBaseUnitPrice > 0 && rank > 1) {
      pctMoreExpensive = ((item.baseUnitPrice - bestBaseUnitPrice) / bestBaseUnitPrice) * 100;
    }

    let displayUnitPrice = item.unitPrice;
    let displayUnit = item.unit || (lang === "en" ? "unit" : "หน่วย");

    // If all items are in the same category and converted (e.g. g vs kg, ml vs L)
    if (allSameCategory && primaryBaseUnitId) {
      if (primaryBaseUnitId === "g") {
        // If price per gram is small, display as per kg for cleaner numbers if any item was in kg or large volume
        const hasKg = sorted.some((it) => {
          const def = findUnitDefinition(it.unit);
          return def?.id === "kg";
        });
        if (hasKg || bestBaseUnitPrice < 0.5) {
          displayUnitPrice = item.baseUnitPrice * 1000;
          displayUnit = lang === "en" ? "kg" : "กก.";
        } else {
          displayUnitPrice = item.baseUnitPrice;
          displayUnit = lang === "en" ? "g" : "กรัม";
        }
      } else if (primaryBaseUnitId === "ml") {
        const hasL = sorted.some((it) => {
          const def = findUnitDefinition(it.unit);
          return def?.id === "l";
        });
        if (hasL || bestBaseUnitPrice < 0.5) {
          displayUnitPrice = item.baseUnitPrice * 1000;
          displayUnit = lang === "en" ? "L" : "ลิตร";
        } else {
          displayUnitPrice = item.baseUnitPrice;
          displayUnit = lang === "en" ? "ml" : "มล.";
        }
      } else if (primaryBaseUnitId === "pcs") {
        displayUnitPrice = item.baseUnitPrice;
        displayUnit = lang === "en" ? "pcs" : "ชิ้น";
      }
    }

    return {
      ...item,
      rank,
      pctMoreExpensive,
      displayUnitPrice,
      displayUnit,
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
