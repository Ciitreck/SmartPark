import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';

import { ControlHeight, Motion, Radius, Shadow, Space, Type } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { Icon, type IconName } from './icon';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: IconName;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

/** Botón del design system: primario (brand), secundario (blanco) o de peligro. */
export function Button({ title, onPress, variant = 'primary', icon, disabled, style }: Props) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  const textColor = variant === 'primary' ? theme.inkOnDark : variant === 'danger' ? theme.danger : theme.brand;

  return (
    <Animated.View style={[animated, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => {
          if (!reduceMotion) scale.set(withTiming(Motion.pressScale, Motion.press));
        }}
        onPressOut={() => {
          scale.set(withTiming(1, Motion.press));
        }}
        style={({ pressed }) => [
          styles.base,
          variant === 'primary'
            ? [{ backgroundColor: pressed ? theme.brandPressed : theme.brand }, Shadow.button]
            : { backgroundColor: pressed ? theme.surface300 : theme.surface200 },
          disabled && styles.disabled,
        ]}>
        <View style={styles.content}>
          {icon ? <Icon name={icon} size={20} color={textColor} /> : null}
          <Text style={[Type.label, { color: textColor }]}>{title}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    height: ControlHeight,
    borderRadius: Radius.md,
    paddingHorizontal: Space[6],
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flexDirection: 'row', alignItems: 'center', gap: Space[2] },
  disabled: { opacity: 0.4 },
});
