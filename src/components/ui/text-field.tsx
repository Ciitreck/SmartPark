import { use, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { ControlHeight, Radius, Space, Type } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

import { InputFocusContext } from './focus-context';
import { Icon } from './icon';

type Props = Omit<TextInputProps, 'style'> & {
  /** Marca el campo con el color de error. */
  invalid?: boolean;
  /** Campo de contraseña con botón de ojo. */
  password?: boolean;
};

/** Campo blanco sin borde sobre el fondo azul pálido; foco en `accent`, error en `danger`. */
export function TextField({ invalid, password, onFocus, onBlur, ...rest }: Props) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(true);
  const revealInput = use(InputFocusContext);

  const borderColor = invalid ? theme.danger : focused ? theme.accent : 'transparent';

  return (
    <View style={[styles.box, { backgroundColor: theme.surface200, borderColor }]}>
      <TextInput
        placeholderTextColor={theme.inkMuted}
        secureTextEntry={password && hidden}
        onFocus={(e) => {
          setFocused(true);
          revealInput?.();
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
        style={[Type.body, styles.input, { color: theme.ink }]}
      />
      {password ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={hidden ? 'Mostrar contraseña' : 'Ocultar contraseña'}
          hitSlop={Space[3]}
          onPress={() => setHidden((h) => !h)}>
          <Icon name={hidden ? 'eye' : 'eyeOff'} size={20} color={theme.inkMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    height: ControlHeight,
    borderRadius: Radius.md,
    borderWidth: 2,
    paddingHorizontal: Space[4] - 2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space[2],
  },
  input: { flex: 1, height: '100%', paddingVertical: 0 },
});
