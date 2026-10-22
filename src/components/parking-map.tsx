import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { parkingLayout, type ParkingSpace } from '@/constants/parking-layout';
import ParkingSpot from './parking-spot';

const PER_LINE = 5;
const GAP = 8;

export default function ParkingMap() {
  const { width: screenWidth } = useWindowDimensions();
  const [spaces, setSpaces] = useState(parkingLayout);

  const appear = useRef(new Animated.Value(0)).current;
  const bump = useRef(new Animated.Value(1)).current;

  // El ancho de cada cajón se calcula según la pantalla, para que siempre quepan 5 por línea
  const slotWidth = Math.floor((screenWidth - 20 - 24 - GAP * (PER_LINE - 1)) / PER_LINE);

  const available = useMemo(() => spaces.filter((s) => s.isAvailable).length, [spaces]);

  const rows = useMemo(() => {
    const ordered = [...spaces].sort((a, b) => a.row - b.row || a.position - b.position);
    const byRow = new Map<number, { space: ParkingSpace; index: number }[]>();
    ordered.forEach((space, index) => {
      const list = byRow.get(space.row) ?? [];
      list.push({ space, index });
      byRow.set(space.row, list);
    });
    return Array.from(byRow.entries());
  }, [spaces]);

  const toggle = useCallback((id: string) => {
    setSpaces((prev) => prev.map((s) => (s.id === id ? { ...s, isAvailable: !s.isAvailable } : s)));
  }, []);

  useEffect(() => {
    Animated.timing(appear, { toValue: 1, duration: 450, useNativeDriver: true }).start();
  }, [appear]);

  // El contador "rebota" cada vez que cambia
  useEffect(() => {
    Animated.sequence([
      Animated.timing(bump, { toValue: 1.15, duration: 110, useNativeDriver: true }),
      Animated.spring(bump, { toValue: 1, useNativeDriver: true }),
    ]).start();
  }, [available, bump]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: appear,
          transform: [{ translateY: appear.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }],
        },
      ]}>
      <Animated.View style={[styles.counter, { transform: [{ scale: bump }] }]}>
        <Text style={styles.counterNumber}>{available}</Text>
        <Text style={styles.counterText}> de {spaces.length} lugares disponibles</Text>
      </Animated.View>

      {rows.map(([row, items]) => (
        <View key={row} style={styles.row}>
          {items.map(({ space, index }) => (
            <ParkingSpot
              key={space.id}
              space={space}
              width={slotWidth}
              index={index}
              onPress={() => toggle(space.id)}
            />
          ))}
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 12,
    borderRadius: 20,
    backgroundColor: '#2B2F36', // asfalto
    gap: 22,
  },
  counter: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' },
  counterNumber: { fontSize: 28, fontWeight: '800', color: '#66BB6A' },
  counterText: { fontSize: 16, fontWeight: '600', color: '#ECEFF1' },
  row: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: GAP },
});