import React from 'react';
import { View, TextInput, TextInputProps, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useScreenColors } from './ScreenWrapper';
import { wp, hp } from '@/utils/responsive';

export interface InputFieldProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  required?: boolean;
  variant?: 'default' | 'textarea' | 'list';
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  containerStyle?: any;
  labelStyle?: any;
  inputStyle?: any;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChangeText,
  error,
  required = false,
  variant = 'default',
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  labelStyle,
  inputStyle,
  style,
  placeholder,
  placeholderTextColor,
  multiline = false,
  numberOfLines,
  ...textInputProps
}) => {
  const { backgroundColor, textColor, iconColor, tintColor } = useScreenColors();
  
  const hasError = !!error;
  const isTextArea = variant === 'textarea' || multiline;
  const isListInput = variant === 'list';

  const getInputStyle = () => {
    const baseStyle = [
      styles.input,
      {
        backgroundColor: backgroundColor === '#fff' ? '#FFF8F5' : '#2a2a2a',
        color: textColor,
        borderColor: hasError ? '#FF3B30' : 'transparent',
      },
    ];

    if (isTextArea) {
      baseStyle.push(styles.textArea as any);
    }

    if (isListInput) {
      baseStyle.push(styles.listInput as any);
    }

    if (leftIcon) {
      baseStyle.push(styles.inputWithLeftIcon as any);
    }

    if (rightIcon) {
      baseStyle.push(styles.inputWithRightIcon as any);
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
      
      <View style={styles.inputContainer}>
        {leftIcon && (
          <Ionicons 
            name={leftIcon} 
            size={wp(5)} 
            color={iconColor} 
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          style={[
            getInputStyle(),
            inputStyle,
            style,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor || iconColor}
          multiline={isTextArea}
          numberOfLines={isTextArea ? (numberOfLines || 4) : undefined}
          textAlignVertical={isTextArea ? 'top' : 'center'}
          {...textInputProps}
        />
        
        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            <Ionicons 
              name={rightIcon} 
              size={wp(5)} 
              color={onRightIconPress ? tintColor : iconColor}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {hasError && (
        <ThemedText style={styles.errorText}>{error}</ThemedText>
      )}
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
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
    fontSize: wp(4),
    borderWidth: 1,
  },
  textArea: {
    minHeight: hp(12),
    textAlignVertical: 'top',
  },
  listInput: {
    flex: 1,
  },
  inputWithLeftIcon: {
    paddingLeft: wp(10),
  },
  inputWithRightIcon: {
    paddingRight: wp(10),
  },
  leftIcon: {
    position: 'absolute',
    left: wp(3),
    zIndex: 1,
  },
  rightIconContainer: {
    position: 'absolute',
    right: wp(3),
    zIndex: 1,
    padding: wp(1),
  },
  errorText: {
    color: '#FF3B30',
    fontSize: wp(3),
    marginTop: hp(0.5),
  },
});
