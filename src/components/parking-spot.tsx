import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import type { ParkingSpace, SpotStatus } from '@/constants/parking-layout';
import { Motion, Radius, Space, Type, type Palette } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import Car from './car';
import { Icon } from './ui/icon';

export const STATUS_LABEL: Record<SpotStatus, string> = {
  libre: 'Libre',
  ocupado: 'Ocupado',
  reservado: 'Reservado',
  excedido: 'Tiempo excedido',
  sinSenal: 'Sin señal',
};

const CLEAR = 'rgba(0,0,0,0)';

/** Relleno y color de texto/ícono de cada estado (tabla "Estados del cajón"). */
export function spotColors(status: SpotStatus, theme: Palette) {
  switch (status) {
    case 'libre':
      return { fill: theme.spotFree, on: theme.inkOnBright };
    case 'ocupado':
      return { fill: theme.spotOccupied, on: theme.inkOnDark };
    case 'reservado':
      return { fill: theme.spotReserved, on: theme.inkOnBright };
    case 'excedido':
      return { fill: theme.spotOvertime, on: theme.inkOnBright };
    case 'sinSenal':
      return { fill: CLEAR, on: theme.spotOffline };
  }
}

type Props = {
  space: ParkingSpace;
  status: SpotStatus;
  width: number;
  height: number;
  selected: boolean;
  mine: boolean;
  onPress: () => void;
};

export default function ParkingSpot({ space, status, width, height, selected, mine, onPress }: Props) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const { fill, on } = spotColors(status, theme);
  const hasCar = status === 'ocupado' || status === 'excedido';

  // Fundido de color 200 ms
  const fillStyle = useAnimatedStyle(() => ({ backgroundColor: withTiming(fill, { duration: reduceMotion ? 0 : Motion.fade.duration }) }));

  // El carrito entra deslizando 12 dp desde el carril + fade, 250 ms
  const car = useSharedValue(hasCar ? 1 : 0);
  useEffect(() => {
    car.set(withTiming(hasCar ? 1 : 0, { duration: reduceMotion ? 0 : 250 }));
  }, [hasCar, car, reduceMotion]);
  const fromLane = space.row === 1 ? 12 : -12;
  const carStyle = useAnimatedStyle(() => ({
    opacity: car.get(),
    transform: [{ translateY: (1 - car.get()) * fromLane }],
  }));

  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  const carWidth = Math.min(width * 0.5, (height - 24) / 1.7);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Cajón ${space.id}, ${STATUS_LABEL[status]}${mine ? ', tu lugar' : ''}`}
      accessibilityState={{ selected }}
      onPress={onPress}
      onPressIn={() => {
        if (!reduceMotion) scale.set(withTiming(Motion.pressScale, Motion.press));
      }}
      onPressOut={() => {
        scale.set(withTiming(1, Motion.press));
      }}>
      <Animated.View
        style={[
          styles.spot,
          { width, height },
          status === 'sinSenal' && { borderWidth: 2, borderStyle: 'dashed', borderColor: theme.spotOffline },
          fillStyle,
          pressStyle,
        ]}>
        <Text style={[Type.spotNumber, { color: on }]}>{space.id}</Text>

        <View style={styles.center}>
          {status === 'reservado' ? (
            <Icon name={space.reservedFor === 'discapacidad' ? 'accessible' : 'star'} size={20} color={on} />
          ) : null}
          {status === 'sinSenal' ? <Icon name="offline" size={20} color={on} /> : null}
          <Animated.View style={[StyleSheet.absoluteFill, styles.center, carStyle]} pointerEvents="none">
            <Car width={carWidth} color={theme.inkOnDark} glass={theme.asphalt} />
          </Animated.View>
        </View>

        {/* Badge de cobro */}
        {status === 'excedido' ? (
          <View style={[styles.badge, { backgroundColor: theme.inkOnBright }]}>
            <Text style={[styles.badgeText, { color: theme.spotOvertime }]}>$</Text>
          </View>
        ) : null}
        {/* Tu lugar */}
        {mine ? (
          <View style={[styles.mine, { backgroundColor: theme.inkOnDark }]}>
            <Icon name="pin" size={12} color={theme.brand} />
          </View>
        ) : null}
        {/* Seleccionado */}
        {selected ? <View style={[styles.ring, { borderColor: theme.inkOnDark }]} pointerEvents="none" /> : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  spot: {
    borderRadius: Radius.sm,
    alignItems: 'center',
    paddingTop: Space[1],
    overflow: 'hidden',
  },
  center: { flex: 1, alignSelf: 'stretch', alignItems: 'center', justifyContent: 'center' },
  badge: {
    position: 'absolute',
    right: 3,
    bottom: 3,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: { ...Type.caption, fontSize: 11, lineHeight: 14 },
  mine: {
    position: 'absolute',
    left: 3,
    bottom: 3,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: { ...StyleSheet.absoluteFill, borderRadius: Radius.sm, borderWidth: 3 },
});
