import type { PropsWithChildren, ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { BottomTabInset, MaxContentWidth, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = PropsWithChildren<{
  /** Texto pequeño sobre el título ("Hola, Carlos"). */
  eyebrow?: string;
  title: string;
  /** Algo a la derecha del título. */
  accessory?: ReactNode;
}>;

/** Pantalla de pestaña: fondo azul pálido, margen `space-6` y título `title`. */
export function Screen({ eyebrow, title, accessory, children }: Props) {
  const theme = useTheme();
  return (
    <View style={[styles.flex, { backgroundColor: theme.surface100 }]}>
      <SafeAreaView style={styles.flex} edges={['top', 'left', 'right']}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={[styles.content, { paddingBottom: BottomTabInset + Space[8] }]}>
          <View style={styles.header}>
            <View style={styles.flex}>
              {eyebrow ? (
                <ThemedText color="inkMuted" numberOfLines={1}>
                  {eyebrow}
                </ThemedText>
              ) : null}
              <ThemedText variant="title" accessibilityRole="header">
                {title}
              </ThemedText>
            </View>
            {accessory}
          </View>
          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    paddingHorizontal: Space[6],
    // En web las pestañas flotan arriba de la pantalla
    paddingTop: Platform.OS === 'web' ? Space[12] + Space[6] : Space[4],
    gap: Space[6],
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: Space[3] },
});
