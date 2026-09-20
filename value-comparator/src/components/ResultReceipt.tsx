import React from "react";
import { View, Text, TouchableOpacity, Share } from "react-native";
import { Receipt, Sparkles, Info, Share2 } from "lucide-react-native";
import { LanguageMode, RankedItem } from "../types";
import { AppColors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { buildSummary } from "../utils/calculations";
import { getTranslation } from "../constants/translations";
import { ResultRow } from "./ResultRow";

interface ResultReceiptProps {
  rankedItems: RankedItem[];
  language: LanguageMode;
  activeColors: AppColors;
}

export const ResultReceipt: React.FC<ResultReceiptProps> = ({
  rankedItems,
  language,
  activeColors,
}) => {
  const t = getTranslation(language);
  const summaryText = buildSummary(rankedItems, language);
  const hasResults = rankedItems.length > 0;

  const handleShare = async () => {
    if (rankedItems.length === 0) return;

    const lines: string[] = [
      t.copyHeader,
      "================================",
    ];

    rankedItems.forEach((it) => {
      const targetPrice = it.displayUnitPrice ?? it.unitPrice;
      const priceStr =
        targetPrice !== null && targetPrice !== undefined
          ? targetPrice.toLocaleString(language === "en" ? "en-US" : "th-TH", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 3,
            })
          : "-";
      const unitStr = it.displayUnit || it.unit || t.defaultUnit;
      const rankIcon = it.rank === 1 ? "🥇" : it.rank === 2 ? "🥈" : it.rank === 3 ? "🥉" : "•";
      const promoStr = it.discountSummary ? ` [${it.discountSummary}]` : "";
      const diffStr = it.rank > 1 ? ` (+${it.pctMoreExpensive.toFixed(1)}%)` : "";

      lines.push(
        `${rankIcon} #${it.rank} ${it.name}${promoStr}: ฿${priceStr} / ${unitStr}${diffStr}`
      );
    });

    if (summaryText) {
      lines.push("--------------------------------");
      lines.push(`💡 ${summaryText}`);
    }
    lines.push("================================");
    lines.push(t.receiptFooter);

    try {
      await Share.share({
        message: lines.join("\n"),
      });
    } catch {
      // ignore
    }
  };

  return (
    <View style={{ marginBottom: 32 }}>
      {/* Receipt Card Container */}
      <View
        style={{
          backgroundColor: activeColors.panel,
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: activeColors.panelBorder,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 4,
        }}
      >
        {/* Receipt Top Header Barcode / Title */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Receipt size={18} color={activeColors.accent} />
            <Text
              style={{
                fontFamily: fonts.display,
                fontSize: 16,
                fontWeight: "700",
                color: activeColors.ink,
                letterSpacing: 0.5,
              }}
            >
              {t.receiptTitle}
            </Text>
          </View>

          {/* Share Button */}
          {hasResults && (
            <TouchableOpacity
              onPress={handleShare}
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                backgroundColor: activeColors.bg,
                paddingHorizontal: 9,
                paddingVertical: 5,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: activeColors.panelBorder,
              }}
            >
              <Share2 size={13} color={activeColors.inkDim} />
              <Text
                style={{
                  fontFamily: fonts.display,
                  fontSize: 12,
                  color: activeColors.inkDim,
                }}
              >
                {t.shareReceipt}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{ alignItems: "center", marginBottom: 8 }}>
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 11,
              color: activeColors.inkDim + "60",
              letterSpacing: 2,
            }}
          >
            • • • • • • • • • • • • • • • • • • • • •
          </Text>
        </View>

        {/* Content Body */}
        {hasResults ? (
          <View>
            {rankedItems.map((item) => (
              <ResultRow
                key={item.id}
                item={item}
                isBest={item.rank === 1}
                language={language}
                activeColors={activeColors}
              />
            ))}

            {/* Summary Box */}
            {summaryText && (
              <View
                style={{
                  marginTop: 12,
                  backgroundColor: activeColors.goodBg,
                  borderWidth: 1.5,
                  borderColor: activeColors.good,
                  borderRadius: 10,
                  padding: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Sparkles size={18} color={activeColors.good} />
                <Text
                  style={{
                    flex: 1,
                    fontFamily: fonts.display,
                    fontSize: 13,
                    color: activeColors.good,
                    lineHeight: 18,
                  }}
                >
                  {summaryText}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <View
            style={{
              paddingVertical: 16,
              alignItems: "center",
              gap: 6,
            }}
          >
            <Info size={24} color={activeColors.inkDim + "60"} />
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: 13,
                color: activeColors.inkDim,
                textAlign: "center",
              }}
            >
              {t.emptyState}
            </Text>
          </View>
        )}

        {/* Receipt Footer Dashed Line & Watermark */}
        <View style={{ marginTop: 12, alignItems: "center" }}>
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 10,
              color: activeColors.inkDim + "60",
              letterSpacing: 2,
              marginBottom: 6,
            }}
          >
            - - - - - - - - - - - - - - - - - - - - -
          </Text>
          <Text
            style={{
              fontFamily: fonts.body,
              fontSize: 11,
              color: activeColors.inkDim + "80",
            }}
          >
            {t.receiptFooter}
          </Text>
        </View>
      </View>
    </View>
  );
};
