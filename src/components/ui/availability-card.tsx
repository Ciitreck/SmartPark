import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Radius, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Card } from './card';

type Props = { title: string; free: number; total: number; subtitle?: string };

/** "Sector B · 8 de 10 libres" con barra de ocupación. */
export function AvailabilityCard({ title, free, total, subtitle }: Props) {
  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.flex}>
          <ThemedText variant="subtitle">{title}</ThemedText>
          {subtitle ? (
            <ThemedText variant="caption" color="inkMuted">
              {subtitle}
            </ThemedText>
          ) : null}
        </View>
        <ThemedText variant="label" style={styles.numbers}>
          {free} de {total} libres
        </ThemedText>
      </View>
      <OccupancyBar value={total ? (total - free) / total : 0} />
    </Card>
  );
}

/** Barra de ocupación: pista `surface-300`, relleno `brand`. */
export function OccupancyBar({ value }: { value: number }) {
  const theme = useTheme();
  const fill = useAnimatedStyle(() => ({ width: withTiming(`${Math.round(value * 100)}%`, { duration: 300 }) }));
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value * 100) }}
      style={[styles.track, { backgroundColor: theme.surface300 }]}>
      <Animated.View style={[styles.fill, { backgroundColor: theme.brand }, fill]} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: Space[3] },
  numbers: { fontVariant: ['tabular-nums'] },
  track: { height: 8, borderRadius: Radius.pill, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: Radius.pill },
});
