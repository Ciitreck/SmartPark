import Animated, { FadeInDown, ReduceMotion } from 'react-native-reanimated';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';

import { Colors } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = {
  /** Color del cuerpo: el carrito mascota es menta, su amigo es celeste. */
  tone?: 'mint' | 'sky';
  width?: number;
  /** Levanta un brazo para saludar. */
  wave?: boolean;
  /** Cara triste (sin lugares, error de conexión). */
  sad?: boolean;
  /** Mira hacia la izquierda. */
  flip?: boolean;
  delay?: number;
};

// Contornos y llantas siempre en azul marino, en ambos temas
const OUTLINE = Colors.light.ink;
const WHITE = '#FFFFFF';

/** Carrito plano visto de lado, con cara. Aparece con un rebote, una sola vez. */
export function CarMascot({ tone = 'mint', width = 140, wave, sad, flip, delay = 0 }: Props) {
  const theme = useTheme();
  const body = theme[tone];
  const height = width * (80 / 120);

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(12).reduceMotion(ReduceMotion.System)}
      style={{ width, height, transform: [{ scaleX: flip ? -1 : 1 }] }}
      accessible={false}>
      <Svg width={width} height={height} viewBox="0 0 120 80">
        {/* Brazo saludando */}
        {wave ? (
          <>
            <Path d="M30 38 L18 20" stroke={OUTLINE} strokeWidth={3} strokeLinecap="round" />
            <Circle cx={17} cy={18} r={4.5} fill={body} stroke={OUTLINE} strokeWidth={2.5} />
          </>
        ) : null}

        {/* Cabina y ventana */}
        <Path d="M30 36 L42 14 Q44 11 48 11 L78 11 Q82 11 84 14 L98 36 Z" fill={body} stroke={OUTLINE} strokeWidth={2.5} strokeLinejoin="round" />
        <Path d="M40 34 L48 19 Q49 17 51 17 L76 17 Q78 17 79 19 L88 34 Z" fill={WHITE} stroke={OUTLINE} strokeWidth={2} strokeLinejoin="round" />

        {/* Ojos */}
        <Ellipse cx={57} cy={26} rx={3.4} ry={4.4} fill={OUTLINE} />
        <Ellipse cx={71} cy={26} rx={3.4} ry={4.4} fill={OUTLINE} />
        <Circle cx={58.2} cy={24.4} r={1.2} fill={WHITE} />
        <Circle cx={72.2} cy={24.4} r={1.2} fill={WHITE} />

        {/* Carrocería */}
        <Rect x={8} y={34} width={104} height={28} rx={13} fill={body} stroke={OUTLINE} strokeWidth={2.5} />

        {/* Sonrisa */}
        <Path
          d={sad ? 'M56 52 Q64 45 72 52' : 'M56 46 Q64 54 72 46'}
          stroke={OUTLINE}
          strokeWidth={2.5}
          strokeLinecap="round"
          fill="none"
        />

        {/* Faro y calavera */}
        <Circle cx={104} cy={42} r={3.5} fill={WHITE} stroke={OUTLINE} strokeWidth={2} />
        <Rect x={10} y={40} width={6} height={5} rx={2} fill={WHITE} stroke={OUTLINE} strokeWidth={1.5} />

        {/* Llantas */}
        <Circle cx={33} cy={62} r={11} fill={OUTLINE} />
        <Circle cx={87} cy={62} r={11} fill={OUTLINE} />
        <Circle cx={33} cy={62} r={4} fill={WHITE} />
        <Circle cx={87} cy={62} r={4} fill={WHITE} />
      </Svg>
    </Animated.View>
  );
}
