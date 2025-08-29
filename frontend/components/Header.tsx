import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { wp, hp } from '@/utils/responsive';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

export interface HeaderProps {
  title: string;
  leftAccessory?: {
    icon?: keyof typeof Ionicons.glyphMap;
    text?: string;
    onPress: () => void;
  };
  rightAccessory?: {
    icon?: keyof typeof Ionicons.glyphMap;
    text?: string;
    onPress: () => void;
  };
  centerSubtitle?: string;
  backgroundColor?: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  leftAccessory,
  rightAccessory,
  centerSubtitle,
  backgroundColor,
}) => {
  const insets = useSafeAreaInsets();
  const defaultBackgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const iconColor = useThemeColor({}, 'icon');

  const headerBackgroundColor = backgroundColor || defaultBackgroundColor;

  const renderAccessory = (accessory: HeaderProps['leftAccessory'] | HeaderProps['rightAccessory']) => {
    if (!accessory) return <View style={styles.accessoryPlaceholder} />;

    return (
      <TouchableOpacity onPress={accessory.onPress} style={styles.accessoryButton}>
        {accessory.icon && (
          <Ionicons name={accessory.icon} size={wp(6)} color={iconColor} />
        )}
        {accessory.text && (
          <ThemedText style={[styles.accessoryText, { color: tintColor }]}>
            {accessory.text}
          </ThemedText>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={[
      styles.container, 
      { 
        backgroundColor: headerBackgroundColor,
        paddingTop: insets.top  // Add safe area top padding
      }
    ]}>
      {/* Left Accessory */}
      {renderAccessory(leftAccessory)}

      {/* Center Content */}
      <View style={styles.centerContainer}>
        <ThemedText type="title" style={[styles.title, { color: textColor }]}>
          {title}
        </ThemedText>
        {centerSubtitle && (
          <ThemedText style={[styles.subtitle, { color: textColor }]}>
            {centerSubtitle}
          </ThemedText>
        )}
      </View>

      {/* Right Accessory */}
      {renderAccessory(rightAccessory)}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    minHeight: hp(8),
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(2),
  },
  title: {
    fontSize: wp(5),
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: wp(3),
    opacity: 0.7,
    textAlign: 'center',
    marginTop: hp(0.25),
  },
  accessoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
    minWidth: wp(12),
    justifyContent: 'center',
  },
  accessoryText: {
    fontSize: wp(3.5),
    fontWeight: '600',
    marginLeft: wp(1),
  },
  accessoryPlaceholder: {
    width: wp(12),
  },
});
