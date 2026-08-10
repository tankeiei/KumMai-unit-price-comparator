import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Trash2 } from "lucide-react-native";
import { ComparisonItem, LanguageMode } from "../types";
import { AppColors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { getTranslation } from "../constants/translations";
import { UnitChip } from "./UnitChip";

interface ItemCardProps {
  item: ComparisonItem;
  index: number;
  totalCount: number;
  onUpdate: (field: keyof ComparisonItem, value: string) => void;
  onRemove: () => void;
  activeColors: AppColors;
  language: LanguageMode;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  index,
  totalCount,
  onUpdate,
  onRemove,
  activeColors,
  language,
}) => {
  const t = getTranslation(language);

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: activeColors.panel,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: activeColors.panelBorder,
        padding: 16,
        marginBottom: 16,
      }}
    >
      {/* Header Row: Circular Number Badge, Name Input, & Delete Button */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1, marginRight: 10 }}>
          {/* Top-Left Circular Number Badge */}
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: activeColors.accent,
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
              color: activeColors.accent,
              padding: 0,
              margin: 0,
            }}
          />
        </View>

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

      {/* 2-Column Grid Inputs: Price & Quantity */}
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

        {/* Quantity Input Column */}
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
            {t.qtyLabel}
          </Text>
          <View
            style={{
              backgroundColor: activeColors.bg,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: activeColors.panelBorder,
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

      {/* Unit Selection Row & Custom Input */}
      <View>
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

        <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 6 }}>
          {t.unitPresets.map((preset) => (
            <UnitChip
              key={preset}
              label={preset}
              isSelected={item.unit === preset}
              onSelect={() => onUpdate("unit", preset)}
              activeColors={activeColors}
            />
          ))}
        </View>

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
    </View>
  );
};
