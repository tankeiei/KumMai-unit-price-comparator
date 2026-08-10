import React from "react";
import { View, Text } from "react-native";
import { Trophy } from "lucide-react-native";
import { RankedItem } from "../types";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";

interface ResultRowProps {
  item: RankedItem;
  isBest: boolean;
}

export const ResultRow: React.FC<ResultRowProps> = ({ item, isBest }) => {
  const formattedUnitPrice =
    item.unitPrice !== null
      ? item.unitPrice.toLocaleString("th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : "-";

  const formattedPct =
    item.pctMoreExpensive % 1 === 0
      ? item.pctMoreExpensive.toFixed(0)
      : item.pctMoreExpensive.toFixed(1);

  return (
    <View
      style={{
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.paperInk + "1A",
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
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: isBest ? colors.good : colors.paperInk + "10",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isBest ? (
            <Trophy size={16} color={colors.paperInk} />
          ) : (
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: 14,
                fontWeight: "700",
                color: colors.paperInk + "80",
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
              fontSize: 15,
              color: colors.paperInk,
              marginBottom: 2,
            }}
            numberOfLines={1}
          >
            {item.name || `ตัวเลือกที่ ${item.rank}`}
          </Text>
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 13,
              color: colors.paperInk + "99",
            }}
          >
            ฿{formattedUnitPrice} / {item.unit || "หน่วย"}
          </Text>
        </View>
      </View>

      {/* Difference / Best Badge */}
      <View style={{ marginLeft: 8 }}>
        {isBest ? (
          <View
            style={{
              backgroundColor: colors.good,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.display,
                fontSize: 12,
                color: colors.paperInk,
              }}
            >
              คุ้มที่สุด
            </Text>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: colors.bad + "20",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.bad + "40",
            }}
          >
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: 12,
                color: colors.bad,
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
