import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { useScreenColors } from './ScreenWrapper';
import { wp, hp } from '@/utils/responsive';

export interface SelectionOption {
  value: string;
  label: string;
}

export interface SelectionInputProps {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectionOption[];
  required?: boolean;
  variant?: 'single' | 'multiple';
  layout?: 'horizontal' | 'vertical' | 'grid';
  containerStyle?: any;
  labelStyle?: any;
  optionStyle?: any;
}

export const SelectionInput: React.FC<SelectionInputProps> = ({
  label,
  value,
  onValueChange,
  options,
  required = false,
  variant = 'single',
  layout = 'horizontal',
  containerStyle,
  labelStyle,
  optionStyle,
}) => {
  const { textColor, iconColor, tintColor, backgroundColor } = useScreenColors();

  const handleOptionPress = (optionValue: string) => {
    if (variant === 'single') {
      onValueChange(optionValue);
    } else {
      // For multiple selection, you would need to handle an array of values
      // This is a simplified version for single selection
      onValueChange(optionValue);
    }
  };

  const getContainerStyle = () => {
    switch (layout) {
      case 'vertical':
        return styles.verticalContainer;
      case 'grid':
        return styles.gridContainer;
      default:
        return styles.horizontalContainer;
    }
  };

  const getOptionStyle = (optionValue: string) => {
    const isSelected = value === optionValue;
    const baseStyle = [
      styles.option,
      {
        backgroundColor: isSelected ? tintColor : backgroundColor === '#fff' ? '#FFF8F5' : '#2a2a2a',
        borderColor: isSelected ? tintColor : iconColor,
      },
    ];

    if (layout === 'grid') {
      baseStyle.push(styles.gridOption as any);
    }

    return baseStyle;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <ThemedText style={[
          styles.label,
          { color: textColor },
          labelStyle
        ]}>
          {label}
          {required && <ThemedText style={styles.required}> *</ThemedText>}
        </ThemedText>
      )}
      
      <View style={getContainerStyle()}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[getOptionStyle(option.value), optionStyle]}
            onPress={() => handleOptionPress(option.value)}
          >
            <ThemedText style={[
              styles.optionText,
              { color: value === option.value ? '#fff' : textColor }
            ]}>
              {option.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(2),
  },
  label: {
    fontSize: wp(3.5),
    fontWeight: '500',
    marginBottom: hp(0.5),
  },
  required: {
    color: '#FF3B30',
  },
  horizontalContainer: {
    flexDirection: 'row',
    gap: wp(3),
  },
  verticalContainer: {
    gap: hp(1),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: wp(2),
  },
  option: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: wp(2),
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: wp(20),
  },
  gridOption: {
    flex: 1,
    minWidth: wp(15),
  },
  optionText: {
    fontSize: wp(3.5),
    fontWeight: '500',
  },
});
