import { create } from "zustand";
import { ComparisonItem } from "../types";

interface ComparatorState {
  items: ComparisonItem[];
  addItem: () => void;
  updateItem: (id: string, field: keyof ComparisonItem, value: string) => void;
  removeItem: (id: string) => void;
  resetItems: () => void;
}

const createInitialItems = (): ComparisonItem[] => [
  {
    id: "1",
    name: "ตัวเลือก A",
    price: "",
    qty: "",
    unit: "ชิ้น",
  },
  {
    id: "2",
    name: "ตัวเลือก B",
    price: "",
    qty: "",
    unit: "ชิ้น",
  },
];

export const useComparatorStore = create<ComparatorState>((set) => ({
  items: createInitialItems(),

  addItem: () =>
    set((state) => {
      const nextLetter = String.fromCharCode(65 + state.items.length);
      const newItem: ComparisonItem = {
        id: Date.now().toString(),
        name: `ตัวเลือก ${nextLetter}`,
        price: "",
        qty: "",
        unit: state.items[state.items.length - 1]?.unit || "ชิ้น",
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

  resetItems: () => set({ items: createInitialItems() }),
}));
