import React, { ReactNode } from "react";
import { StyleSheet, Modal, TouchableOpacity, View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { wp, hp } from "@/utils/responsive";

export interface ModalAction {
  id: string;
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  style?: "default" | "destructive" | "primary";
  disabled?: boolean;
  loading?: boolean;
}

export interface ActionModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  actions: ModalAction[];
  showCancelButton?: boolean;
  cancelText?: string;
  maxHeight?: number;
  children?: ReactNode;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  visible,
  onClose,
  title,
  subtitle,
  actions,
  showCancelButton = true,
  cancelText = "Cancel",
  maxHeight = hp(60),
  children,
}) => {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor({}, "icon");
  const tintColor = useThemeColor({}, "tint");

  const getActionStyle = (action: ModalAction) => {
    switch (action.style) {
      case "destructive":
        return { backgroundColor: "#FF3B30" };
      case "primary":
        return { backgroundColor: tintColor };
      default:
        return { backgroundColor: backgroundColor === "#fff" ? "#f0f0f0" : "#404040" };
    }
  };

  const getActionTextColor = (action: ModalAction) => {
    switch (action.style) {
      case "destructive":
      case "primary":
        return "#fff";
      default:
        return textColor;
    }
  };

  const getActionIconColor = (action: ModalAction) => {
    switch (action.style) {
      case "destructive":
      case "primary":
        return "#fff";
      default:
        return iconColor;
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity
          style={[styles.modalContainer, { backgroundColor }]}
          activeOpacity={1}
          onPress={() => {}} // Prevent closing when tapping modal content
        >
          {/* Header */}
          {(title || subtitle) && (
            <View style={styles.header}>
              {title && (
                <ThemedText type="title" style={[styles.title, { color: textColor }]}>
                  {title}
                </ThemedText>
              )}
              {subtitle && <ThemedText style={[styles.subtitle, { color: textColor }]}>{subtitle}</ThemedText>}
            </View>
          )}

          {/* Custom Content */}
          {children && (
            <ScrollView style={[styles.content, { maxHeight }]} showsVerticalScrollIndicator={false}>
              {children}
            </ScrollView>
          )}

          {/* Actions */}
          <View style={styles.actionsContainer}>
            {actions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionButton, getActionStyle(action), action.disabled && styles.disabledAction]}
                onPress={action.onPress}
                disabled={action.disabled || action.loading}
              >
                {action.loading ? (
                  <Ionicons name="hourglass-outline" size={wp(5)} color={getActionIconColor(action)} />
                ) : action.icon ? (
                  <Ionicons name={action.icon} size={wp(5)} color={getActionIconColor(action)} />
                ) : null}
                <ThemedText style={[styles.actionText, { color: getActionTextColor(action) }, action.disabled && styles.disabledText]}>
                  {action.title}
                </ThemedText>
              </TouchableOpacity>
            ))}

            {showCancelButton && (
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <ThemedText style={[styles.cancelText, { color: textColor }]}>{cancelText}</ThemedText>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp(4),
  },
  modalContainer: {
    width: "100%",
    maxWidth: wp(90),
    borderRadius: wp(4),
    padding: wp(4),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    alignItems: "center",
    marginBottom: hp(3),
  },
  title: {
    textAlign: "center",
    marginBottom: hp(0.5),
    fontSize: wp(4.5), // Reduced from default title size
    fontWeight: "600",
  },
  subtitle: {
    fontSize: wp(3.5),
    textAlign: "center",
    opacity: 0.7,
  },
  content: {
    marginBottom: hp(3),
  },
  actionsContainer: {
    gap: hp(1.5),
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp(2),
    paddingHorizontal: wp(4),
    borderRadius: wp(3),
    gap: wp(2),
  },
  actionText: {
    fontSize: wp(4),
    fontWeight: "600",
  },
  disabledAction: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: hp(2),
    marginTop: hp(1),
    borderRadius: wp(3),
  },
  cancelText: {
    fontSize: wp(4),
    fontWeight: "600",
  },
});

// Hook for easy modal state management
export const useActionModal = () => {
  const [visible, setVisible] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const toggleModal = () => setVisible(!visible);

  return {
    visible,
    showModal,
    hideModal,
    toggleModal,
  };
};
