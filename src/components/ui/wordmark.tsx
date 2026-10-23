import { Text } from 'react-native';

import { FontFamily } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Props = { size?: number; onBrand?: boolean };

/** Logotipo: "smart" en Nunito Light + "Park" en Nunito Black. */
export function Wordmark({ size = 40, onBrand }: Props) {
  const theme = useTheme();
  // En tema oscuro `accent` es el azul aclarado, para que el logo contraste sobre azul noche
  const color = onBrand ? theme.inkOnDark : theme.accent;
  return (
    <Text accessibilityRole="header" accessibilityLabel="SmartPark" style={{ color, fontSize: size, lineHeight: size * 1.1, textAlign: 'center' }}>
      <Text style={{ fontFamily: FontFamily.wordmarkLight }}>smart</Text>
      <Text style={{ fontFamily: FontFamily.wordmarkBold }}>Park</Text>
    </Text>
  );
}
