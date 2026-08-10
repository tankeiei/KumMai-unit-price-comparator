import React from "react";
import { View, Text } from "react-native";
import { Trophy } from "lucide-react-native";
import { LanguageMode, RankedItem } from "../types";
import { AppColors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { getTranslation } from "../constants/translations";

interface BestValueCalloutProps {
  bestItem: RankedItem;
  totalCompared: number;
  activeColors: AppColors;
  language: LanguageMode;
}

export const BestValueCallout: React.FC<BestValueCalloutProps> = ({
  bestItem,
  totalCompared,
  activeColors,
  language,
}) => {
  const t = getTranslation(language);

  const formattedUnitPrice =
    bestItem.unitPrice !== null
      ? bestItem.unitPrice.toLocaleString(language === "en" ? "en-US" : "th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "-";

  const itemName = bestItem.name.trim() || t.optionRankLabel(bestItem.rank);

  return (
    <View
      style={{
        backgroundColor: activeColors.goodBg,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: activeColors.good,
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
          backgroundColor: activeColors.good,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 20,
          marginBottom: 12,
        }}
      >
        <Trophy size={16} color={activeColors.paperInk} />
        <Text
          style={{
            fontFamily: fonts.display,
            fontSize: 13,
            color: activeColors.paperInk,
          }}
        >
          {t.bestValueBadge}
        </Text>
      </View>

      {/* Best Item Name */}
      <Text
        style={{
          fontFamily: fonts.display,
          fontSize: 22,
          color: activeColors.ink,
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
          color: activeColors.good,
          marginVertical: 4,
        }}
      >
        ฿{formattedUnitPrice} / {bestItem.unit || t.defaultUnit}
      </Text>

      {/* Subtitle Info */}
      <Text
        style={{
          fontFamily: fonts.body,
          fontSize: 13,
          color: activeColors.inkDim,
          marginTop: 4,
        }}
      >
        {t.bestValueSubtitle(totalCompared)}
      </Text>
    </View>
  );
};
