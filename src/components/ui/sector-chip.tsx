import { Pressable, StyleSheet, Text } from 'react-native';

import { Radius, Space, Type } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = { label: string; free: number; active: boolean; onPress: () => void };

/** Chip de sector con sus lugares libres: "B · 8". Activo en `brand`. */
export function SectorChip({ label, free, active, onPress }: Props) {
  const theme = useTheme();
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={`Sector ${label}, ${free} libres`}
      onPress={onPress}
      style={[styles.chip, { backgroundColor: active ? theme.brand : theme.surface200 }]}>
      <Text style={[Type.label, { color: active ? theme.inkOnDark : theme.ink, fontVariant: ['tabular-nums'] }]}>
        {label} · {free}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: Radius.pill,
    paddingHorizontal: Space[4],
    paddingVertical: Space[2],
    minHeight: 40,
    justifyContent: 'center',
  },
});
