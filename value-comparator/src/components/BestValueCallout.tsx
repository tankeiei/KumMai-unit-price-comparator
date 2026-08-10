import React from "react";
import { View, Text } from "react-native";
import { Trophy } from "lucide-react-native";
import { RankedItem } from "../types";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";

interface BestValueCalloutProps {
  bestItem: RankedItem;
  totalCompared: number;
}

export const BestValueCallout: React.FC<BestValueCalloutProps> = ({
  bestItem,
  totalCompared,
}) => {
  const formattedUnitPrice =
    bestItem.unitPrice !== null
      ? bestItem.unitPrice.toLocaleString("th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "-";

  const itemName = bestItem.name.trim() || `ตัวเลือกที่ ${bestItem.rank}`;

  return (
    <View
      style={{
        backgroundColor: colors.goodBg,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: colors.good,
        padding: 20,
        marginBottom: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
      }}
    >
      {/* Top Header Badge & Icon */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          backgroundColor: colors.good,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
          marginBottom: 12,
        }}
      >
        <Trophy size={16} color={colors.paperInk} />
        <Text
          style={{
            fontFamily: fonts.display,
            fontSize: 13,
            color: colors.paperInk,
          }}
        >
          คุ้มที่สุด อันดับ #1
        </Text>
      </View>

      {/* Best Item Name */}
      <Text
        style={{
          fontFamily: fonts.display,
          fontSize: 22,
          color: colors.ink,
          textAlign: "center",
          marginBottom: 4,
        }}
      >
        {itemName}
      </Text>

      {/* Large Unit Price */}
      <Text
        style={{
          fontFamily: fonts.mono,
          fontSize: 26,
          fontWeight: "700",
          color: colors.good,
          marginVertical: 4,
        }}
      >
        ฿{formattedUnitPrice} / {bestItem.unit || "หน่วย"}
      </Text>

      {/* Subtitle Info */}
      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: 13,
          color: colors.inkDim,
          marginTop: 4,
        }}
      >
        ตัวเลือกที่ประหยัดที่สุดจากการเทียบ {totalCompared} ตัวเลือก
      </Text>
    </View>
  );
};
