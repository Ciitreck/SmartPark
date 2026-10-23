import { useEffect, useState } from 'react';
import { Animated } from 'react-native';

/**
 * Animación de entrada (aparece desde abajo) y "sacudida" para errores.
 * Los Animated.Value se crean con useState para que el React Compiler no los trate como refs.
 */
export function useEntranceShake() {
  const [appear] = useState(() => new Animated.Value(0));
  const [shakeX] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(appear, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [appear]);

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeX, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const style = {
    opacity: appear,
    transform: [
      { translateY: appear.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
      { translateX: shakeX },
    ],
  };

  return { style, shake };
}
