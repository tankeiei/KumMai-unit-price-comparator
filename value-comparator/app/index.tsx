import React from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RotateCcw, Scale } from "lucide-react-native";
import { useComparatorStore } from "../src/store/comparatorStore";
import { rankItems } from "../src/utils/calculations";
import { colors } from "../src/theme/colors";
import { fonts } from "../src/theme/typography";
import { ItemCard } from "../src/components/ItemCard";
import { AddItemCard } from "../src/components/AddItemCard";
import { BestValueCallout } from "../src/components/BestValueCallout";
import { ResultReceipt } from "../src/components/ResultReceipt";

export default function ComparatorScreen() {
  const { items, addItem, updateItem, removeItem, resetItems } =
    useComparatorStore();

  const rankedItems = rankItems(items);
  const bestItem = rankedItems.length > 0 ? rankedItems[0] : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: Platform.OS === "android" ? 40 : 16,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Hero Section */}
          <View
            style={{
              marginBottom: 24,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Scale size={28} color={colors.accent} />
                <Text
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 28,
                    color: colors.ink,
                    letterSpacing: 0.5,
                  }}
                >
                  คุ้มไหม?
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: fonts.body,
                  fontSize: 14,
                  color: colors.inkDim,
                  marginTop: 4,
                }}
              >
                เปรียบเทียบราคาต่อหน่วย คุ้มสุดจัดอันดับให้ทันที
              </Text>
            </View>

            {/* Reset Button */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={resetItems}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                backgroundColor: colors.panel,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: colors.panelBorder,
                marginTop: 4,
              }}
            >
              <RotateCcw size={14} color={colors.inkDim} />
              <Text
                style={{
                  fontFamily: fonts.body,
                  fontSize: 12,
                  color: colors.inkDim,
                }}
              >
                ล้างข้อมูล
              </Text>
            </TouchableOpacity>
          </View>

          {/* Item Input Cards List */}
          <View style={{ marginBottom: 8 }}>
            {items.map((item, index) => (
              <ItemCard
                key={item.id}
                item={item}
                index={index}
                totalCount={items.length}
                onUpdate={(field, value) => updateItem(item.id, field, value)}
                onRemove={() => removeItem(item.id)}
              />
            ))}
          </View>

          {/* Add Item Button */}
          <AddItemCard onAdd={addItem} />

          {/* 2-Tier Results Section */}
          {bestItem && (
            <BestValueCallout
              bestItem={bestItem}
              totalCompared={rankedItems.length}
            />
          )}

          <ResultReceipt rankedItems={rankedItems} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
