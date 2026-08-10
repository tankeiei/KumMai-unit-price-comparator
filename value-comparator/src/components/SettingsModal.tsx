import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ColorSchemeName,
} from "react-native";
import { X, Globe, Moon, Sun, Monitor } from "lucide-react-native";
import { LanguageMode, ThemeMode } from "../types";
import { getAppColors, AppColors } from "../theme/colors";
import { getTranslation } from "../constants/translations";
import { fonts } from "../theme/typography";

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  language: LanguageMode;
  theme: ThemeMode;
  onSelectLanguage: (lang: LanguageMode) => void;
  onSelectTheme: (theme: ThemeMode) => void;
  systemColorScheme?: ColorSchemeName;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  language,
  theme,
  onSelectLanguage,
  onSelectTheme,
  systemColorScheme,
}) => {
  const activeColors: AppColors = getAppColors(theme, systemColorScheme);
  const t = getTranslation(language);

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
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 20,
          }}
        >
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View
              style={{
                width: "100%",
                maxWidth: 380,
                backgroundColor: activeColors.panel,
                borderRadius: 20,
                borderWidth: 1.5,
                borderColor: activeColors.panelBorder,
                padding: 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.35,
                shadowRadius: 15,
                elevation: 10,
              }}
            >
              {/* Modal Header */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 20,
                    color: activeColors.ink,
                  }}
                >
                  {t.settingsTitle}
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

              {/* Language Section */}
              <View style={{ marginBottom: 24 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 10,
                  }}
                >
                  <Globe size={16} color={activeColors.accent} />
                  <Text
                    style={{
                      fontFamily: fonts.display,
                      fontSize: 14,
                      color: activeColors.inkDim,
                    }}
                  >
                    {t.languageLabel}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: activeColors.bg,
                    borderRadius: 12,
                    padding: 4,
                    borderWidth: 1,
                    borderColor: activeColors.panelBorder,
                    gap: 4,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => onSelectLanguage("th")}
                    activeOpacity={0.8}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 8,
                      alignItems: "center",
                      backgroundColor:
                        language === "th"
                          ? activeColors.accent
                          : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fonts.display,
                        fontSize: 14,
                        color:
                          language === "th"
                            ? activeColors.paperInk
                            : activeColors.inkDim,
                      }}
                    >
                      🇹🇭 ไทย (TH)
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => onSelectLanguage("en")}
                    activeOpacity={0.8}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 8,
                      alignItems: "center",
                      backgroundColor:
                        language === "en"
                          ? activeColors.accent
                          : "transparent",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fonts.display,
                        fontSize: 14,
                        color:
                          language === "en"
                            ? activeColors.paperInk
                            : activeColors.inkDim,
                      }}
                    >
                      🇬🇧 English (EN)
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Theme Section */}
              <View style={{ marginBottom: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 10,
                  }}
                >
                  <Moon size={16} color={activeColors.accent} />
                  <Text
                    style={{
                      fontFamily: fonts.display,
                      fontSize: 14,
                      color: activeColors.inkDim,
                    }}
                  >
                    {t.themeLabel}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    backgroundColor: activeColors.bg,
                    borderRadius: 12,
                    padding: 4,
                    borderWidth: 1,
                    borderColor: activeColors.panelBorder,
                    gap: 4,
                  }}
                >
                  {/* Dark Option */}
                  <TouchableOpacity
                    onPress={() => onSelectTheme("dark")}
                    activeOpacity={0.8}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 8,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 4,
                      backgroundColor:
                        theme === "dark"
                          ? activeColors.accent
                          : "transparent",
                    }}
                  >
                    <Moon
                      size={14}
                      color={
                        theme === "dark"
                          ? activeColors.paperInk
                          : activeColors.inkDim
                      }
                    />
                    <Text
                      style={{
                        fontFamily: fonts.display,
                        fontSize: 12,
                        color:
                          theme === "dark"
                            ? activeColors.paperInk
                            : activeColors.inkDim,
                      }}
                    >
                      {t.themeDark}
                    </Text>
                  </TouchableOpacity>

                  {/* Light Option */}
                  <TouchableOpacity
                    onPress={() => onSelectTheme("light")}
                    activeOpacity={0.8}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 8,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 4,
                      backgroundColor:
                        theme === "light"
                          ? activeColors.accent
                          : "transparent",
                    }}
                  >
                    <Sun
                      size={14}
                      color={
                        theme === "light"
                          ? activeColors.paperInk
                          : activeColors.inkDim
                      }
                    />
                    <Text
                      style={{
                        fontFamily: fonts.display,
                        fontSize: 12,
                        color:
                          theme === "light"
                            ? activeColors.paperInk
                            : activeColors.inkDim,
                      }}
                    >
                      {t.themeLight}
                    </Text>
                  </TouchableOpacity>

                  {/* System Option */}
                  <TouchableOpacity
                    onPress={() => onSelectTheme("system")}
                    activeOpacity={0.8}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 8,
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                      gap: 4,
                      backgroundColor:
                        theme === "system"
                          ? activeColors.accent
                          : "transparent",
                    }}
                  >
                    <Monitor
                      size={14}
                      color={
                        theme === "system"
                          ? activeColors.paperInk
                          : activeColors.inkDim
                      }
                    />
                    <Text
                      style={{
                        fontFamily: fonts.display,
                        fontSize: 12,
                        color:
                          theme === "system"
                            ? activeColors.paperInk
                            : activeColors.inkDim,
                      }}
                    >
                      {t.themeSystem}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Close Button */}
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.8}
                style={{
                  backgroundColor: activeColors.accent,
                  paddingVertical: 12,
                  borderRadius: 12,
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: fonts.display,
                    fontSize: 15,
                    color: activeColors.paperInk,
                  }}
                >
                  {t.close}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
