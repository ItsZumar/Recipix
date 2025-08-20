import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { wp, hp } from '@/utils/responsive';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Search recipes..."
}) => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.searchContainer, { backgroundColor: backgroundColor === '#fff' ? '#f5f5f5' : '#2a2a2a' }]}>
        <Ionicons name="search" size={wp(5)} color={iconColor} style={styles.searchIcon} />
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          placeholder={placeholder}
          placeholderTextColor={iconColor}
          returnKeyType="search"
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={wp(5)} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: wp(3),
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
  },
  searchIcon: {
    marginRight: wp(2),
  },
  input: {
    flex: 1,
    fontSize: wp(4),
    paddingVertical: hp(0.5),
  },
  clearButton: {
    marginLeft: wp(2),
  },
});
