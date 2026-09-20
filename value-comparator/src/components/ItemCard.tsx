import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { Trash2, Package, Trophy, Copy, Tag, ChevronDown, RefreshCw, Sparkles } from "lucide-react-native";
import { ComparisonItem, DiscountType, LanguageMode, PromoType } from "../types";
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
  const [isCustomBuyGet, setIsCustomBuyGet] = useState(false);
  const [isCustomSecond, setIsCustomSecond] = useState(false);
  const [isPackExpanded, setIsPackExpanded] = useState(!!item.isPack);
  const [isStandardPromoExpanded, setIsStandardPromoExpanded] = useState(
    !!(item.discountType && item.discountType !== "none")
  );

  const promoType: PromoType = item.promoType || "STANDARD";
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

  const handleSelectPromoMode = (mode: PromoType) => {
    onUpdate("promoType", mode);
    if (mode === "BUNDLE_PRICE") {
      if (!item.bundleQty) onUpdate("bundleQty", "2");
    } else if (mode === "BUY_X_GET_Y") {
      if (!item.buyQty) onUpdate("buyQty", "2");
      if (!item.freeQty) onUpdate("freeQty", "1");
    } else if (mode === "SECOND_ITEM_DISCOUNT") {
      if (!item.secondDiscountType) onUpdate("secondDiscountType", "FIXED_PRICE");
      if (!item.secondDiscountValue) onUpdate("secondDiscountValue", "1");
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

  const promoTabs: { type: PromoType; labelTH: string; labelEN: string }[] = [
    { type: "STANDARD", labelTH: "ปกติ", labelEN: "Standard" },
    { type: "BUNDLE_PRICE", labelTH: "2 ชิ้น X บ.", labelEN: "Bundle" },
    { type: "BUY_X_GET_Y", labelTH: "ซื้อ X แถม Y", labelEN: "Buy X Get Y" },
    { type: "SECOND_ITEM_DISCOUNT", labelTH: "ชิ้นที่ 2", labelEN: "2nd Item" },
  ];

  const standardDiscountTypes: { type: DiscountType; label: string }[] = [
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

      {/* Row 2: Promotion Mode Chips Selector */}
      <View
        style={{
          flexDirection: "row",
          gap: 5,
          marginBottom: 9,
          backgroundColor: activeColors.bg + "80",
          borderRadius: 8,
          padding: 3,
          borderWidth: 1,
          borderColor: activeColors.panelBorder + "50",
        }}
      >
        {promoTabs.map((tab) => {
          const isActive = promoType === tab.type;
          return (
            <TouchableOpacity
              key={tab.type}
              onPress={() => handleSelectPromoMode(tab.type)}
              activeOpacity={0.7}
              style={{
                flex: 1,
                paddingVertical: 4,
                borderRadius: 6,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isActive ? activeColors.good : "transparent",
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: fonts.display,
                  fontSize: 10.5,
                  fontWeight: isActive ? "700" : "500",
                  color: isActive ? activeColors.bg : activeColors.inkDim,
                }}
              >
                {language === "en" ? tab.labelEN : tab.labelTH}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Row 3: Dynamic Inputs based on PromoType */}

      {/* CASE 1: STANDARD MODE */}
      {promoType === "STANDARD" && (
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

          {/* Unit Picker Button & Quick Sync Button */}
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
      )}

      {/* CASE 2: BUNDLE_PRICE MODE (e.g. 2 items for 35 THB) */}
      {promoType === "BUNDLE_PRICE" && (
        <View style={{ gap: 8, marginBottom: 8 }}>
          {/* Row A: ซื้อ [ 2 ] ชิ้น ในราคา [ 35 ] บาท */}
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.body, fontSize: 11, color: activeColors.inkDim, marginBottom: 3 }}>
                {language === "en" ? "Buy Pieces" : "จำนวนที่ต้องซื้อ (ชิ้น)"}
              </Text>
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
                  value={item.bundleQty || "2"}
                  onChangeText={(text) => onUpdate("bundleQty", text)}
                  placeholder="2"
                  placeholderTextColor={activeColors.inkDim + "60"}
                  keyboardType="number-pad"
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

            <View style={{ flex: 1.3 }}>
              <Text style={{ fontFamily: fonts.body, fontSize: 11, color: activeColors.inkDim, marginBottom: 3 }}>
                {language === "en" ? "Bundle Price" : "ราคารวมโปรโมชั่น (บ.)"}
              </Text>
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
                <Text style={{ fontFamily: fonts.mono, fontSize: 14, color: activeColors.inkDim, marginRight: 4 }}>
                  ฿
                </Text>
                <TextInput
                  value={item.bundlePrice || item.price}
                  onChangeText={(text) => {
                    onUpdate("bundlePrice", text);
                    onUpdate("price", text);
                  }}
                  placeholder="0.00"
                  placeholderTextColor={activeColors.inkDim + "60"}
                  keyboardType="decimal-pad"
                  style={{
                    flex: 1,
                    fontFamily: fonts.mono,
                    fontSize: 15,
                    fontWeight: "600",
                    color: activeColors.good,
                    padding: 0,
                  }}
                />
              </View>
            </View>
          </View>

          {/* Row B: ปริมาณต่อ 1 ชิ้น & Unit */}
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: fonts.body, fontSize: 11, color: activeColors.inkDim, marginBottom: 3 }}>
                {language === "en" ? "Per Piece Qty" : "ปริมาณต่อ 1 ชิ้น"}
              </Text>
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
                  placeholder="62"
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

            <View style={{ flex: 1.3 }}>
              <Text style={{ fontFamily: fonts.body, fontSize: 11, color: activeColors.inkDim, marginBottom: 3 }}>
                {language === "en" ? "Unit" : "หน่วย"}
              </Text>
              <View style={{ flexDirection: "row", gap: 5 }}>
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
          </View>
        </View>
      )}

      {/* CASE 3: BUY_X_GET_Y MODE (e.g. Buy 2 Get 1 Free, 32 THB each) */}
      {promoType === "BUY_X_GET_Y" && (
        <View style={{ gap: 8, marginBottom: 8 }}>
          {/* Row A: ราคาปกติชิ้นละ */}
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <View style={{ flex: 1.2 }}>
              <Text style={{ fontFamily: fonts.body, fontSize: 11, color: activeColors.inkDim, marginBottom: 3 }}>
                {language === "en" ? "Price per piece" : "ราคาปกติชิ้นละ (บ.)"}
              </Text>
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
                <Text style={{ fontFamily: fonts.mono, fontSize: 14, color: activeColors.inkDim, marginRight: 4 }}>
                  ฿
                </Text>
                <TextInput
                  value={item.price}
                  onChangeText={(text) => onUpdate("price", text)}
                  placeholder="32.00"
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

            {/* Quantity per piece & Unit */}
            <View style={{ flex: 1.3 }}>
              <Text style={{ fontFamily: fonts.body, fontSize: 11, color: activeColors.inkDim, marginBottom: 3 }}>
                {language === "en" ? "Per Piece Qty" : "ปริมาณต่อ 1 ชิ้น"}
              </Text>
              <View style={{ flexDirection: "row", gap: 5 }}>
                <View
                  style={{
                    flex: 1,
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
                    placeholder="69"
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

                <TouchableOpacity
                  onPress={() => setIsUnitPickerOpen(true)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 3,
                    backgroundColor: activeColors.bg,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: activeColors.panelBorder,
                    paddingHorizontal: 7,
                    height: 38,
                  }}
                >
                  <Text style={{ fontSize: 13 }}>{unitIcon}</Text>
                  <Text
                    style={{
                      fontFamily: fonts.body,
                      fontSize: 12,
                      fontWeight: "600",
                      color: activeColors.ink,
                    }}
                  >
                    {displayUnit}
                  </Text>
                  <ChevronDown size={11} color={activeColors.inkDim} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Row B: Quick Preset Pills [ 1 แถม 1 ] [ 2 แถม 1 ] [ กำหนดเอง ] */}
          <View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              {/* Preset: 1 แถม 1 */}
              <TouchableOpacity
                onPress={() => {
                  setIsCustomBuyGet(false);
                  onUpdate("buyQty", "1");
                  onUpdate("freeQty", "1");
                }}
                activeOpacity={0.7}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 8,
                  backgroundColor:
                    !isCustomBuyGet && item.buyQty === "1" && item.freeQty === "1"
                      ? activeColors.good
                      : activeColors.bg,
                  borderWidth: 1,
                  borderColor:
                    !isCustomBuyGet && item.buyQty === "1" && item.freeQty === "1"
                      ? activeColors.good
                      : activeColors.panelBorder,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 11,
                    fontWeight: "700",
                    color:
                      !isCustomBuyGet && item.buyQty === "1" && item.freeQty === "1"
                        ? activeColors.bg
                        : activeColors.ink,
                  }}
                >
                  1 แถม 1
                </Text>
              </TouchableOpacity>

              {/* Preset: 2 แถม 1 */}
              <TouchableOpacity
                onPress={() => {
                  setIsCustomBuyGet(false);
                  onUpdate("buyQty", "2");
                  onUpdate("freeQty", "1");
                }}
                activeOpacity={0.7}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 8,
                  backgroundColor:
                    !isCustomBuyGet && item.buyQty === "2" && item.freeQty === "1"
                      ? activeColors.good
                      : activeColors.bg,
                  borderWidth: 1,
                  borderColor:
                    !isCustomBuyGet && item.buyQty === "2" && item.freeQty === "1"
                      ? activeColors.good
                      : activeColors.panelBorder,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 11,
                    fontWeight: "700",
                    color:
                      !isCustomBuyGet && item.buyQty === "2" && item.freeQty === "1"
                        ? activeColors.bg
                        : activeColors.ink,
                  }}
                >
                  2 แถม 1
                </Text>
              </TouchableOpacity>

              {/* Custom Toggle */}
              <TouchableOpacity
                onPress={() => setIsCustomBuyGet(!isCustomBuyGet)}
                activeOpacity={0.7}
                style={{
                  paddingHorizontal: 9,
                  paddingVertical: 5,
                  borderRadius: 8,
                  backgroundColor: isCustomBuyGet ? activeColors.accent : activeColors.bg,
                  borderWidth: 1,
                  borderColor: isCustomBuyGet ? activeColors.accent : activeColors.panelBorder,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 11,
                    fontWeight: isCustomBuyGet ? "700" : "500",
                    color: isCustomBuyGet ? activeColors.bg : activeColors.inkDim,
                  }}
                >
                  {language === "en" ? "Custom" : "กำหนดเอง"}
                </Text>
              </TouchableOpacity>

              {/* Helper text */}
              {!isCustomBuyGet && (
                <Text
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 11,
                    color: activeColors.inkDim,
                    marginLeft: 2,
                  }}
                >
                  (จ่าย {item.buyQty || "2"} ได้รับ {(parseInt(item.buyQty || "2") || 0) + (parseInt(item.freeQty || "1") || 0)} ชิ้น)
                </Text>
              )}
            </View>

            {/* Custom Inputs if enabled */}
            {isCustomBuyGet && (
              <View style={{ flexDirection: "row", gap: 8, alignItems: "center", marginTop: 6 }}>
                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Text style={{ fontFamily: fonts.body, fontSize: 11, color: activeColors.inkDim }}>
                    ซื้อ:
                  </Text>
                  <TextInput
                    value={item.buyQty || "2"}
                    onChangeText={(text) => onUpdate("buyQty", text)}
                    placeholder="2"
                    placeholderTextColor={activeColors.inkDim + "60"}
                    keyboardType="number-pad"
                    style={{
                      flex: 1,
                      backgroundColor: activeColors.bg,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: activeColors.panelBorder,
                      paddingHorizontal: 6,
                      paddingVertical: 3,
                      fontFamily: fonts.mono,
                      fontSize: 13,
                      color: activeColors.ink,
                      textAlign: "center",
                    }}
                  />
                </View>

                <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Text style={{ fontFamily: fonts.body, fontSize: 11, color: activeColors.inkDim }}>
                    แถมฟรี:
                  </Text>
                  <TextInput
                    value={item.freeQty || "1"}
                    onChangeText={(text) => onUpdate("freeQty", text)}
                    placeholder="1"
                    placeholderTextColor={activeColors.inkDim + "60"}
                    keyboardType="number-pad"
                    style={{
                      flex: 1,
                      backgroundColor: activeColors.bg,
                      borderRadius: 6,
                      borderWidth: 1,
                      borderColor: activeColors.panelBorder,
                      paddingHorizontal: 6,
                      paddingVertical: 3,
                      fontFamily: fonts.mono,
                      fontSize: 13,
                      color: activeColors.good,
                      textAlign: "center",
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      )}

      {/* CASE 4: SECOND_ITEM_DISCOUNT MODE (e.g. 2nd item 1 THB or 50% off) */}
      {promoType === "SECOND_ITEM_DISCOUNT" && (
        <View style={{ gap: 8, marginBottom: 8 }}>
          {/* Row A: ราคาชิ้นแรก & ปริมาณต่อชิ้น */}
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <View style={{ flex: 1.2 }}>
              <Text style={{ fontFamily: fonts.body, fontSize: 11, color: activeColors.inkDim, marginBottom: 3 }}>
                {language === "en" ? "1st Item Price" : "ราคาชิ้นแรก (บ.)"}
              </Text>
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
                <Text style={{ fontFamily: fonts.mono, fontSize: 14, color: activeColors.inkDim, marginRight: 4 }}>
                  ฿
                </Text>
                <TextInput
                  value={item.price}
                  onChangeText={(text) => onUpdate("price", text)}
                  placeholder="100.00"
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

            {/* Quantity per piece & Unit */}
            <View style={{ flex: 1.3 }}>
              <Text style={{ fontFamily: fonts.body, fontSize: 11, color: activeColors.inkDim, marginBottom: 3 }}>
                {language === "en" ? "Per Piece Qty" : "ปริมาณต่อ 1 ชิ้น"}
              </Text>
              <View style={{ flexDirection: "row", gap: 5 }}>
                <View
                  style={{
                    flex: 1,
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
                    placeholder="100"
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

                <TouchableOpacity
                  onPress={() => setIsUnitPickerOpen(true)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 3,
                    backgroundColor: activeColors.bg,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: activeColors.panelBorder,
                    paddingHorizontal: 7,
                    height: 38,
                  }}
                >
                  <Text style={{ fontSize: 13 }}>{unitIcon}</Text>
                  <Text
                    style={{
                      fontFamily: fonts.body,
                      fontSize: 12,
                      fontWeight: "600",
                      color: activeColors.ink,
                    }}
                  >
                    {displayUnit}
                  </Text>
                  <ChevronDown size={11} color={activeColors.inkDim} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Row B: 2nd Item Discount Options */}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            {/* Quick pill: ชิ้นที่ 2 จ่าย 1 บาท */}
            <TouchableOpacity
              onPress={() => {
                setIsCustomSecond(false);
                onUpdate("secondDiscountType", "FIXED_PRICE");
                onUpdate("secondDiscountValue", "1");
              }}
              activeOpacity={0.7}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 8,
                backgroundColor:
                  !isCustomSecond && item.secondDiscountType === "FIXED_PRICE" && item.secondDiscountValue === "1"
                    ? activeColors.good
                    : activeColors.bg,
                borderWidth: 1,
                borderColor:
                  !isCustomSecond && item.secondDiscountType === "FIXED_PRICE" && item.secondDiscountValue === "1"
                    ? activeColors.good
                    : activeColors.panelBorder,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.display,
                  fontSize: 11,
                  fontWeight: "700",
                  color:
                    !isCustomSecond && item.secondDiscountType === "FIXED_PRICE" && item.secondDiscountValue === "1"
                      ? activeColors.bg
                      : activeColors.ink,
                }}
              >
                ชิ้นที่ 2 จ่าย 1 บ.
              </Text>
            </TouchableOpacity>

            {/* Quick pill: ชิ้นที่ 2 ลด 50% */}
            <TouchableOpacity
              onPress={() => {
                setIsCustomSecond(false);
                onUpdate("secondDiscountType", "PERCENT");
                onUpdate("secondDiscountValue", "50");
              }}
              activeOpacity={0.7}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 8,
                backgroundColor:
                  !isCustomSecond && item.secondDiscountType === "PERCENT" && item.secondDiscountValue === "50"
                    ? activeColors.good
                    : activeColors.bg,
                borderWidth: 1,
                borderColor:
                  !isCustomSecond && item.secondDiscountType === "PERCENT" && item.secondDiscountValue === "50"
                    ? activeColors.good
                    : activeColors.panelBorder,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.display,
                  fontSize: 11,
                  fontWeight: "700",
                  color:
                    !isCustomSecond && item.secondDiscountType === "PERCENT" && item.secondDiscountValue === "50"
                      ? activeColors.bg
                      : activeColors.ink,
                }}
              >
                ชิ้นที่ 2 ลด 50%
              </Text>
            </TouchableOpacity>

            {/* Custom pill */}
            <TouchableOpacity
              onPress={() => setIsCustomSecond(!isCustomSecond)}
              activeOpacity={0.7}
              style={{
                paddingHorizontal: 9,
                paddingVertical: 5,
                borderRadius: 8,
                backgroundColor: isCustomSecond ? activeColors.accent : activeColors.bg,
                borderWidth: 1,
                borderColor: isCustomSecond ? activeColors.accent : activeColors.panelBorder,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.body,
                  fontSize: 11,
                  fontWeight: isCustomSecond ? "700" : "500",
                  color: isCustomSecond ? activeColors.bg : activeColors.inkDim,
                }}
              >
                {language === "en" ? "Custom" : "กำหนดเอง"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Custom Discount Input */}
          {isCustomSecond && (
            <View style={{ flexDirection: "row", gap: 8, alignItems: "center", marginTop: 4 }}>
              <Text style={{ fontFamily: fonts.body, fontSize: 11, color: activeColors.inkDim }}>
                ชิ้นที่สอง:
              </Text>
              <TextInput
                value={item.secondDiscountValue || "1"}
                onChangeText={(text) => onUpdate("secondDiscountValue", text)}
                placeholder="1"
                placeholderTextColor={activeColors.inkDim + "60"}
                keyboardType="decimal-pad"
                style={{
                  width: 70,
                  backgroundColor: activeColors.bg,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: activeColors.panelBorder,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  fontFamily: fonts.mono,
                  fontSize: 13,
                  color: activeColors.ink,
                  textAlign: "center",
                }}
              />
              {/* Toggle FIXED / PERCENT */}
              <TouchableOpacity
                onPress={() => {
                  const nextType = item.secondDiscountType === "PERCENT" ? "FIXED_PRICE" : "PERCENT";
                  onUpdate("secondDiscountType", nextType);
                }}
                activeOpacity={0.7}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 6,
                  backgroundColor: activeColors.panelBorder,
                }}
              >
                <Text style={{ fontFamily: fonts.display, fontSize: 11, fontWeight: "700", color: activeColors.ink }}>
                  {item.secondDiscountType === "PERCENT" ? "ลด %" : "จ่าย (บาท)"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Row 4: Live Unit Price Banner & Summary / Toggles */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 2,
        }}
      >
        {/* Calculated Unit Price */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flex: 1, marginRight: 6 }}>
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

          {/* Promo Summary Tag */}
          {computed.promoSummary && (
            <View
              style={{
                backgroundColor: activeColors.good,
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
                {computed.promoSummary}
              </Text>
            </View>
          )}
        </View>

        {/* Extra Features (Only in Standard mode: Pack & Standard discount) */}
        {promoType === "STANDARD" && (
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
              <Package size={12} color={isPackExpanded ? activeColors.accent : activeColors.inkDim} />
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
                const nextState = !isStandardPromoExpanded;
                setIsStandardPromoExpanded(nextState);
                if (!nextState) {
                  onUpdate("discountType", "none");
                  onUpdate("discountValue", "");
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
                backgroundColor: isStandardPromoExpanded ? activeColors.warning + "25" : activeColors.bg,
                borderWidth: 1,
                borderColor: isStandardPromoExpanded ? activeColors.warning : activeColors.panelBorder,
              }}
            >
              <Tag size={12} color={isStandardPromoExpanded ? activeColors.warning : activeColors.inkDim} />
              <Text
                style={{
                  fontFamily: fonts.body,
                  fontSize: 10,
                  color: isStandardPromoExpanded ? activeColors.warning : activeColors.inkDim,
                  fontWeight: isStandardPromoExpanded ? "700" : "500",
                }}
              >
                {language === "en" ? "Promo" : "ส่วนลด"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Real-time Breakdown Hint for Promos */}
      {promoType !== "STANDARD" && computed.valid && computed.totalPayPrice !== null && (
        <View
          style={{
            marginTop: 6,
            paddingTop: 6,
            borderTopWidth: 1,
            borderTopColor: activeColors.panelBorder + "40",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontFamily: fonts.body, fontSize: 11, color: activeColors.inkDim }}>
            จ่ายจริง ฿{computed.totalPayPrice?.toFixed(2)} ได้ {computed.totalPieces} ชิ้น (
            {computed.totalVolume} {displayUnit})
          </Text>
          {computed.effectivePricePerPiece && (
            <Text style={{ fontFamily: fonts.display, fontSize: 11, color: activeColors.accent, fontWeight: "600" }}>
              เฉลี่ย ฿{computed.effectivePricePerPiece.toFixed(2)}/ชิ้น
            </Text>
          )}
        </View>
      )}

      {/* Standard Mode: Pack count input */}
      {promoType === "STANDARD" && isPackExpanded && (
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
          <Text style={{ fontFamily: fonts.body, fontSize: 12, color: activeColors.inkDim }}>
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

      {/* Standard Mode: Discount options */}
      {promoType === "STANDARD" && isStandardPromoExpanded && (
        <View
          style={{
            marginTop: 8,
            paddingTop: 8,
            borderTopWidth: 1,
            borderTopColor: activeColors.panelBorder,
            gap: 6,
          }}
        >
          <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
            {standardDiscountTypes.map((dt) => {
              const isSelected = item.discountType === dt.type;
              return (
                <TouchableOpacity
                  key={dt.type}
                  onPress={() => {
                    onUpdate("discountType", dt.type);
                    if (dt.type === "none") onUpdate("discountValue", "");
                  }}
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
