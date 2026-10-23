import { View, type ViewProps } from 'react-native';

import type { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedViewProps = ViewProps & {
  /** Color de fondo del tema; por defecto `surface100`. */
  surface?: ThemeColor;
};

export function ThemedView({ style, surface = 'surface100', ...rest }: ThemedViewProps) {
  const theme = useTheme();
  return <View style={[{ backgroundColor: theme[surface] }, style]} {...rest} />;
}
