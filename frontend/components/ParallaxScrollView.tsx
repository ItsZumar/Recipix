import React, { useRef, useState } from 'react';
import {
  View,
  ScrollView,
  Animated,
  StyleSheet,
  Dimensions,
  RefreshControl,
} from 'react-native';

import { useAppTheme } from '@/hooks/useAppTheme';
import { ThemedText } from './ThemedText';

const { width: screenWidth } = Dimensions.get('window');

interface ParallaxScrollViewProps {
  children: React.ReactNode;
  headerHeight?: number;
  headerContent?: React.ReactNode;
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
  style?: any;
}

export const ParallaxScrollView: React.FC<ParallaxScrollViewProps> = ({
  children,
  headerHeight = 200,
  headerContent,
  onRefresh,
  refreshing = false,
  style,
}) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerVisible, setHeaderVisible] = useState(true);
  const { isDark } = useAppTheme();
  const colorScheme = isDark ? 'dark' : 'light';

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, headerHeight],
    outputRange: [0, -headerHeight],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, headerHeight / 2, headerHeight],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-headerHeight, 0],
    outputRange: [2, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeight,
            transform: [{ translateY: headerTranslateY }, { scale: imageScale }],
            opacity: headerOpacity,
          },
        ]}
      >
        {headerContent}
      </Animated.View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingTop: headerHeight },
        ]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colorScheme === 'dark' ? '#ECEDEE' : '#2C2C2C'}
            />
          ) : undefined
        }
      >
        {children}
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
});
