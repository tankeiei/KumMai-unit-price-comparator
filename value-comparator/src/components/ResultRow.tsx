import React from "react";
import { View, Text } from "react-native";
import { Trophy } from "lucide-react-native";
import { LanguageMode, RankedItem } from "../types";
import { AppColors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { getTranslation } from "../constants/translations";

interface ResultRowProps {
  item: RankedItem;
  isBest: boolean;
  language: LanguageMode;
  activeColors: AppColors;
}

export const ResultRow: React.FC<ResultRowProps> = ({ item, isBest, language, activeColors }) => {
  const t = getTranslation(language);

  const targetPrice = item.displayUnitPrice ?? item.unitPrice;
  const targetUnit = item.displayUnit || item.unit || t.defaultUnit;

  const formattedUnitPrice =
    targetPrice !== null && targetPrice !== undefined
      ? targetPrice.toLocaleString(language === "en" ? "en-US" : "th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 3,
        })
      : "-";

  let formattedPct = "";
  if (item.pctMoreExpensive > 0 && item.pctMoreExpensive < 0.1) {
    formattedPct = "<0.1";
  } else {
    formattedPct =
      item.pctMoreExpensive % 1 === 0
        ? item.pctMoreExpensive.toFixed(0)
        : item.pctMoreExpensive.toFixed(1);
  }

  const packCountNum = parseFloat(item.packCount || "1");
  const packTagStr =
    item.isPack && !isNaN(packCountNum) && packCountNum > 1
      ? ` (${t.packTag(item.packCount || "1")})`
      : "";

  const promoTagStr = item.discountSummary ? ` [${item.discountSummary}]` : "";

  const displayName = `${item.name || t.optionRankLabel(item.rank)}${packTagStr}${promoTagStr}`;

  return (
    <View
      style={{
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: activeColors.panelBorder + "60",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Rank & Info */}
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 10 }}>
        {/* Rank Badge Circle */}
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: isBest ? activeColors.good : activeColors.bg,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: isBest ? activeColors.good : activeColors.panelBorder,
          }}
        >
          {isBest ? (
            <Trophy size={14} color={activeColors.bg} />
          ) : (
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: 12,
                fontWeight: "700",
                color: activeColors.inkDim,
              }}
            >
              #{item.rank}
            </Text>
          )}
        </View>

        {/* Item Details */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: fonts.display,
              fontSize: 14,
              fontWeight: "600",
              color: activeColors.ink,
              marginBottom: 2,
            }}
            numberOfLines={1}
          >
            {displayName}
          </Text>
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 12,
              fontWeight: "600",
              color: isBest ? activeColors.good : activeColors.inkDim,
            }}
          >
            ฿{formattedUnitPrice} / {targetUnit}
          </Text>
          {item.totalPayPrice !== undefined && item.totalPayPrice !== null && item.totalVolume && (
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: 10.5,
                color: activeColors.inkDim + "90",
                marginTop: 1,
              }}
            >
              จ่ายจริง ฿{item.totalPayPrice.toFixed(2)} ({item.totalVolume} {targetUnit})
            </Text>
          )}
        </View>
      </View>

      {/* Difference / Best Badge */}
      <View style={{ marginLeft: 8 }}>
        {isBest ? (
          <View
            style={{
              backgroundColor: activeColors.good,
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.display,
                fontSize: 11,
                fontWeight: "700",
                color: activeColors.bg,
              }}
            >
              {t.bestValueBadge}
            </Text>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: activeColors.bad + "20",
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: activeColors.bad + "40",
            }}
          >
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: 11,
                color: activeColors.bad,
                fontWeight: "600",
              }}
            >
              +{formattedPct}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
