import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { UnitCategory } from "../constants/units";
import { AppColors } from "../theme/colors";
import { getTranslation } from "../constants/translations";
import { LanguageMode } from "../types";
import { fonts } from "../theme/typography";

interface CategoryTabProps {
  activeCategory: UnitCategory;
  onSelectCategory: (category: UnitCategory) => void;
  activeColors: AppColors;
  language: LanguageMode;
}

export const CategoryTab: React.FC<CategoryTabProps> = ({
  activeCategory,
  onSelectCategory,
  activeColors,
  language,
}) => {
  const t = getTranslation(language);

  const categories: { id: UnitCategory; label: string }[] = [
    { id: "all", label: t.categoryAll },
    { id: "liquid", label: t.categoryLiquid },
    { id: "weight", label: t.categoryWeight },
    { id: "count", label: t.categoryCount },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: activeColors.bg,
        borderRadius: 12,
        padding: 3,
        borderWidth: 1,
        borderColor: activeColors.panelBorder,
        marginBottom: 8,
      }}
    >
      {categories.map((cat) => {
        const isSelected = activeCategory === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            activeOpacity={0.8}
            onPress={() => onSelectCategory(cat.id)}
            style={{
              flex: 1,
              paddingVertical: 6,
              paddingHorizontal: 4,
              borderRadius: 9,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isSelected ? activeColors.accent : "transparent",
            }}
          >
            <Text
              style={{
                fontFamily: fonts.display,
                fontSize: 11,
                color: isSelected ? activeColors.paperInk : activeColors.inkDim,
                fontWeight: isSelected ? "700" : "500",
                textAlign: "center",
              }}
              numberOfLines={1}
            >
              {cat.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
