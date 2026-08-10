import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { Plus } from "lucide-react-native";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";

interface AddItemCardProps {
  onAdd: () => void;
}

export const AddItemCard: React.FC<AddItemCardProps> = ({ onAdd }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onAdd}
      style={{
        width: "100%",
        backgroundColor: colors.panel + "90",
        borderRadius: 16,
        borderWidth: 2,
        borderColor: colors.accent + "80",
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
          backgroundColor: colors.accent,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Plus size={18} color={colors.paperInk} strokeWidth={2.5} />
      </View>
      <Text
        style={{
          fontFamily: fonts.display,
          fontSize: 16,
          color: colors.accent,
        }}
      >
        เพิ่มตัวเลือกเทียบราคา
      </Text>
    </TouchableOpacity>
  );
};
