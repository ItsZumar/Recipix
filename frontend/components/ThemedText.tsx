import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { getFontStyle } from '@/hooks/useFonts';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
    ...getFontStyle('primary', 'regular'),
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    ...getFontStyle('primary', 'semibold'),
  },
  title: {
    fontSize: 32,
    lineHeight: 32,
    ...getFontStyle('primary', 'bold'),
  },
  subtitle: {
    fontSize: 20,
    ...getFontStyle('primary', 'bold'),
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
    ...getFontStyle('primary', 'medium'),
  },
});
