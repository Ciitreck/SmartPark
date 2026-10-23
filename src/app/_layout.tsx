import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Nunito_300Light, Nunito_800ExtraBold, Nunito_900Black, useFonts } from '@expo-google-fonts/nunito';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { Colors } from '@/constants/theme';
import { AuthProvider, useAuth } from '@/context/auth';
import { ParkingProvider } from '@/context/parking';
import { useColorScheme } from '@/hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <AuthProvider>
      <ParkingProvider>
        <RootNavigator />
      </ParkingProvider>
    </AuthProvider>
  );
}

function RootNavigator() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const { user, initializing } = useAuth();
  const [fontsLoaded, fontError] = useFonts({
    Nunito_300Light,
    Nunito_800ExtraBold,
    Nunito_900Black,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  // Mientras Firebase revisa la sesión y cargan las fuentes se queda la pantalla de inicio nativa
  if (initializing || (!fontsLoaded && !fontError)) return null;

  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const colors = Colors[scheme];
  const navTheme = {
    ...base,
    colors: { ...base.colors, background: colors.surface100, card: colors.surface200, text: colors.ink, primary: colors.brand },
  };

  return (
    <ThemeProvider value={navTheme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.surface100 } }}>
        {/* Solo con sesión iniciada */}
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        {/* Solo sin sesión */}
        <Stack.Protected guard={!user}>
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
        </Stack.Protected>
      </Stack>
      <AnimatedSplashOverlay />
    </ThemeProvider>
  );
}
