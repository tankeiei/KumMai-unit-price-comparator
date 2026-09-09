import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ComparisonItem, LanguageMode, ThemeMode } from "../types";
import { translations } from "../constants/translations";

interface ComparatorState {
  items: ComparisonItem[];
  language: LanguageMode;
  theme: ThemeMode;
  addItem: () => void;
  duplicateItem: (id: string) => void;
  updateItem: (id: string, field: keyof ComparisonItem, value: any) => void;
  removeItem: (id: string) => void;
  resetItems: () => void;
  setLanguage: (language: LanguageMode) => void;
  setTheme: (theme: ThemeMode) => void;
}

const getIndexLetter = (index: number): string => {
  if (index < 26) {
    return String.fromCharCode(65 + index);
  }
  const first = String.fromCharCode(65 + Math.floor(index / 26) - 1);
  const second = String.fromCharCode(65 + (index % 26));
  return `${first}${second}`;
};

const createInitialItems = (lang: LanguageMode = "th"): ComparisonItem[] => {
  const t = translations[lang] || translations.th;
  return [
    {
      id: "1",
      name: `${t.optionPrefix} A`,
      price: "",
      qty: "",
      unit: t.unitPresets[0] || "ชิ้น",
      isPack: false,
      packCount: "1",
      discountType: "none",
      discountValue: "",
    },
    {
      id: "2",
      name: `${t.optionPrefix} B`,
      price: "",
      qty: "",
      unit: t.unitPresets[0] || "ชิ้น",
      isPack: false,
      packCount: "1",
      discountType: "none",
      discountValue: "",
    },
  ];
};

export const useComparatorStore = create<ComparatorState>()(
  persist(
    (set, get) => ({
      items: createInitialItems("th"),
      language: "th",
      theme: "dark",

      addItem: () =>
        set((state) => {
          const t = translations[state.language] || translations.th;
          const nextLetter = getIndexLetter(state.items.length);
          const newItem: ComparisonItem = {
            id: Date.now().toString(),
            name: `${t.optionPrefix} ${nextLetter}`,
            price: "",
            qty: "",
            unit: state.items[state.items.length - 1]?.unit || t.unitPresets[0],
            isPack: false,
            packCount: "1",
            discountType: "none",
            discountValue: "",
          };
          return { items: [...state.items, newItem] };
        }),

      duplicateItem: (id) =>
        set((state) => {
          const targetIndex = state.items.findIndex((item) => item.id === id);
          if (targetIndex === -1) return state;

          const target = state.items[targetIndex];
          const t = translations[state.language] || translations.th;
          const copySuffix = state.language === "en" ? "(Copy)" : "(คัดลอก)";
          const nextLetter = getIndexLetter(state.items.length);

          const duplicatedItem: ComparisonItem = {
            ...target,
            id: `${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            name: target.name.trim()
              ? `${target.name.trim()} ${copySuffix}`
              : `${t.optionPrefix} ${nextLetter}`,
          };

          const newItems = [...state.items];
          newItems.splice(targetIndex + 1, 0, duplicatedItem);
          return { items: newItems };
        }),

      updateItem: (id, field, value) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, [field]: value } : item
          ),
        })),

      removeItem: (id) =>
        set((state) => {
          if (state.items.length <= 2) return state; // Keep minimum 2 options
          const remaining = state.items.filter((item) => item.id !== id);
          const t = translations[state.language] || translations.th;

          const reordered = remaining.map((item, index) => {
            const letter = getIndexLetter(index);
            const trimmed = item.name.trim();
            const isDefaultTH = /^ตัวเลือก\s+[A-Z0-9]+$/i.test(trimmed);
            const isDefaultEN = /^Option\s+[A-Z0-9]+$/i.test(trimmed);

            if (isDefaultTH || isDefaultEN || !trimmed) {
              return {
                ...item,
                name: `${t.optionPrefix} ${letter}`,
              };
            }
            return item;
          });

          return { items: reordered };
        }),

      resetItems: () =>
        set((state) => ({
          items: createInitialItems(state.language),
        })),

      setLanguage: (language) => set({ language }),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: "value-comparator-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        items: state.items,
        language: state.language,
        theme: state.theme,
      }),
    }
  )
);
