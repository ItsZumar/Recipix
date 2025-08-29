import React, { useState } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAppTheme } from '@/hooks/useAppTheme';
import { ThemedText } from './ThemedText';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  initiallyExpanded?: boolean;
}

export const Collapsible: React.FC<CollapsibleProps> = ({ 
  title, 
  children, 
  initiallyExpanded = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);
  const [animation] = useState(new Animated.Value(initiallyExpanded ? 1 : 0));
  const { isDark } = useAppTheme();
  const theme = isDark ? 'dark' : 'light';

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const contentHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1000], // Adjust based on your content
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={[styles.header, { borderBottomColor: theme === 'dark' ? '#2A2A2A' : '#E0E0E0' }]} 
        onPress={toggleExpanded}
        activeOpacity={0.7}
      >
        <ThemedText style={styles.title}>{title}</ThemedText>
        <Animated.View
          style={{
            transform: [{
              rotate: animation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '180deg'],
              }),
            }],
          }}
        >
          <Ionicons 
            name="chevron-down" 
            size={20} 
            color={theme === 'dark' ? '#9BA1A6' : '#666666'} 
          />
        </Animated.View>
      </TouchableOpacity>
      
      <Animated.View style={[styles.content, { height: contentHeight }]}>
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    overflow: 'hidden',
  },
});
