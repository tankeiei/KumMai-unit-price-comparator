import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Trash2, Package, Trophy, Copy, Tag, ChevronDown, RefreshCw } from "lucide-react-native";
import { ComparisonItem, DiscountType, LanguageMode } from "../types";
import { AppColors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { getTranslation } from "../constants/translations";
import { computeUnitPrice } from "../utils/calculations";
import { findUnitDefinition } from "../constants/units";
import { UnitPickerModal } from "./UnitPickerModal";

interface ItemCardProps {
  item: ComparisonItem;
  index: number;
  totalCount: number;
  onUpdate: (field: keyof ComparisonItem, value: any) => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onSyncAllUnits?: (unit: string) => void;
  activeColors: AppColors;
  language: LanguageMode;
  isBest?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  index,
  totalCount,
  onUpdate,
  onDuplicate,
  onRemove,
  onSyncAllUnits,
  activeColors,
  language,
  isBest = false,
}) => {
  const t = getTranslation(language);
  const [isUnitPickerOpen, setIsUnitPickerOpen] = useState(false);
  const [isPackExpanded, setIsPackExpanded] = useState(!!item.isPack);
  const [isPromoExpanded, setIsPromoExpanded] = useState(
    !!(item.discountType && item.discountType !== "none")
  );

  const computed = computeUnitPrice(item);
  const unitDef = findUnitDefinition(item.unit);
  const unitIcon = unitDef?.icon || "🏷️";
  const displayUnit = item.unit || t.defaultUnit;

  const formattedUnitPrice =
    computed.valid && computed.unitPrice !== null
      ? computed.unitPrice.toLocaleString(language === "en" ? "en-US" : "th-TH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 3,
        })
      : null;

  const handleSelectDiscount = (type: DiscountType) => {
    onUpdate("discountType", type);
    if (type === "none") {
      onUpdate("discountValue", "");
    }
  };

  const handlePromptSync = () => {
    if (!onSyncAllUnits) return;
    Alert.alert(
      language === "en" ? "Sync Unit" : "ซิงค์หน่วยสินค้า",
      language === "en"
        ? `Apply unit "${displayUnit}" to all other options?`
        : `ต้องการใช้หน่วย "${displayUnit}" กับทุกตัวเลือกหรือไม่?`,
      [
        {
          text: language === "en" ? "Cancel" : "ยกเลิก",
          style: "cancel",
        },
        {
          text: language === "en" ? "Sync" : "ซิงค์",
          onPress: () => onSyncAllUnits(displayUnit),
        },
      ]
    );
  };

  const discountTypes: { type: DiscountType; label: string }[] = [
    { type: "bogo", label: t.promoTagBogo },
    { type: "second_half", label: t.promoTagSecondHalf },
    { type: "percent", label: "%" },
    { type: "fixed", label: "฿" },
  ];

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: isBest ? activeColors.goodBg + "25" : activeColors.panel,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: isBest ? activeColors.good : activeColors.panelBorder,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      {/* Row 1: Header (Number Badge, Name Input, Best Tag, Duplicate, Remove) */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1, marginRight: 8 }}>
          {/* Index Badge */}
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: isBest ? activeColors.good : activeColors.accent,
              alignItems: "center",
              justifyContent: "center",
              marginRight: 6,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: 11,
                fontWeight: "700",
                color: activeColors.bg,
              }}
            >
              #{index + 1}
            </Text>
          </View>

          {/* Item Name */}
          <TextInput
            value={item.name}
            onChangeText={(text) => onUpdate("name", text)}
            placeholder={t.optionPlaceholder}
            placeholderTextColor={activeColors.inkDim + "80"}
            style={{
              flex: 1,
              fontFamily: fonts.display,
              fontSize: 15,
              fontWeight: "600",
              color: isBest ? activeColors.good : activeColors.ink,
              padding: 0,
              margin: 0,
            }}
          />
        </View>

        {/* Right Header Badges & Actions */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {isBest && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 3,
                backgroundColor: activeColors.good,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 8,
              }}
            >
              <Trophy size={11} color={activeColors.bg} />
              <Text
                style={{
                  fontFamily: fonts.display,
                  fontSize: 10,
                  fontWeight: "700",
                  color: activeColors.bg,
                }}
              >
                {t.bestValueHighlight}
              </Text>
            </View>
          )}

          {/* Duplicate Button */}
          <TouchableOpacity
            onPress={onDuplicate}
            activeOpacity={0.7}
            style={{
              padding: 5,
              borderRadius: 6,
              backgroundColor: activeColors.bg,
              borderWidth: 1,
              borderColor: activeColors.panelBorder,
            }}
          >
            <Copy size={13} color={activeColors.inkDim} />
          </TouchableOpacity>

          {/* Remove Button */}
          {totalCount > 2 && (
            <TouchableOpacity
              onPress={onRemove}
              activeOpacity={0.7}
              style={{
                padding: 5,
                borderRadius: 6,
                backgroundColor: activeColors.bg,
                borderWidth: 1,
                borderColor: activeColors.panelBorder,
              }}
            >
              <Trash2 size={13} color={activeColors.bad} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Row 2: 3-Column Compact Inputs (Price | Qty | Unit Picker Button) */}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 8 }}>
        {/* Price Input */}
        <View style={{ flex: 1.2 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: activeColors.bg,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: activeColors.panelBorder,
              paddingHorizontal: 8,
              height: 38,
            }}
          >
            <Text
              style={{
                fontFamily: fonts.mono,
                fontSize: 14,
                color: activeColors.inkDim,
                marginRight: 4,
              }}
            >
              ฿
            </Text>
            <TextInput
              value={item.price}
              onChangeText={(text) => onUpdate("price", text)}
              placeholder="0.00"
              placeholderTextColor={activeColors.inkDim + "60"}
              keyboardType="decimal-pad"
              style={{
                flex: 1,
                fontFamily: fonts.mono,
                fontSize: 15,
                fontWeight: "600",
                color: activeColors.ink,
                padding: 0,
              }}
            />
          </View>
        </View>

        {/* Quantity Input */}
        <View style={{ flex: 1 }}>
          <View
            style={{
              backgroundColor: activeColors.bg,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: activeColors.panelBorder,
              paddingHorizontal: 8,
              height: 38,
              justifyContent: "center",
            }}
          >
            <TextInput
              value={item.qty}
              onChangeText={(text) => onUpdate("qty", text)}
              placeholder="1"
              placeholderTextColor={activeColors.inkDim + "60"}
              keyboardType="decimal-pad"
              style={{
                fontFamily: fonts.mono,
                fontSize: 15,
                fontWeight: "600",
                color: activeColors.ink,
                padding: 0,
              }}
            />
          </View>
        </View>

        {/* Unit Picker Trigger Button & Quick Sync Button */}
        <View style={{ flex: 1.3, flexDirection: "row", gap: 5 }}>
          <TouchableOpacity
            onPress={() => setIsUnitPickerOpen(true)}
            activeOpacity={0.7}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: activeColors.bg,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: activeColors.panelBorder,
              paddingHorizontal: 7,
              height: 38,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4, flex: 1 }}>
              <Text style={{ fontSize: 13 }}>{unitIcon}</Text>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: fonts.body,
                  fontSize: 13,
                  fontWeight: "600",
                  color: activeColors.ink,
                }}
              >
                {displayUnit}
              </Text>
            </View>
            <ChevronDown size={13} color={activeColors.inkDim} />
          </TouchableOpacity>

          {/* Quick Sync Button with Confirmation Prompt */}
          {onSyncAllUnits && (
            <TouchableOpacity
              onPress={handlePromptSync}
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 3,
                paddingHorizontal: 7,
                height: 38,
                backgroundColor: activeColors.accent + "15",
                borderRadius: 8,
                borderWidth: 1,
                borderColor: activeColors.accent + "50",
              }}
            >
              <RefreshCw size={11} color={activeColors.accent} />
              <Text
                style={{
                  fontFamily: fonts.display,
                  fontSize: 11,
                  fontWeight: "700",
                  color: activeColors.accent,
                }}
              >
                {language === "en" ? "Sync" : "ซิงค์"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Row 3: Live Unit Price Banner & Extra Feature Toggles */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 2,
        }}
      >
        {/* Calculated Unit Price */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {formattedUnitPrice ? (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: isBest ? activeColors.goodBg : activeColors.bg,
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: isBest ? activeColors.good : activeColors.accent + "50",
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.mono,
                  fontSize: 12,
                  fontWeight: "700",
                  color: isBest ? activeColors.good : activeColors.accent,
                }}
              >
                ฿{formattedUnitPrice} / {displayUnit}
              </Text>
            </View>
          ) : (
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: 11,
                color: activeColors.inkDim + "90",
              }}
            >
              {t.priceLabel} & {t.qtyLabel}
            </Text>
          )}

          {computed.discountSummary && (
            <View
              style={{
                backgroundColor: activeColors.accent,
                borderRadius: 4,
                paddingHorizontal: 5,
                paddingVertical: 1,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.display,
                  fontSize: 9,
                  fontWeight: "700",
                  color: activeColors.bg,
                }}
              >
                {computed.discountSummary}
              </Text>
            </View>
          )}
        </View>

        {/* Extra Action Buttons (Pack Mode & Promo Mode) */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {/* Pack Mode Button */}
          <TouchableOpacity
            onPress={() => {
              const nextState = !isPackExpanded;
              setIsPackExpanded(nextState);
              onUpdate("isPack", nextState);
            }}
            activeOpacity={0.7}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 3,
              paddingHorizontal: 6,
              paddingVertical: 3,
              borderRadius: 6,
              backgroundColor: isPackExpanded ? activeColors.accent + "25" : activeColors.bg,
              borderWidth: 1,
              borderColor: isPackExpanded ? activeColors.accent : activeColors.panelBorder,
            }}
          >
            <Package
              size={12}
              color={isPackExpanded ? activeColors.accent : activeColors.inkDim}
            />
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: 10,
                color: isPackExpanded ? activeColors.accent : activeColors.inkDim,
                fontWeight: isPackExpanded ? "700" : "500",
              }}
            >
              {language === "en" ? "Pack" : "แพ็ค"}
            </Text>
          </TouchableOpacity>

          {/* Promo Discount Button */}
          <TouchableOpacity
            onPress={() => {
              const nextState = !isPromoExpanded;
              setIsPromoExpanded(nextState);
              if (!nextState) {
                handleSelectDiscount("none");
              }
            }}
            activeOpacity={0.7}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 3,
              paddingHorizontal: 6,
              paddingVertical: 3,
              borderRadius: 6,
              backgroundColor: isPromoExpanded ? activeColors.warning + "25" : activeColors.bg,
              borderWidth: 1,
              borderColor: isPromoExpanded ? activeColors.warning : activeColors.panelBorder,
            }}
          >
            <Tag
              size={12}
              color={isPromoExpanded ? activeColors.warning : activeColors.inkDim}
            />
            <Text
              style={{
                fontFamily: fonts.body,
                fontSize: 10,
                color: isPromoExpanded ? activeColors.warning : activeColors.inkDim,
                fontWeight: isPromoExpanded ? "700" : "500",
              }}
            >
              {language === "en" ? "Promo" : "ส่วนลด"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Collapsible Section: Pack Count Input (When Pack Mode is active) */}
      {isPackExpanded && (
        <View
          style={{
            marginTop: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: activeColors.panelBorder,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontFamily: fonts.body,
              fontSize: 12,
              color: activeColors.inkDim,
            }}
          >
            {t.packCountLabel}:
          </Text>
          <TextInput
            value={item.packCount}
            onChangeText={(text) => onUpdate("packCount", text)}
            placeholder={t.packCountPlaceholder}
            placeholderTextColor={activeColors.inkDim + "60"}
            keyboardType="number-pad"
            style={{
              width: 70,
              backgroundColor: activeColors.bg,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: activeColors.panelBorder,
              paddingHorizontal: 8,
              paddingVertical: 3,
              fontFamily: fonts.mono,
              fontSize: 13,
              color: activeColors.ink,
              textAlign: "center",
            }}
          />
        </View>
      )}

      {/* Collapsible Section: Promotion / Discount Options (When Promo Mode is active) */}
      {isPromoExpanded && (
        <View
          style={{
            marginTop: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: activeColors.panelBorder,
            gap: 6,
          }}
        >
          {/* Discount Type Chips */}
          <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
            {discountTypes.map((dt) => {
              const isSelected = item.discountType === dt.type;
              return (
                <TouchableOpacity
                  key={dt.type}
                  onPress={() => handleSelectDiscount(dt.type)}
                  activeOpacity={0.7}
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                    backgroundColor: isSelected ? activeColors.warning : activeColors.bg,
                    borderWidth: 1,
                    borderColor: isSelected ? activeColors.warning : activeColors.panelBorder,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: fonts.body,
                      fontSize: 11,
                      fontWeight: isSelected ? "700" : "500",
                      color: isSelected ? activeColors.bg : activeColors.ink,
                    }}
                  >
                    {dt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Discount Value Input (for fixed or percent) */}
          {(item.discountType === "fixed" || item.discountType === "percent") && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 2 }}>
              <TextInput
                value={item.discountValue}
                onChangeText={(text) => onUpdate("discountValue", text)}
                placeholder={
                  item.discountType === "percent"
                    ? language === "en" ? "e.g. 10%" : "เช่น 10%"
                    : language === "en" ? "e.g. 20 THB" : "เช่น 20 บาท"
                }
                placeholderTextColor={activeColors.inkDim + "60"}
                keyboardType="decimal-pad"
                style={{
                  flex: 1,
                  backgroundColor: activeColors.bg,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: activeColors.panelBorder,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  fontFamily: fonts.mono,
                  fontSize: 13,
                  color: activeColors.ink,
                }}
              />
            </View>
          )}
        </View>
      )}

      {/* Unit Picker Modal */}
      <UnitPickerModal
        visible={isUnitPickerOpen}
        onClose={() => setIsUnitPickerOpen(false)}
        selectedUnit={item.unit}
        onSelectUnit={(unit) => onUpdate("unit", unit)}
        onSyncAllUnits={onSyncAllUnits}
        activeColors={activeColors}
        language={language}
      />
    </View>
  );
};
