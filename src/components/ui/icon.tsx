import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ColorValue } from 'react-native';

/** Íconos de la app: SF Symbols en iOS y Material Symbols en Android/web. */
const ICONS = {
  car: { ios: 'car.fill', android: 'directions_car', web: 'directions_car' },
  parking: { ios: 'parkingsign', android: 'local_parking', web: 'local_parking' },
  clock: { ios: 'clock', android: 'schedule', web: 'schedule' },
  cash: { ios: 'banknote', android: 'payments', web: 'payments' },
  accessible: { ios: 'figure.roll', android: 'accessible', web: 'accessible' },
  star: { ios: 'star.fill', android: 'star', web: 'star' },
  offline: { ios: 'antenna.radiowaves.left.and.right.slash', android: 'signal_disconnected', web: 'signal_disconnected' },
  pin: { ios: 'mappin', android: 'location_on', web: 'location_on' },
  back: { ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' },
  eye: { ios: 'eye', android: 'visibility', web: 'visibility' },
  eyeOff: { ios: 'eye.slash', android: 'visibility_off', web: 'visibility_off' },
  logout: { ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'logout' },
  chart: { ios: 'chart.bar', android: 'bar_chart', web: 'bar_chart' },
  chevronRight: { ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' },
  info: { ios: 'info.circle', android: 'info', web: 'info' },
} as const satisfies Record<string, SymbolViewProps['name']>;

export type IconName = keyof typeof ICONS;

type Props = { name: IconName; size?: 20 | 24 | number; color: ColorValue };

export function Icon({ name, size = 24, color }: Props) {
  return <SymbolView name={ICONS[name]} size={size} tintColor={color} style={{ width: size, height: size }} />;
}
