import { Text, type TextProps } from 'react-native';

import { Type, type ThemeColor, type TypeVariant } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  /** Estilo de texto del design system. */
  variant?: TypeVariant;
  /** Color del tema; por defecto `ink`. */
  color?: ThemeColor;
  align?: 'left' | 'center' | 'right';
};

export function ThemedText({ style, variant = 'body', color = 'ink', align, ...rest }: ThemedTextProps) {
  const theme = useTheme();
  return <Text style={[Type[variant], { color: theme[color], textAlign: align }, style]} {...rest} />;
}
