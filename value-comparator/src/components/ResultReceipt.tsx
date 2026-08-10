import React from "react";
import { View, Text } from "react-native";
import { Receipt, Sparkles, Info } from "lucide-react-native";
import { LanguageMode, RankedItem } from "../types";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { buildSummary } from "../utils/calculations";
import { getTranslation } from "../constants/translations";
import { ResultRow } from "./ResultRow";

interface ResultReceiptProps {
  rankedItems: RankedItem[];
  language: LanguageMode;
}

export const ResultReceipt: React.FC<ResultReceiptProps> = ({
  rankedItems,
  language,
}) => {
  const t = getTranslation(language);
  const summaryText = buildSummary(rankedItems, language);
  const hasResults = rankedItems.length > 0;

  return (
    <View style={{ marginBottom: 40 }}>
      {/* Receipt Card Container */}
      <View
        style={{
          backgroundColor: colors.paper,
          borderRadius: 16,
          padding: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 8,
        }}
      >
        {/* Receipt Top Header Barcode / Title */}
        <View style={{ alignItems: "center", marginBottom: 16 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <Receipt size={20} color={colors.paperInk} />
            <Text
              style={{
                fontFamily: fonts.display,
                fontSize: 18,
                color: colors.paperInk,
                letterSpacing: 0.5,
              }}
            >
              {t.receiptTitle}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 11,
              color: colors.paperInk + "80",
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
              />
            ))}

            {/* Summary Box */}
            {summaryText && (
              <View
                style={{
                  marginTop: 16,
                  backgroundColor: colors.good + "25",
                  borderWidth: 1.5,
                  borderColor: colors.good,
                  borderRadius: 12,
                  padding: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Sparkles size={20} color={colors.paperInk} />
                <Text
                  style={{
                    flex: 1,
                    fontFamily: fonts.display,
                    fontSize: 14,
                    color: colors.paperInk,
                    lineHeight: 20,
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
              paddingVertical: 20,
              alignItems: "center",
              gap: 8,
            }}
          >
            <Info size={28} color={colors.paperInk + "60"} />
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: 14,
                color: colors.paperInk + "80",
                textAlign: "center",
              }}
            >
              {t.emptyState}
            </Text>
          </View>
        )}

        {/* Receipt Footer Dashed Line & Watermark */}
        <View style={{ marginTop: 16, alignItems: "center" }}>
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 11,
              color: colors.paperInk + "80",
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            - - - - - - - - - - - - - - - - - - - - -
          </Text>
          <Text
            style={{
              fontFamily: fonts.body,
              fontSize: 11,
              color: colors.paperInk + "70",
            }}
          >
            {t.receiptFooter}
          </Text>
        </View>
      </View>
    </View>
  );
};
