import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch } from "react-native";
import { Trash2, Package, Trophy } from "lucide-react-native";
import { ComparisonItem, LanguageMode } from "../types";
import { AppColors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { getTranslation } from "../constants/translations";
import { UNIT_PRESETS, UnitCategory } from "../constants/units";
import { UnitChip } from "./UnitChip";
import { CategoryTab } from "./CategoryTab";

interface ItemCardProps {
  item: ComparisonItem;
  index: number;
  totalCount: number;
  onUpdate: (field: keyof ComparisonItem, value: any) => void;
  onRemove: () => void;
  activeColors: AppColors;
  language: LanguageMode;
  isBest?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  index,
  totalCount,
  onUpdate,
  onRemove,
  activeColors,
  language,
  isBest = false,
}) => {
  const t = getTranslation(language);
  const [activeCategory, setActiveCategory] = useState<UnitCategory>("all");

  const priceNum = parseFloat(item.price);
  const qtyNum = parseFloat(item.qty);
  const isPackActive = !!item.isPack;
  const packCountNum = parseFloat(item.packCount || "1");

  const isCalculationValid =
    !isNaN(priceNum) &&
    !isNaN(qtyNum) &&
    priceNum > 0 &&
    qtyNum > 0 &&
    isPackActive &&
    !isNaN(packCountNum) &&
    packCountNum > 0;

  const unitPriceVal = isCalculationValid ? priceNum / (qtyNum * packCountNum) : null;
  const formattedUnitPrice =
    unitPriceVal !== null
      ? unitPriceVal.toLocaleString(language === "en" ? "en-US" : "th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 3,
        })
      : "-";

  const qtyLabelText = isPackActive ? t.packQtyLabel : t.qtyLabel;

  const filteredPresets = UNIT_PRESETS.filter(
    (preset) => activeCategory === "all" || preset.category === activeCategory
  );

  const handleSelectCategory = (cat: UnitCategory) => {
    setActiveCategory(cat);
    if (cat !== "all") {
      const presetsInCat = UNIT_PRESETS.filter((p) => p.category === cat);
      const isCurrentUnitInCat = presetsInCat.some(
        (p) => p.labelTh === item.unit || p.labelEn === item.unit
      );
      if (!isCurrentUnitInCat && presetsInCat.length > 0) {
        const firstPresetLabel =
          language === "en" ? presetsInCat[0].labelEn : presetsInCat[0].labelTh;
        onUpdate("unit", firstPresetLabel);
      }
    }
  };

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: isBest ? activeColors.goodBg + "40" : activeColors.panel,
        borderRadius: 16,
        borderWidth: isBest ? 2.5 : 1.5,
        borderColor: isBest ? activeColors.good : activeColors.panelBorder,
        padding: 16,
        marginBottom: 16,
        shadowColor: isBest ? activeColors.good : "#000",
        shadowOffset: { width: 0, height: isBest ? 4 : 2 },
        shadowOpacity: isBest ? 0.3 : 0.1,
        shadowRadius: isBest ? 8 : 4,
        elevation: isBest ? 6 : 2,
      }}
    >
      {/* Header Row: Circular Number Badge, Name Input, Best Value Highlight Badge & Delete Button */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1, marginRight: 8 }}>
          {/* Circular Number Badge */}
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: isBest ? activeColors.good : activeColors.accent,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 10,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: 13,
                fontWeight: "700",
                color: activeColors.paperInk,
              }}
            >
              #{index + 1}
            </Text>
          </View>

          {/* Name Input */}
          <TextInput
            value={item.name}
            onChangeText={(text) => onUpdate("name", text)}
            placeholder={t.optionPlaceholder}
            placeholderTextColor={activeColors.inkDim + "80"}
            style={{
              flex: 1,
              fontFamily: fonts.display,
              fontSize: 18,
              color: isBest ? activeColors.good : activeColors.accent,
              padding: 0,
              margin: 0,
            }}
          />
        </View>

        {/* Best Value Highlight Badge */}
        {isBest && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              backgroundColor: activeColors.good,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 14,
              marginRight: 8,
            }}
          >
            <Trophy size={14} color={activeColors.paperInk} />
            <Text
              style={{
                fontFamily: fonts.display,
                fontSize: 12,
                color: activeColors.paperInk,
              }}
            >
              {t.bestValueHighlight}
            </Text>
          </View>
        )}

        {totalCount > 2 && (
          <TouchableOpacity
            onPress={onRemove}
            activeOpacity={0.7}
            style={{
              padding: 8,
              backgroundColor: activeColors.bg,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: activeColors.panelBorder,
            }}
          >
            <Trash2 size={16} color={activeColors.bad} />
          </TouchableOpacity>
        )}
      </View>

      {/* 2-Column Grid Inputs: Price & Quantity / Pack Quantity */}
      <View
        style={{
          flexDirection: "row",
          gap: 12,
          marginBottom: 14,
        }}
      >
        {/* Price Input Column */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 11,
              color: activeColors.inkDim,
              textTransform: "lowercase",
              marginBottom: 4,
            }}
          >
            {t.priceLabel}
          </Text>
          <View
            style={{
              backgroundColor: activeColors.bg,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: activeColors.panelBorder,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: 16,
                color: activeColors.inkDim,
                marginRight: 6,
              }}
            >
              ฿
            </Text>
            <TextInput
              value={item.price}
              onChangeText={(text) => onUpdate("price", text)}
              placeholder="0.00"
              placeholderTextColor={activeColors.inkDim + "60"}
              keyboardType="numeric"
              style={{
                flex: 1,
                fontFamily: fonts.mono,
                fontSize: 18,
                color: activeColors.ink,
                padding: 0,
              }}
            />
          </View>
        </View>

        {/* Quantity / Pack Quantity Input Column */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: fonts.mono,
              fontSize: 11,
              color: isPackActive ? activeColors.accent : activeColors.inkDim,
              textTransform: "lowercase",
              marginBottom: 4,
              fontWeight: isPackActive ? "700" : "400",
            }}
          >
            {qtyLabelText}
          </Text>
          <View
            style={{
              backgroundColor: activeColors.bg,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: isPackActive ? activeColors.accent + "80" : activeColors.panelBorder,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <TextInput
              value={item.qty}
              onChangeText={(text) => onUpdate("qty", text)}
              placeholder="1"
              placeholderTextColor={activeColors.inkDim + "60"}
              keyboardType="numeric"
              style={{
                fontFamily: fonts.mono,
                fontSize: 18,
                color: activeColors.ink,
                padding: 0,
              }}
            />
          </View>
        </View>
      </View>

      {/* Unit Selection Row with Category Tabs & Icon Chips */}
      <View style={{ marginBottom: 14 }}>
        <Text
          style={{
            fontFamily: fonts.mono,
            fontSize: 11,
            color: activeColors.inkDim,
            textTransform: "lowercase",
            marginBottom: 6,
          }}
        >
          {t.unitLabel}
        </Text>

        {/* Category Tabs */}
        <CategoryTab
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          activeColors={activeColors}
          language={language}
        />

        {/* Icon Unit Chips */}
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 6 }}>
          {filteredPresets.map((preset) => {
            const chipLabel = language === "en" ? preset.labelEn : preset.labelTh;
            const isSelected = item.unit === chipLabel || item.unit === preset.labelTh || item.unit === preset.labelEn;
            return (
              <UnitChip
                key={preset.id}
                label={chipLabel}
                icon={preset.icon}
                isSelected={isSelected}
                onSelect={() => onUpdate("unit", chipLabel)}
                activeColors={activeColors}
              />
            );
          })}
        </View>

        {/* Custom Unit Input */}
        <TextInput
          value={item.unit}
          onChangeText={(text) => onUpdate("unit", text)}
          placeholder={t.customUnitPlaceholder}
          placeholderTextColor={activeColors.inkDim + "60"}
          style={{
            backgroundColor: activeColors.bg,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: activeColors.panelBorder,
            paddingHorizontal: 10,
            paddingVertical: 6,
            fontFamily: fonts.body,
            fontSize: 14,
            color: activeColors.ink,
          }}
        />
      </View>

      {/* Pack Mode Toggle Header & Section */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: activeColors.panelBorder + "80",
          paddingTop: 12,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Package size={16} color={activeColors.accent} />
            <Text
              style={{
                fontFamily: fonts.display,
                fontSize: 14,
                color: activeColors.ink,
              }}
            >
              {t.packModeToggle}
            </Text>
          </View>

          <Switch
            value={isPackActive}
            onValueChange={(val) => onUpdate("isPack", val)}
            trackColor={{
              false: activeColors.bg,
              true: activeColors.accent + "80",
            }}
            thumbColor={isPackActive ? activeColors.accent : activeColors.inkDim}
          />
        </View>

        {/* Expanded Pack Details */}
        {isPackActive && (
          <View
            style={{
              marginTop: 10,
              backgroundColor: activeColors.bg,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: activeColors.panelBorder,
              padding: 12,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Text
                style={{
                  fontFamily: fonts.body,
                  fontSize: 13,
                  color: activeColors.inkDim,
                  flex: 1,
                }}
              >
                {t.packCountLabel}:
              </Text>

              <View
                style={{
                  width: 80,
                  backgroundColor: activeColors.panel,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: activeColors.panelBorder,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <TextInput
                  value={item.packCount ?? "1"}
                  onChangeText={(text) => onUpdate("packCount", text)}
                  placeholder={t.packCountPlaceholder}
                  placeholderTextColor={activeColors.inkDim + "60"}
                  keyboardType="numeric"
                  style={{
                    fontFamily: fonts.mono,
                    fontSize: 16,
                    color: activeColors.ink,
                    textAlign: "center",
                    padding: 0,
                  }}
                />
              </View>
            </View>

            {/* Formula Explanation Preview */}
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: 11,
                color: activeColors.accent,
                marginTop: 8,
              }}
            >
              {t.calcExplanation(
                item.price || "0",
                item.qty || "1",
                item.packCount || "1",
                formattedUnitPrice,
                item.unit || t.defaultUnit
              )}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
