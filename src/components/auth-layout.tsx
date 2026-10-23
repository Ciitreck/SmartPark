import { useCallback, useEffect, useRef, type ComponentRef, type PropsWithChildren } from 'react';
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InputFocusContext } from '@/components/ui/focus-context';
import { Icon } from '@/components/ui/icon';
import { Space, Type } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = PropsWithChildren<{ animatedStyle: object; onBack?: () => void }>;

/** Contenedor común de entrar y registro: fondo azul pálido y el teclado no tapa los campos. */
export function AuthLayout({ animatedStyle, onBack, children }: Props) {
  const theme = useTheme();
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const contentRef = useRef<ComponentRef<typeof View>>(null);

  // Desplaza la pantalla para que el campo con foco quede arriba del teclado
  const revealFocused = useCallback(() => {
    setTimeout(() => {
      const input = TextInput.State.currentlyFocusedInput();
      const content = contentRef.current;
      if (!input || !content) return;
      input.measureLayout(
        content,
        (_x, y) => scrollRef.current?.scrollTo({ y: Math.max(0, y - Space[12] * 2), animated: true }),
        () => {}
      );
    }, 120);
  }, []);

  // Al abrir el teclado (o cambiar de tamaño) vuelve a mostrar el campo activo
  useEffect(() => {
    const sub = Keyboard.addListener('keyboardDidShow', revealFocused);
    return () => sub.remove();
  }, [revealFocused]);

  return (
    <View style={[styles.flex, { backgroundColor: theme.surface100 }]}>
      <SafeAreaView style={styles.flex}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Regresar"
            hitSlop={Space[2]}
            style={[styles.back, { backgroundColor: theme.surface200 }]}>
            <Icon name="back" size={24} color={theme.ink} />
          </Pressable>
        ) : null}
        {/* Android dibuja de borde a borde: la ventana ya no se encoge con el teclado,
            así que el espacio se agrega con padding en ambas plataformas */}
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'web' ? undefined : 'padding'}>
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}>
            <View ref={contentRef} collapsable={false}>
              <InputFocusContext value={revealFocused}>
                <Animated.View style={[styles.column, animatedStyle]}>{children}</Animated.View>
              </InputFocusContext>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

/** Mensaje de error del formulario, en `danger` y `caption`. */
export function FormError({ message }: { message: string }) {
  const theme = useTheme();
  if (!message) return null;
  return (
    <Text accessibilityRole="alert" style={[Type.caption, { color: theme.danger, textAlign: 'center' }]}>
      {message}
    </Text>
  );
}

/** "¿Ya tienes cuenta? **Entra**": texto `ink` con la palabra clave subrayada. */
export function AuthLink({ text, action, onPress }: { text: string; action: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="link" style={styles.link} hitSlop={Space[2]}>
      <Text style={[Type.body, { color: theme.ink, textAlign: 'center' }]}>
        {text} <Text style={[Type.label, styles.underline, { color: theme.ink }]}>{action}</Text>
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  back: {
    position: 'absolute',
    top: Space[4],
    left: Space[6],
    zIndex: 1,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: Space[6], paddingVertical: Space[12] },
  column: { gap: Space[3], width: '100%', maxWidth: 420, alignSelf: 'center' },
  link: { alignItems: 'center', paddingVertical: Space[3] },
  underline: { textDecorationLine: 'underline' },
});
