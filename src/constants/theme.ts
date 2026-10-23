/**
 * Tema de SmartPark, tomado del design system "SmartPark" (tokens.json).
 * Nunca escribas un hex en un componente: usa siempre estos valores.
 */

import '@/global.css';

import { Platform, type TextStyle } from 'react-native';

const light = {
  surface100: '#EAF3FD',
  surface200: '#FFFFFF',
  surface300: '#D9E7FA',
  asphalt: '#1B2B4B',
  laneLine: 'rgba(255,255,255,0.45)',
  line: '#D3E1F5',
  ink: '#1B2B4B',
  inkMuted: '#5B6B8C',
  inkOnDark: '#FFFFFF',
  inkOnBright: '#1B2B4B',
  brand: '#2A5BF0',
  brandPressed: '#1F47C9',
  brandSoft: '#DCE7FF',
  accent: '#2A5BF0',
  sky: '#4FC6EA',
  mint: '#2ED47A',
  spotFree: '#2ED47A',
  spotOccupied: '#D13A45',
  spotReserved: '#4FC6EA',
  spotOvertime: '#FF8A1F',
  spotOffline: '#77859F',
  danger: '#C42B37',
  success: '#2ED47A',
  scrim: 'rgba(27,43,75,0.45)',
};

export type Palette = typeof light;

const dark: Palette = {
  surface100: '#0B1230',
  surface200: '#141D42',
  surface300: '#1C2858',
  asphalt: '#1C2858',
  laneLine: 'rgba(255,255,255,0.35)',
  line: '#26326A',
  ink: '#EEF3FF',
  inkMuted: '#9AA8C7',
  inkOnDark: '#FFFFFF',
  inkOnBright: '#0B1230',
  brand: '#2A5BF0',
  brandPressed: '#1F47C9',
  brandSoft: '#1E2E73',
  accent: '#7EA2FF',
  sky: '#6AD3F2',
  mint: '#3BE08A',
  spotFree: '#3BE08A',
  spotOccupied: '#D13A45',
  spotReserved: '#6AD3F2',
  spotOvertime: '#FF9A3D',
  spotOffline: '#8A97B5',
  danger: '#FF8A94',
  success: '#3BE08A',
  scrim: 'rgba(0,0,0,0.6)',
};

export const Colors = { light, dark } as const;

export type ThemeColor = keyof Palette;

/** Cada peso es su propio archivo de fuente (se cargan en src/app/_layout.tsx). */
export const FontFamily = {
  wordmarkLight: 'Nunito_300Light',
  display: 'Nunito_800ExtraBold',
  wordmarkBold: 'Nunito_900Black',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemiBold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
} as const;

export const Type = {
  display: { fontFamily: FontFamily.display, fontSize: 32, lineHeight: 36 },
  title: { fontFamily: FontFamily.display, fontSize: 22, lineHeight: 28 },
  timer: { fontFamily: FontFamily.display, fontSize: 44, lineHeight: 48, fontVariant: ['tabular-nums'] },
  spotNumber: { fontFamily: FontFamily.display, fontSize: 13, lineHeight: 16 },
  subtitle: { fontFamily: FontFamily.sansSemiBold, fontSize: 17, lineHeight: 24 },
  body: { fontFamily: FontFamily.sans, fontSize: 15, lineHeight: 22 },
  label: { fontFamily: FontFamily.sansBold, fontSize: 14, lineHeight: 20 },
  caption: { fontFamily: FontFamily.sansMedium, fontSize: 12, lineHeight: 16 },
} satisfies Record<string, TextStyle>;

export type TypeVariant = keyof typeof Type;

/** Escala de 4 dp. */
export const Space = { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32, 12: 48 } as const;

export const Radius = { sm: 8, md: 16, lg: 28, pill: 999 } as const;

/** Sombras azuladas y suaves, nunca grises. */
export const Shadow = {
  card: { boxShadow: '0 4px 16px rgba(42,91,240,0.10)' },
  button: { boxShadow: '0 6px 16px rgba(42,91,240,0.30)' },
  sheet: { boxShadow: '0 -6px 24px rgba(27,43,75,0.14)' },
} as const;

/** Alto de botones e inputs (al alcance del pulgar). */
export const ControlHeight = 52;

/** Ancho máximo del contenido (web y tablets). */
export const MaxContentWidth = 560;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
