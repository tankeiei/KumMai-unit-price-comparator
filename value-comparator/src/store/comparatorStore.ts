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
  updateItem: (id: string, field: keyof ComparisonItem, value: any) => void;
  removeItem: (id: string) => void;
  resetItems: () => void;
  setLanguage: (language: LanguageMode) => void;
  setTheme: (theme: ThemeMode) => void;
}

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
    },
    {
      id: "2",
      name: `${t.optionPrefix} B`,
      price: "",
      qty: "",
      unit: t.unitPresets[0] || "ชิ้น",
      isPack: false,
      packCount: "1",
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
          const nextLetter = String.fromCharCode(65 + state.items.length);
          const newItem: ComparisonItem = {
            id: Date.now().toString(),
            name: `${t.optionPrefix} ${nextLetter}`,
            price: "",
            qty: "",
            unit: state.items[state.items.length - 1]?.unit || t.unitPresets[0],
            isPack: false,
            packCount: "1",
          };
          return { items: [...state.items, newItem] };
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
          return {
            items: state.items.filter((item) => item.id !== id),
          };
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
