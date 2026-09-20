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
        backgroundColor: activeColors.panel,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: activeColors.accent + "60",
        borderStyle: "dashed",
        paddingVertical: 10,
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 8,
        marginBottom: 16,
      }}
    >
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: activeColors.accent,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Plus size={15} color={activeColors.bg} strokeWidth={2.5} />
      </View>
      <Text
        style={{
          fontFamily: fonts.display,
          fontSize: 14,
          fontWeight: "600",
          color: activeColors.accent,
        }}
      >
        {t.addOption}
      </Text>
    </TouchableOpacity>
  );
};
