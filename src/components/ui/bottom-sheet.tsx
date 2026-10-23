import { useEffect, useState, type PropsWithChildren } from 'react';
import { Modal, Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { Motion, Radius, Shadow, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = PropsWithChildren<{ visible: boolean; onClose: () => void }>;

/**
 * Hoja inferior con esquinas `radius-lg`. Sube suave al abrir y baja al cerrar.
 * La animación se controla a mano: desde el primer frame la hoja está fuera de la pantalla,
 * así no parpadea en su posición final antes de empezar a subir.
 */
export function BottomSheet({ visible, onClose, children }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const { height: screenHeight } = useWindowDimensions();

  // El Modal sigue montado mientras la hoja baja al cerrarse
  const [mounted, setMounted] = useState(visible);
  if (visible && !mounted) setMounted(true);

  const progress = useSharedValue(0); // 0 = escondida, 1 = abierta
  const sheetHeight = useSharedValue(screenHeight); // hasta medirla, se asume la pantalla completa

  useEffect(() => {
    if (!mounted) return;
    const timing = { duration: reduceMotion ? 0 : Motion.enter, easing: Motion.enterEasing };
    if (visible) {
      progress.set(withTiming(1, timing));
    } else {
      progress.set(
        withTiming(0, timing, (finished) => {
          if (finished) scheduleOnRN(setMounted, false);
        })
      );
    }
  }, [visible, mounted, progress, reduceMotion]);

  const scrimStyle = useAnimatedStyle(() => ({ opacity: progress.get() }));
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.get()) * sheetHeight.get() }],
  }));

  return (
    <Modal visible={mounted} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: theme.scrim }, scrimStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Cerrar" />
        </Animated.View>
        <Animated.View
          onLayout={(e) => sheetHeight.set(e.nativeEvent.layout.height)}
          style={[
            styles.sheet,
            Shadow.sheet,
            { backgroundColor: theme.surface200, paddingBottom: Space[6] + insets.bottom },
            sheetStyle,
          ]}>
          <View style={[styles.handle, { backgroundColor: theme.surface300 }]} />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
    paddingHorizontal: Space[6],
    paddingTop: Space[3],
    gap: Space[4],
  },
  handle: { alignSelf: 'center', width: 40, height: 4, borderRadius: Radius.pill },
});
