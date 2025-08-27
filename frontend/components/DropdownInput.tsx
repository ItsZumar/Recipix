import React, { useState, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, FlatList, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useScreenColors } from './ScreenWrapper';
import { wp, hp } from '@/utils/responsive';
import { getFontStyle } from '@/hooks/useFonts';

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownInputProps {
  label?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  required?: boolean;
  searchable?: boolean;
  containerStyle?: any;
  labelStyle?: any;
}

export const DropdownInput: React.FC<DropdownInputProps> = ({
  label,
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  required = false,
  searchable = true,
  containerStyle,
  labelStyle,
}) => {
  const { textColor, iconColor, tintColor, backgroundColor } = useScreenColors();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    options.find(option => option.value === value) || null
  );

  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const handleSelectOption = (option: DropdownOption) => {
    setSelectedOption(option);
    onValueChange(option.value);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleOpenDropdown = () => {
    setIsOpen(true);
    setSearchQuery('');
  };

  const handleCloseDropdown = () => {
    setIsOpen(false);
    setSearchQuery('');
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
      
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          {
            backgroundColor: backgroundColor === '#fff' ? '#FFF8F5' : '#2a2a2a',
            borderColor: iconColor,
          }
        ]}
        onPress={handleOpenDropdown}
      >
        <ThemedText style={[
          styles.dropdownButtonText,
          { color: selectedOption ? textColor : iconColor }
        ]}>
          {selectedOption ? selectedOption.label : placeholder}
        </ThemedText>
        <Ionicons 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={wp(5)} 
          color={iconColor} 
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleCloseDropdown}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseDropdown}
        >
          <View style={[
            styles.modalContent,
            { backgroundColor: backgroundColor }
          ]}>
            <View style={styles.modalHeader}>
              <ThemedText style={[styles.modalTitle, { color: textColor }]}>
                {label || 'Select Option'}
              </ThemedText>
              <TouchableOpacity onPress={handleCloseDropdown}>
                <Ionicons name="close" size={wp(6)} color={iconColor} />
              </TouchableOpacity>
            </View>

            {searchable && (
              <View style={[
                styles.searchContainer,
                { backgroundColor: backgroundColor === '#fff' ? '#FFF8F5' : '#2a2a2a' }
              ]}>
                <Ionicons name="search" size={wp(5)} color={iconColor} />
                <TextInput
                  style={[styles.searchInput, { color: textColor }]}
                  placeholder="Search..."
                  placeholderTextColor={iconColor}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  autoFocus
                />
              </View>
            )}

            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.optionItem,
                    {
                      backgroundColor: item.value === value ? tintColor : 'transparent',
                    }
                  ]}
                  onPress={() => handleSelectOption(item)}
                >
                  <ThemedText style={[
                    styles.optionText,
                    { color: item.value === value ? '#fff' : textColor }
                  ]}>
                    {item.label}
                  </ThemedText>
                  {item.value === value && (
                    <Ionicons name="checkmark" size={wp(5)} color="#fff" />
                  )}
                </TouchableOpacity>
              )}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: hp(2),
  },
  label: {
    fontSize: wp(3.5),
    marginBottom: hp(0.5),
    ...getFontStyle('primary', 'medium'),
  },
  required: {
    color: '#FF3B30',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
    borderWidth: 1,
  },
  dropdownButtonText: {
    fontSize: wp(4),
    flex: 1,
    ...getFontStyle('primary', 'regular'),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: wp(90),
    maxHeight: hp(70),
    borderRadius: wp(3),
    padding: wp(4),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  modalTitle: {
    fontSize: wp(5),
    fontWeight: '600',
    ...getFontStyle('primary', 'semibold'),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    borderRadius: wp(2),
    marginBottom: hp(2),
    gap: wp(2),
  },
  searchInput: {
    flex: 1,
    fontSize: wp(4),
    ...getFontStyle('primary', 'regular'),
  },
  optionsList: {
    maxHeight: hp(50),
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp(3),
    paddingVertical: hp(1.5),
    borderRadius: wp(2),
    marginBottom: hp(0.5),
  },
  optionText: {
    fontSize: wp(4),
    flex: 1,
    ...getFontStyle('primary', 'regular'),
  },
});
