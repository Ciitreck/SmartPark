import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

import type { ParkingSpace } from '@/constants/parking-layout';
import Car from './car';

const CAR_COLORS = ['#E53935', '#1E88E5', '#FDD835', '#8E24AA', '#FB8C00', '#00ACC1', '#6D4C41', '#90A4AE'];

type Props = {
  space: ParkingSpace;
  width: number;
  index: number;
  onPress: () => void;
};

export default function ParkingSpot({ space, width, index, onPress }: Props) {
  const height = width * 1.6;
  const occupied = !space.isAvailable;
  const color = CAR_COLORS[parseInt(space.id, 10) % CAR_COLORS.length];

  const [parked] = useState(() => new Animated.Value(0)); // 0 = vacío, 1 = estacionado
  const [press] = useState(() => new Animated.Value(1));
  const first = useRef(true);

  useEffect(() => {
    Animated.spring(parked, {
      toValue: occupied ? 1 : 0,
      delay: first.current ? index * 60 : 0, // al abrir, los carros entran uno tras otro
      friction: 7,
      tension: 50,
      useNativeDriver: true,
    }).start();
    first.current = false;
  }, [occupied, index, parked]);

  const carTranslate = parked.interpolate({ inputRange: [0, 1], outputRange: [-height, 0] });
  const carOpacity = parked.interpolate({ inputRange: [0, 0.4, 1], outputRange: [0, 1, 1], extrapolate: 'clamp' });
  const pOpacity = parked.interpolate({ inputRange: [0, 1], outputRange: [1, 0], extrapolate: 'clamp' });

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => Animated.spring(press, { toValue: 0.94, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(press, { toValue: 1, useNativeDriver: true }).start()}>
      <Animated.View
        style={[
          styles.slot,
          { width, height, transform: [{ scale: press }] },
          occupied ? styles.slotOccupied : styles.slotFree,
        ]}>
        <Animated.Text style={[styles.parkLetter, { opacity: pOpacity }]}>P</Animated.Text>

        <Animated.View style={[styles.carWrap, { opacity: carOpacity, transform: [{ translateY: carTranslate }] }]}>
          <Car width={width * 0.62} color={color} />
        </Animated.View>

        <Text style={[styles.label, occupied ? styles.labelOccupied : styles.labelFree]}>{space.id}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  slot: {
    borderRadius: 10,
    borderWidth: 2,
    borderStyle: 'dashed',
    overflow: 'hidden',
    alignItems: 'center',
  },
  slotFree: { borderColor: '#66BB6A', backgroundColor: 'rgba(102, 187, 106, 0.12)' },
  slotOccupied: { borderColor: 'rgba(255, 255, 255, 0.35)', backgroundColor: 'rgba(244, 67, 54, 0.1)' },
  parkLetter: {
    position: 'absolute',
    top: '26%',
    fontSize: 34,
    fontWeight: '800',
    color: '#66BB6A',
  },
  carWrap: { position: 'absolute', top: 8, left: 0, right: 0, alignItems: 'center' },
  label: { position: 'absolute', bottom: 4, fontSize: 12, fontWeight: '700' },
  labelFree: { color: '#A5D6A7' },
  labelOccupied: { color: 'rgba(255, 255, 255, 0.7)' },
});