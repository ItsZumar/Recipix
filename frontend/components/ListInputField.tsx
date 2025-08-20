import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { InputField } from './InputField';
import { useScreenColors } from './ScreenWrapper';
import { wp, hp } from '@/utils/responsive';

export interface ListInputFieldProps {
  title: string;
  items: string[];
  onItemsChange: (items: string[]) => void;
  placeholder?: string;
  required?: boolean;
  variant?: 'default' | 'numbered';
  minItems?: number;
  maxItems?: number;
  containerStyle?: any;
  titleStyle?: any;
}

export const ListInputField: React.FC<ListInputFieldProps> = ({
  title,
  items,
  onItemsChange,
  placeholder,
  required = false,
  variant = 'default',
  minItems = 1,
  maxItems = 20,
  containerStyle,
  titleStyle,
}) => {
  const { textColor, tintColor } = useScreenColors();

  const addItem = () => {
    if (items.length < maxItems) {
      onItemsChange([...items, '']);
    }
  };

  const removeItem = (index: number) => {
    if (items.length > minItems) {
      const newItems = items.filter((_, i) => i !== index);
      onItemsChange(newItems);
    }
  };

  const updateItem = (index: number, value: string) => {
    const newItems = items.map((item, i) => i === index ? value : item);
    onItemsChange(newItems);
  };

  const canAdd = items.length < maxItems;
  const canRemove = items.length > minItems;

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <ThemedText style={[
          styles.title,
          { color: textColor },
          titleStyle
        ]}>
          {title}
          {required && <ThemedText style={styles.required}> *</ThemedText>}
        </ThemedText>
        
        {canAdd && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: tintColor }]}
            onPress={addItem}
          >
            <Ionicons name="add" size={wp(5)} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
      
      <ScrollView style={styles.itemsContainer} showsVerticalScrollIndicator={false}>
        {items.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            {variant === 'numbered' && (
              <View style={styles.stepNumber}>
                <ThemedText style={styles.stepNumberText}>{index + 1}</ThemedText>
              </View>
            )}
            
            <InputField
              variant="list"
              value={item}
              onChangeText={(value) => updateItem(index, value)}
              placeholder={placeholder || `${title} ${index + 1}`}
              multiline={variant === 'numbered'}
              numberOfLines={variant === 'numbered' ? 3 : 1}
              containerStyle={styles.inputContainer}
            />
            
            {canRemove && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeItem(index)}
              >
                <Ionicons name="close" size={wp(5)} color="#FF3B30" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(3),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  title: {
    fontSize: wp(4.5),
    fontWeight: '600',
  },
  required: {
    color: '#FF3B30',
  },
  addButton: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemsContainer: {
    maxHeight: hp(30),
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp(1.5),
    gap: wp(2),
  },
  inputContainer: {
    marginBottom: 0,
    flex: 1,
  },
  removeButton: {
    width: wp(8),
    height: wp(8),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(0.5),
  },
  stepNumber: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp(0.5),
  },
  stepNumberText: {
    color: '#fff',
    fontSize: wp(3.5),
    fontWeight: '600',
  },
});
