import React, { ReactNode } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { ThemedView } from "./ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { hp } from "@/utils/responsive";

interface ScreenWrapperProps {
  children: ReactNode;
  style?: ViewStyle;
  backgroundColor?: string;
  textColor?: string;
  tintColor?: string;
  iconColor?: string;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ children, style, backgroundColor, textColor, tintColor, iconColor }) => {
  // Get theme colors if not provided
  const themeBackgroundColor = useThemeColor({}, "background");
  const themeTextColor = useThemeColor({}, "text");
  const themeTintColor = useThemeColor({}, "tint");
  const themeIconColor = useThemeColor({}, "icon");

  // Use provided colors or fall back to theme colors
  const finalBackgroundColor = backgroundColor || themeBackgroundColor;
  const finalTextColor = textColor || themeTextColor;
  const finalTintColor = tintColor || themeTintColor;
  const finalIconColor = iconColor || themeIconColor;

  return <ThemedView style={[styles.container, { backgroundColor: finalBackgroundColor }, style]}>{children}</ThemedView>;
};

// Create a hook that returns all theme colors
export const useScreenColors = () => {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const iconColor = useThemeColor({}, "icon");

  return {
    backgroundColor,
    textColor,
    tintColor,
    iconColor,
  };
};

// Create a hook that returns common color combinations
export const useCommonColors = () => {
  const colors = useScreenColors();

  return {
    ...colors,
    // Common color combinations
    cardBackground: colors.backgroundColor === "#fff" ? "#FFF8F5" : "#2a2a2a", // Light orange tint
    inputBackground: colors.backgroundColor === "#fff" ? "#FFF8F5" : "#2a2a2a", // Light orange tint
    overlayBackground: "rgba(0, 0, 0, 0.5)",
    successColor: "#4CAF50",
    errorColor: "#FF3B30",
    warningColor: "#FF6B35", // Orange warning
    infoColor: "#FF6B35", // Orange info
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
