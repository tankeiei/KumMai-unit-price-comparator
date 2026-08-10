import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Plus } from "lucide-react-native";
import { AppColors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { getTranslation } from "../constants/translations";
import { LanguageMode } from "../types";

interface AddItemCardProps {
  onAdd: () => void;
  activeColors: AppColors;
  language: LanguageMode;
}

export const AddItemCard: React.FC<AddItemCardProps> = ({
  onAdd,
  activeColors,
  language,
}) => {
  const t = getTranslation(language);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onAdd}
      style={{
        width: "100%",
        backgroundColor: activeColors.panel + "90",
        borderRadius: 16,
        borderWidth: 2,
        borderColor: activeColors.accent + "80",
        borderStyle: "dashed",
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
        marginBottom: 24,
      }}
    >
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: activeColors.accent,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Plus size={18} color={activeColors.paperInk} strokeWidth={2.5} />
      </View>
      <Text
        style={{
          fontFamily: fonts.display,
          fontSize: 16,
          color: activeColors.accent,
        }}
      >
        {t.addOption}
      </Text>
    </TouchableOpacity>
  );
};
