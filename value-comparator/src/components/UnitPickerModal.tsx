import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { X, Check, RefreshCw } from "lucide-react-native";
import { AppColors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { LanguageMode } from "../types";
import { UNIT_DEFINITIONS, UnitCategory } from "../constants/units";

interface UnitPickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedUnit: string;
  onSelectUnit: (unit: string) => void;
  onSyncAllUnits?: (unit: string) => void;
  activeColors: AppColors;
  language: LanguageMode;
}

export const UnitPickerModal: React.FC<UnitPickerModalProps> = ({
  visible,
  onClose,
  selectedUnit,
  onSelectUnit,
  onSyncAllUnits,
  activeColors,
  language,
}) => {
  const [activeCategory, setActiveCategory] = useState<"all" | "liquid" | "weight" | "count">("all");
  const [customText, setCustomText] = useState("");

  const categories: { key: "all" | "liquid" | "weight" | "count"; label: string; icon: string }[] = [
    { key: "all", label: language === "en" ? "All" : "ทั้งหมด", icon: "✨" },
    { key: "liquid", label: language === "en" ? "Liquid" : "ของเหลว", icon: "💧" },
    { key: "weight", label: language === "en" ? "Weight" : "ของแข็ง/น้ำหนัก", icon: "⚖️" },
    { key: "count", label: language === "en" ? "Count" : "นับชิ้น", icon: "🏷️" },
  ];

  const filteredUnits = UNIT_DEFINITIONS.filter(
    (def) => activeCategory === "all" || def.category === activeCategory
  );

  const handlePick = (unitLabel: string) => {
    onSelectUnit(unitLabel);
    onClose();
  };

  const handleCustomSubmit = () => {
    if (customText.trim()) {
      onSelectUnit(customText.trim());
      setCustomText("");
      onClose();
    }
  };

  const handleSyncAll = (unitLabel: string) => {
    if (onSyncAllUnits) {
      onSyncAllUnits(unitLabel);
    } else {
      onSelectUnit(unitLabel);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            justifyContent: "flex-end",
          }}
        >
          <TouchableWithoutFeedback>
            <View
              style={{
                backgroundColor: activeColors.panel,
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                borderWidth: 1,
                borderColor: activeColors.panelBorder,
                paddingHorizontal: 20,
                paddingTop: 18,
                paddingBottom: 32,
                maxHeight: "85%",
              }}
            >
              {/* Header */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 14,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 18,
                    fontWeight: "700",
                    color: activeColors.ink,
                  }}
                >
                  {language === "en" ? "Select Unit" : "เลือกหน่วยสินค้า"}
                </Text>
                <TouchableOpacity
                  onPress={onClose}
                  activeOpacity={0.7}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: activeColors.bg,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor: activeColors.panelBorder,
                  }}
                >
                  <X size={18} color={activeColors.inkDim} />
                </TouchableOpacity>
              </View>

              {/* Category Filter Tabs */}
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  marginBottom: 14,
                  flexWrap: "wrap",
                }}
              >
                {categories.map((cat) => {
                  const isCatSelected = activeCategory === cat.key;
                  return (
                    <TouchableOpacity
                      key={cat.key}
                      onPress={() => setActiveCategory(cat.key)}
                      activeOpacity={0.7}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        paddingHorizontal: 12,
                        paddingVertical: 7,
                        borderRadius: 20,
                        backgroundColor: isCatSelected ? activeColors.accent : activeColors.bg,
                        borderWidth: 1,
                        borderColor: isCatSelected ? activeColors.accent : activeColors.panelBorder,
                      }}
                    >
                      <Text style={{ fontSize: 13 }}>{cat.icon}</Text>
                      <Text
                        style={{
                          fontFamily: fonts.body,
                          fontSize: 13,
                          fontWeight: isCatSelected ? "700" : "500",
                          color: isCatSelected ? activeColors.bg : activeColors.ink,
                        }}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Units Grid */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ maxHeight: 220, marginBottom: 14 }}
                contentContainerStyle={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {filteredUnits.map((def) => {
                  const label = language === "en" ? def.labelEn : def.labelTh;
                  const isSelected =
                    selectedUnit === label ||
                    selectedUnit === def.labelTh ||
                    selectedUnit === def.labelEn;

                  return (
                    <TouchableOpacity
                      key={def.id}
                      onPress={() => handlePick(label)}
                      activeOpacity={0.7}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        paddingHorizontal: 14,
                        paddingVertical: 9,
                        borderRadius: 12,
                        backgroundColor: isSelected
                          ? activeColors.goodBg
                          : activeColors.bg,
                        borderWidth: 1.5,
                        borderColor: isSelected
                          ? activeColors.good
                          : activeColors.panelBorder,
                      }}
                    >
                      <Text style={{ fontSize: 15 }}>{def.icon}</Text>
                      <Text
                        style={{
                          fontFamily: fonts.body,
                          fontSize: 14,
                          fontWeight: isSelected ? "700" : "500",
                          color: isSelected ? activeColors.good : activeColors.ink,
                        }}
                      >
                        {label}
                      </Text>
                      {isSelected && <Check size={14} color={activeColors.good} />}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Custom Unit Input */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  borderTopWidth: 1,
                  borderTopColor: activeColors.panelBorder,
                  paddingTop: 12,
                }}
              >
                <TextInput
                  value={customText}
                  onChangeText={setCustomText}
                  placeholder={
                    language === "en"
                      ? "Or type custom unit..."
                      : "หรือพิมพ์หน่วยเอง..."
                  }
                  placeholderTextColor={activeColors.inkDim + "80"}
                  style={{
                    flex: 1,
                    backgroundColor: activeColors.bg,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: activeColors.panelBorder,
                    paddingHorizontal: 12,
                    paddingVertical: 9,
                    fontFamily: fonts.body,
                    fontSize: 14,
                    color: activeColors.ink,
                  }}
                  onSubmitEditing={handleCustomSubmit}
                />
                <TouchableOpacity
                  onPress={handleCustomSubmit}
                  activeOpacity={0.7}
                  style={{
                    backgroundColor: activeColors.accent,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                    borderRadius: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: fonts.display,
                      fontSize: 13,
                      fontWeight: "700",
                      color: activeColors.bg,
                    }}
                  >
                    {language === "en" ? "Set" : "ตกลง"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
