import type { PropsWithChildren } from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Radius, Shadow, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = PropsWithChildren<{ visible: boolean; onClose: () => void }>;

/** Hoja inferior con esquinas `radius-lg` y entrada con resorte. */
export function BottomSheet({ visible, onClose, children }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={styles.root}>
        <Animated.View entering={FadeIn.duration(200)} style={[StyleSheet.absoluteFill, { backgroundColor: theme.scrim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Cerrar" />
        </Animated.View>
        <Animated.View
          entering={SlideInDown.springify().damping(18).stiffness(180).reduceMotion(ReduceMotion.System)}
          style={[
            styles.sheet,
            Shadow.sheet,
            { backgroundColor: theme.surface200, paddingBottom: Space[6] + insets.bottom },
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
