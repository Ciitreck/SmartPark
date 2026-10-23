import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { costFor, costReason, formatClock, formatMoney, overtimeMs } from '@/lib/pricing';

type Props = { elapsed: number };

/**
 * Contador de estancia. Al superar el tiempo libre, la tarjeta pasa a `spot-overtime`
 * (texto en `ink-on-bright`, para que se lea bien) y muestra el costo.
 */
export function StayTimer({ elapsed }: Props) {
  const theme = useTheme();
  const over = overtimeMs(elapsed) > 0;
  const textColor = over ? 'inkOnBright' : 'ink';

  return (
    <View style={[styles.box, { backgroundColor: over ? theme.spotOvertime : theme.surface100 }]}>
      <ThemedText variant="caption" color={over ? 'inkOnBright' : 'inkMuted'} align="center">
        {over ? 'Tiempo libre excedido' : 'Tiempo estacionado'}
      </ThemedText>
      <ThemedText variant="timer" color={textColor} align="center" accessibilityRole="timer">
        {formatClock(elapsed)}
      </ThemedText>
      <ThemedText variant="subtitle" color={textColor} align="center" style={styles.money}>
        {formatMoney(costFor(elapsed))}
      </ThemedText>
      <ThemedText variant="caption" color={over ? 'inkOnBright' : 'inkMuted'} align="center">
        {costReason(elapsed)}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { borderRadius: Radius.md, padding: Space[6], gap: Space[1] },
  money: { fontVariant: ['tabular-nums'], marginTop: Space[2] },
});
