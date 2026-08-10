import { LanguageMode } from "../types";

export const translations = {
  th: {
    appTitle: "คุ้มไหม?",
    appSubtitle: "เปรียบเทียบราคาต่อหน่วย คุ้มสุดจัดอันดับให้ทันที",
    clearData: "ล้างข้อมูล",
    settingsTitle: "การตั้งค่า",
    languageLabel: "ภาษา / Language",
    themeLabel: "ธีมการแสดงผล",
    themeDark: "มืด",
    themeLight: "สว่าง",
    themeSystem: "ตามระบบ",
    close: "ปิด",
    addOption: "เพิ่มตัวเลือกเทียบราคา",
    optionPrefix: "ตัวเลือก",
    optionPlaceholder: "ระบุชื่อตัวเลือก...",
    priceLabel: "ราคา (บาท)",
    qtyLabel: "ปริมาณ / จำนวน",
    packQtyLabel: "จำนวนแพค",
    unitLabel: "หน่วยสินค้า",
    customUnitPlaceholder: "หรือระบุหน่วยเอง...",
    bestValueBadge: "คุ้มที่สุด อันดับ #1",
    bestValueHighlight: "🏆 คุ้มที่สุด",
    bestValueSubtitle: (total: number) =>
      `ตัวเลือกที่ประหยัดที่สุดจากการเทียบ ${total} ตัวเลือก`,
    optionRankLabel: (rank: number) => `ตัวเลือกที่ ${rank}`,
    defaultUnit: "หน่วย",
    receiptTitle: "ใบสรุปความคุ้มค่า",
    savingsSummary: (best: string, worst: string, pct: string) =>
      `ซื้อ ${best} แทน ${worst} ประหยัด ${pct}% ต่อหน่วย`,
    emptyState:
      "กรอกราคาและจำนวนอย่างน้อย 1 ตัวเลือก\nเพื่อดูการเปรียบเทียบราคาต่อหน่วย",
    receiptFooter: 'คำนวณโดยระบบเปรียบเทียบ "คุ้มไหม?"',
    unitPresets: ["ชิ้น", "กรัม", "มล.", "กก.", "ลิตร"],
    packModeToggle: "โหมดซื้อแพค",
    packCountLabel: "จำนวนชิ้นใน 1 แพค",
    packCountPlaceholder: "3",
    calcExplanation: (price: string, qty: string, pack: string, unitPrice: string, unit: string) =>
      `↳ ราคาจริง/หน่วย = ${price} ÷ (${qty} แพค × ${pack} ชิ้น) = ฿${unitPrice} / ${unit}`,
    packTag: (count: string) => `แพค ${count} ชิ้น`,
    categoryAll: "ทั้งหมด",
    categoryLiquid: "💧 ของเหลว",
    categoryWeight: "⚖️ น้ำหนัก",
    categoryCount: "🏷️ นับชิ้น",
  },
  en: {
    appTitle: "Value Match",
    appSubtitle: "Compare unit prices, get instant best value rankings",
    clearData: "Clear All",
    settingsTitle: "Settings",
    languageLabel: "Language / ภาษา",
    themeLabel: "Theme",
    themeDark: "Dark",
    themeLight: "Light",
    themeSystem: "System",
    close: "Close",
    addOption: "Add Option",
    optionPrefix: "Option",
    optionPlaceholder: "Enter option name...",
    priceLabel: "Price (THB)",
    qtyLabel: "Quantity / Volume",
    packQtyLabel: "Pack Quantity",
    unitLabel: "Unit",
    customUnitPlaceholder: "Or custom unit...",
    bestValueBadge: "Best Value #1",
    bestValueHighlight: "🏆 Best Value",
    bestValueSubtitle: (total: number) =>
      `Most economical choice out of ${total} options`,
    optionRankLabel: (rank: number) => `Option ${rank}`,
    defaultUnit: "unit",
    receiptTitle: "Value Summary",
    savingsSummary: (best: string, worst: string, pct: string) =>
      `Buy ${best} instead of ${worst} to save ${pct}% per unit`,
    emptyState:
      "Fill price & quantity for at least 1 option\nto view unit price comparison",
    receiptFooter: 'Calculated by "Value Match"',
    unitPresets: ["pcs", "g", "ml", "kg", "L"],
    packModeToggle: "Pack Mode",
    packCountLabel: "Items per pack",
    packCountPlaceholder: "3",
    calcExplanation: (price: string, qty: string, pack: string, unitPrice: string, unit: string) =>
      `↳ Real unit price = ${price} ÷ (${qty} packs × ${pack} pcs) = ฿${unitPrice} / ${unit}`,
    packTag: (count: string) => `Pack of ${count}`,
    categoryAll: "All",
    categoryLiquid: "💧 Liquid",
    categoryWeight: "⚖️ Weight",
    categoryCount: "🏷️ Count",
  },
} as const;

export type Translations = typeof translations.th;

export function getTranslation(lang: LanguageMode) {
  return translations[lang] || translations.th;
}
