import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  Image,
} from "react-native";
import { RotateCcw, Scale, Settings, AlertTriangle } from "lucide-react-native";
import { useComparatorStore } from "../src/store/comparatorStore";
import { rankItems, checkUnitsCompatibility } from "../src/utils/calculations";
import { getAppColors } from "../src/theme/colors";
import { fonts } from "../src/theme/typography";
import { getTranslation } from "../src/constants/translations";
import { ItemCard } from "../src/components/ItemCard";
import { AddItemCard } from "../src/components/AddItemCard";
import { BestValueCallout } from "../src/components/BestValueCallout";
import { ResultReceipt } from "../src/components/ResultReceipt";
import { SettingsModal } from "../src/components/SettingsModal";

export default function ComparatorScreen() {
  const systemColorScheme = useColorScheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    items,
    language,
    theme,
    addItem,
    duplicateItem,
    updateItem,
    removeItem,
    resetItems,
    syncAllUnits,
    setLanguage,
    setTheme,
  } = useComparatorStore();

  const activeColors = getAppColors(theme, systemColorScheme);
  const t = getTranslation(language);

  const rankedItems = rankItems(items, language);
  const bestItem = rankedItems.length > 0 ? rankedItems[0] : null;
  const { isCompatible } = checkUnitsCompatibility(items);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: activeColors.bg }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: Platform.OS === "android" ? 28 : 12,
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Hero Section */}
          <View
            style={{
              marginBottom: 14,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1, marginRight: 8 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 9,
                    overflow: "hidden",
                    backgroundColor: "#071B34",
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: activeColors.panelBorder,
                  }}
                >
                  <Image
                    source={require("../assets/logo.png")}
                    style={{ width: 36, height: 36 }}
                    resizeMode="cover"
                  />
                </View>
                <Text
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 22,
                    fontWeight: "700",
                    color: activeColors.ink,
                    letterSpacing: 0.3,
                  }}
                >
                  {t.appTitle}
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: fonts.body,
                  fontSize: 12,
                  color: activeColors.inkDim,
                  marginTop: 2,
                }}
              >
                {t.appSubtitle}
              </Text>
            </View>

            {/* Header Action Buttons (Settings & Reset) */}
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              {/* Settings Button */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsSettingsOpen(true)}
                style={{
                  width: 32,
                  height: 32,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: activeColors.panel,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: activeColors.panelBorder,
                }}
              >
                <Settings size={15} color={activeColors.inkDim} />
              </TouchableOpacity>

              {/* Reset Button */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={resetItems}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  backgroundColor: activeColors.panel,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: activeColors.panelBorder,
                }}
              >
                <RotateCcw size={13} color={activeColors.inkDim} />
                <Text
                  style={{
                    fontFamily: fonts.body,
                    fontSize: 11,
                    color: activeColors.inkDim,
                  }}
                >
                  {t.clearData}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Incompatible Unit Category Warning Banner */}
          {!isCompatible && (
            <View
              style={{
                marginBottom: 16,
                backgroundColor: activeColors.warningBg,
                borderColor: activeColors.warning,
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 10,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <AlertTriangle size={18} color={activeColors.warning} />
              <Text
                style={{
                  flex: 1,
                  fontFamily: fonts.body,
                  fontSize: 13,
                  color: activeColors.warning,
                  lineHeight: 18,
                }}
              >
                {t.incompatibleUnitsWarning}
              </Text>
            </View>
          )}

          {/* Item Input Cards List */}
          <View style={{ marginBottom: 8 }}>
            {items.map((item, index) => (
              <ItemCard
                key={item.id}
                item={item}
                index={index}
                totalCount={items.length}
                onUpdate={(field, value) => updateItem(item.id, field, value)}
                onDuplicate={() => duplicateItem(item.id)}
                onRemove={() => removeItem(item.id)}
                onSyncAllUnits={(unit) => syncAllUnits(unit)}
                activeColors={activeColors}
                language={language}
                isBest={bestItem !== null && item.id === bestItem.id && rankedItems.length > 0}
              />
            ))}
          </View>

          {/* Add Item Button */}
          <AddItemCard
            onAdd={addItem}
            activeColors={activeColors}
            language={language}
          />

          {/* 2-Tier Results Section */}
          {bestItem && (
            <BestValueCallout
              bestItem={bestItem}
              totalCompared={rankedItems.length}
              activeColors={activeColors}
              language={language}
            />
          )}

          <ResultReceipt
            rankedItems={rankedItems}
            language={language}
            activeColors={activeColors}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Settings Modal */}
      <SettingsModal
        visible={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        language={language}
        theme={theme}
        onSelectLanguage={setLanguage}
        onSelectTheme={setTheme}
        systemColorScheme={systemColorScheme}
      />
    </SafeAreaView>
  );
}
