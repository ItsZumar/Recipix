import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { wp, hp } from '@/utils/responsive';

interface CategoryCardProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  isSelected?: boolean;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  title,
  icon,
  onPress,
  isSelected = false,
}) => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isSelected ? tintColor : backgroundColor === '#fff' ? '#f8f9fa' : '#2a2a2a',
          borderColor: isSelected ? tintColor : backgroundColor === '#fff' ? '#e9ecef' : '#404040',
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: isSelected ? '#fff' : backgroundColor === '#fff' ? '#e9ecef' : '#404040' }]}>
        <Ionicons
          name={icon}
          size={wp(6)}
          color={isSelected ? tintColor : textColor}
        />
      </View>
      <ThemedText
        style={[
          styles.title,
          {
            color: isSelected ? '#fff' : textColor,
            fontWeight: isSelected ? '600' : '500',
          },
        ]}
      >
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: wp(4),
    borderRadius: wp(3),
    borderWidth: 1,
    minWidth: wp(20),
    marginHorizontal: wp(1),
  },
  iconContainer: {
    width: wp(12),
    height: wp(12),
    borderRadius: wp(6),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp(1),
  },
  title: {
    fontSize: wp(3),
    textAlign: 'center',
  },
});
