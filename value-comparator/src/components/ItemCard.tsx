import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Trash2 } from "lucide-react-native";
import { ComparisonItem } from "../types";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { UNIT_PRESETS } from "../constants/units";
import { UnitChip } from "./UnitChip";

interface ItemCardProps {
  item: ComparisonItem;
  index: number;
  totalCount: number;
  onUpdate: (field: keyof ComparisonItem, value: string) => void;
  onRemove: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  index,
  totalCount,
  onUpdate,
  onRemove,
}) => {
  return (
    <View
      style={{
        width: "100%",
        backgroundColor: colors.panel,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: colors.panelBorder,
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
              backgroundColor: colors.accent,
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
                color: colors.paperInk,
              }}
            >
              #{index + 1}
            </Text>
          </View>

          {/* Name Input */}
          <TextInput
            value={item.name}
            onChangeText={(text) => onUpdate("name", text)}
            placeholder="ระบุชื่อตัวเลือก..."
            placeholderTextColor={colors.inkDim + "80"}
            style={{
              flex: 1,
              fontFamily: fonts.display,
              fontSize: 18,
              color: colors.accent,
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
              backgroundColor: colors.bg,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: colors.panelBorder,
            }}
          >
            <Trash2 size={16} color={colors.bad} />
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
              color: colors.inkDim,
              textTransform: "lowercase",
              marginBottom: 4,
            }}
          >
            ราคา (บาท)
          </Text>
          <View
            style={{
              backgroundColor: colors.bg,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.panelBorder,
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
                color: colors.inkDim,
                marginRight: 6,
              }}
            >
              ฿
            </Text>
            <TextInput
              value={item.price}
              onChangeText={(text) => onUpdate("price", text)}
              placeholder="0.00"
              placeholderTextColor={colors.inkDim + "60"}
              keyboardType="numeric"
              style={{
                flex: 1,
                fontFamily: fonts.mono,
                fontSize: 18,
                color: colors.ink,
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
              color: colors.inkDim,
              textTransform: "lowercase",
              marginBottom: 4,
            }}
          >
            ปริมาณ / จำนวน
          </Text>
          <View
            style={{
              backgroundColor: colors.bg,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.panelBorder,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <TextInput
              value={item.qty}
              onChangeText={(text) => onUpdate("qty", text)}
              placeholder="1"
              placeholderTextColor={colors.inkDim + "60"}
              keyboardType="numeric"
              style={{
                fontFamily: fonts.mono,
                fontSize: 18,
                color: colors.ink,
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
            color: colors.inkDim,
            textTransform: "lowercase",
            marginBottom: 6,
          }}
        >
          หน่วย (เช่น ชิ้น, กรัม, มล.)
        </Text>

        <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 6 }}>
          {UNIT_PRESETS.map((preset) => (
            <UnitChip
              key={preset}
              label={preset}
              isSelected={item.unit === preset}
              onSelect={() => onUpdate("unit", preset)}
            />
          ))}
        </View>

        <TextInput
          value={item.unit}
          onChangeText={(text) => onUpdate("unit", text)}
          placeholder="หรือระบุหน่วยเอง..."
          placeholderTextColor={colors.inkDim + "60"}
          style={{
            backgroundColor: colors.bg,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.panelBorder,
            paddingHorizontal: 10,
            paddingVertical: 6,
            fontFamily: fonts.body,
            fontSize: 14,
            color: colors.ink,
          }}
        />
      </View>
    </View>
  );
};
