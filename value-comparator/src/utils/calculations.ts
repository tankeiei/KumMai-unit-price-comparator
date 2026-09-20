import { ComparisonItem, ComputedItem, LanguageMode, RankedItem } from "../types";
import { getTranslation } from "../constants/translations";
import { findUnitDefinition } from "../constants/units";

/**
 * Safely parses string inputs to numbers, stripping commas and whitespace.
 */
export function parseCleanFloat(str?: string | null): number {
  if (!str) return NaN;
  const cleaned = str.toString().replace(/,/g, "").trim();
  return parseFloat(cleaned);
}

/**
 * Computes unit price, promo adjustments, and normalized base unit price for a single item.
 */
export function computeUnitPrice(item: ComparisonItem): ComputedItem {
  const promoType = item.promoType || "STANDARD";
  const unitDef = findUnitDefinition(item.unit);
  const multiplier = unitDef ? unitDef.multiplierToBase : 1;
  const baseUnitId = unitDef ? unitDef.baseUnitId : item.unit.trim().toLowerCase() || "unit";

  // Mode 1: BUNDLE_PRICE (e.g. 2 items for 35 THB, 62g each)
  if (promoType === "BUNDLE_PRICE") {
    const bundleQtyNum = parseCleanFloat(item.bundleQty || "2");
    const bundlePriceNum = parseCleanFloat(item.bundlePrice || item.price);
    const qtyPerPiece = parseCleanFloat(item.qty);

    const isValid =
      !isNaN(bundleQtyNum) &&
      bundleQtyNum > 0 &&
      !isNaN(bundlePriceNum) &&
      bundlePriceNum > 0 &&
      !isNaN(qtyPerPiece) &&
      qtyPerPiece > 0;

    if (!isValid) {
      return {
        ...item,
        unitPrice: null,
        effectiveQty: null,
        effectivePrice: null,
        totalPayPrice: null,
        totalPieces: null,
        totalVolume: null,
        effectivePricePerPiece: null,
        valid: false,
        discountSummary: null,
        promoSummary: null,
      };
    }

    const totalPayPrice = bundlePriceNum;
    const totalPieces = bundleQtyNum;
    const totalRawVolume = totalPieces * qtyPerPiece;
    const effectiveQty = totalRawVolume * multiplier;
    const rawUnitPrice = totalPayPrice / totalRawVolume;
    const baseUnitPrice = totalPayPrice / effectiveQty;
    const effectivePricePerPiece = totalPayPrice / totalPieces;
    const promoSummary = `${bundleQtyNum} ชิ้น ฿${bundlePriceNum}`;

    return {
      ...item,
      unitPrice: rawUnitPrice,
      effectiveQty,
      effectivePrice: totalPayPrice,
      totalPayPrice,
      totalPieces,
      totalVolume: totalRawVolume,
      effectivePricePerPiece,
      valid: true,
      baseUnitId,
      baseUnitPrice,
      discountSummary: promoSummary,
      promoSummary,
    };
  }

  // Mode 2: BUY_X_GET_Y (e.g. Buy 2 Get 1 Free, 32 THB each, 69g each)
  if (promoType === "BUY_X_GET_Y") {
    const pricePerPiece = parseCleanFloat(item.price);
    const buyQtyNum = parseCleanFloat(item.buyQty || "2");
    const freeQtyNum = parseCleanFloat(item.freeQty || "1");
    const qtyPerPiece = parseCleanFloat(item.qty);

    const isValid =
      !isNaN(pricePerPiece) &&
      pricePerPiece > 0 &&
      !isNaN(buyQtyNum) &&
      buyQtyNum > 0 &&
      !isNaN(freeQtyNum) &&
      freeQtyNum >= 0 &&
      !isNaN(qtyPerPiece) &&
      qtyPerPiece > 0;

    if (!isValid) {
      return {
        ...item,
        unitPrice: null,
        effectiveQty: null,
        effectivePrice: null,
        totalPayPrice: null,
        totalPieces: null,
        totalVolume: null,
        effectivePricePerPiece: null,
        valid: false,
        discountSummary: null,
        promoSummary: null,
      };
    }

    const totalPieces = buyQtyNum + freeQtyNum;
    const totalPayPrice = buyQtyNum * pricePerPiece;
    const totalRawVolume = totalPieces * qtyPerPiece;
    const effectiveQty = totalRawVolume * multiplier;
    const rawUnitPrice = totalPayPrice / totalRawVolume;
    const baseUnitPrice = totalPayPrice / effectiveQty;
    const effectivePricePerPiece = totalPayPrice / totalPieces;
    const promoSummary = `ซื้อ ${buyQtyNum} ฟรี ${freeQtyNum}`;

    return {
      ...item,
      unitPrice: rawUnitPrice,
      effectiveQty,
      effectivePrice: totalPayPrice,
      totalPayPrice,
      totalPieces,
      totalVolume: totalRawVolume,
      effectivePricePerPiece,
      valid: true,
      baseUnitId,
      baseUnitPrice,
      discountSummary: promoSummary,
      promoSummary,
    };
  }

  // Mode 3: SECOND_ITEM_DISCOUNT (e.g. 1st item 100 THB, 2nd item 1 THB or 50% off)
  if (promoType === "SECOND_ITEM_DISCOUNT") {
    const price1st = parseCleanFloat(item.price);
    const discountType = item.secondDiscountType || "FIXED_PRICE";
    const discountVal = parseCleanFloat(item.secondDiscountValue || "1");
    const qtyPerPiece = parseCleanFloat(item.qty);

    const isValid =
      !isNaN(price1st) &&
      price1st > 0 &&
      !isNaN(discountVal) &&
      discountVal >= 0 &&
      !isNaN(qtyPerPiece) &&
      qtyPerPiece > 0;

    if (!isValid) {
      return {
        ...item,
        unitPrice: null,
        effectiveQty: null,
        effectivePrice: null,
        totalPayPrice: null,
        totalPieces: null,
        totalVolume: null,
        effectivePricePerPiece: null,
        valid: false,
        discountSummary: null,
        promoSummary: null,
      };
    }

    const price2nd =
      discountType === "PERCENT"
        ? Math.max(0, price1st * (1 - discountVal / 100))
        : Math.max(0, discountVal);

    const totalPieces = 2;
    const totalPayPrice = price1st + price2nd;
    const totalRawVolume = totalPieces * qtyPerPiece;
    const effectiveQty = totalRawVolume * multiplier;
    const rawUnitPrice = totalPayPrice / totalRawVolume;
    const baseUnitPrice = totalPayPrice / effectiveQty;
    const effectivePricePerPiece = totalPayPrice / totalPieces;
    const promoSummary =
      discountType === "PERCENT"
        ? `ชิ้นที่ 2 ลด ${discountVal}%`
        : `ชิ้นที่ 2 จ่าย ฿${discountVal}`;

    return {
      ...item,
      unitPrice: rawUnitPrice,
      effectiveQty,
      effectivePrice: totalPayPrice,
      totalPayPrice,
      totalPieces,
      totalVolume: totalRawVolume,
      effectivePricePerPiece,
      valid: true,
      baseUnitId,
      baseUnitPrice,
      discountSummary: promoSummary,
      promoSummary,
    };
  }

  // Standard Mode
  const priceNum = parseCleanFloat(item.price);
  const qtyNum = parseCleanFloat(item.qty);

  let packCountNum = 1;
  if (item.isPack) {
    const parsedPack = parseCleanFloat(item.packCount || "1");
    if (!isNaN(parsedPack) && parsedPack > 0 && isFinite(parsedPack)) {
      packCountNum = parsedPack;
    }
  }

  let effectivePrice = priceNum;
  let promoMultiplierQty = 1;
  let discountSummary: string | null = null;

  if (item.discountType && item.discountType !== "none") {
    switch (item.discountType) {
      case "bogo":
        promoMultiplierQty = 2;
        discountSummary = "1 แถม 1";
        break;
      case "second_half":
        effectivePrice = priceNum * 0.75;
        discountSummary = "ชิ้นที่ 2 ลด 50%";
        break;
      case "fixed": {
        const discountVal = parseCleanFloat(item.discountValue || "0");
        if (!isNaN(discountVal) && discountVal > 0) {
          effectivePrice = Math.max(0.01, priceNum - discountVal);
          discountSummary = `ลด ฿${discountVal}`;
        }
        break;
      }
      case "percent": {
        const pctVal = parseCleanFloat(item.discountValue || "0");
        if (!isNaN(pctVal) && pctVal > 0 && pctVal <= 100) {
          effectivePrice = Math.max(0.01, priceNum * (1 - pctVal / 100));
          discountSummary = `ลด ${pctVal}%`;
        }
        break;
      }
    }
  }

  const effectiveQty = qtyNum * packCountNum * promoMultiplierQty * multiplier;

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
      effectivePrice: null,
      totalPayPrice: null,
      totalPieces: null,
      totalVolume: null,
      effectivePricePerPiece: null,
      valid: false,
      discountSummary: null,
      promoSummary: null,
    };
  }

  const rawUnitPrice = effectivePrice / (qtyNum * packCountNum * promoMultiplierQty);
  const baseUnitPrice = effectivePrice / effectiveQty;

  return {
    ...item,
    unitPrice: rawUnitPrice,
    effectiveQty,
    effectivePrice,
    totalPayPrice: effectivePrice,
    totalPieces: packCountNum * promoMultiplierQty,
    totalVolume: qtyNum * packCountNum * promoMultiplierQty,
    effectivePricePerPiece: effectivePrice / (packCountNum * promoMultiplierQty),
    valid: true,
    baseUnitId,
    baseUnitPrice,
    discountSummary,
    promoSummary: discountSummary,
  };
}

