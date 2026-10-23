import { StyleSheet, View, type ViewProps } from 'react-native';

import { Radius, Shadow, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/** Tarjeta blanca sin borde, con sombra azulada suave. */
export function Card({ style, ...rest }: ViewProps) {
  const theme = useTheme();
  return <View style={[styles.card, Shadow.card, { backgroundColor: theme.surface200 }, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: { borderRadius: Radius.md, padding: Space[4], gap: Space[3] },
});
