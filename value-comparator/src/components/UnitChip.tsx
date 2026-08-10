import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { AppColors } from "../theme/colors";
import { fonts } from "../theme/typography";

interface UnitChipProps {
  label: string;
  icon?: string;
  isSelected: boolean;
  onSelect: () => void;
  activeColors: AppColors;
}

export const UnitChip: React.FC<UnitChipProps> = ({
  label,
  icon,
  isSelected,
  onSelect,
  activeColors,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onSelect}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: isSelected ? activeColors.accent : activeColors.bg,
        borderColor: isSelected ? activeColors.accent : activeColors.panelBorder,
        borderWidth: 1.5,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginRight: 6,
        marginBottom: 6,
        shadowColor: isSelected ? activeColors.accent : "transparent",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isSelected ? 0.3 : 0,
        shadowRadius: 4,
        elevation: isSelected ? 3 : 0,
      }}
    >
      {icon && (
        <Text style={{ fontSize: 13, marginRight: 2 }}>{icon}</Text>
      )}
      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: 13,
          color: isSelected ? activeColors.paperInk : activeColors.inkDim,
          fontWeight: isSelected ? "700" : "500",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
