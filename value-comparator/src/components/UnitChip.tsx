import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";

interface UnitChipProps {
  label: string;
  isSelected: boolean;
  onSelect: () => void;
}

export const UnitChip: React.FC<UnitChipProps> = ({
  label,
  isSelected,
  onSelect,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onSelect}
      style={{
        backgroundColor: isSelected ? colors.accent : colors.bg,
        borderColor: isSelected ? colors.accent : colors.panelBorder,
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginRight: 6,
        marginBottom: 6,
      }}
    >
      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: 12,
          color: isSelected ? colors.paperInk : colors.inkDim,
          fontWeight: isSelected ? "600" : "400",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