/**
 * Checks if the valid items in the comparison have compatible unit categories.
 */
export function checkUnitsCompatibility(items: ComparisonItem[]): {
  isCompatible: boolean;
  categories: string[];
} {
  const validItems = items.filter((it) => {
    const p = parseCleanFloat(it.price);
    const q = parseCleanFloat(it.qty);
    return !isNaN(p) && !isNaN(q) && p > 0 && q > 0;
  });

  if (validItems.length < 2) {
    return { isCompatible: true, categories: [] };
  }

  const catSet = new Set<string>();
  for (const it of validItems) {
    const def = findUnitDefinition(it.unit);
    if (def) {
      catSet.add(def.category);
    }
  }

  // If there are multiple different standard categories (e.g. liquid AND weight), flag as incompatible
  const isCompatible = catSet.size <= 1;

  return {
    isCompatible,
    categories: Array.from(catSet),
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
  if (best.isPack && best.packCount && parseCleanFloat(best.packCount) > 1) {
    bestName += ` (${t.packTag(best.packCount)})`;
  }
  if (best.discountSummary) {
    bestName += ` [${best.discountSummary}]`;
  }

  let worstName = worst.name.trim() || t.optionRankLabel(worst.rank);
  if (worst.isPack && worst.packCount && parseCleanFloat(worst.packCount) > 1) {
    worstName += ` (${t.packTag(worst.packCount)})`;
  }
  if (worst.discountSummary) {
    worstName += ` [${worst.discountSummary}]`;
  }

  const diffPct = worst.pctMoreExpensive;

  // Handle tie scenario
  if (diffPct === 0) {
    const targetPrice = best.displayUnitPrice ?? best.unitPrice;
    const targetUnit = best.displayUnit || best.unit || t.defaultUnit;
    const formattedPrice =
      targetPrice !== null && targetPrice !== undefined
        ? targetPrice.toLocaleString(lang === "en" ? "en-US" : "th-TH", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 3,
          })
        : "-";
    return t.tieSummary(`${bestName}, ${worstName}`, formattedPrice, targetUnit);
  }

  let formattedPct = "";
  if (diffPct > 0 && diffPct < 0.1) {
    formattedPct = "< 0.1";
  } else {
    formattedPct = diffPct % 1 === 0 ? diffPct.toFixed(0) : diffPct.toFixed(1);
  }

  return t.savingsSummary(bestName, worstName, formattedPct);
}
