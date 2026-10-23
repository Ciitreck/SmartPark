import type { PropsWithChildren } from 'react';
import { Animated, KeyboardAvoidingView, ScrollView, StyleSheet, TextInput, type TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';

type Props = PropsWithChildren<{ animatedStyle: object }>;

/** Contenedor común de login y registro: evita que el teclado tape los campos. */
export function AuthLayout({ animatedStyle, children }: Props) {
  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.flex}>
        <KeyboardAvoidingView style={styles.flex}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Animated.View style={[styles.card, animatedStyle]}>{children}</Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

export function AuthInput(props: TextInputProps) {
  const colors = useTheme();
  return (
    <TextInput
      placeholderTextColor="#888"
      {...props}
      style={[styles.input, { backgroundColor: colors.backgroundElement, color: colors.text }]}
    />
  );
}

export const authStyles = StyleSheet.create({
  logo: { fontSize: 32, fontWeight: '800', textAlign: 'center' },
  subtitle: { textAlign: 'center', opacity: 0.7, marginBottom: 12 },
  error: { color: '#EF5350', textAlign: 'center', fontWeight: '600' },
  button: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '700' },
  linkWrap: { alignItems: 'center', paddingVertical: 8 },
  link: { fontWeight: '600', opacity: 0.8 },
});

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  card: { gap: 14 },
  input: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 },
});
