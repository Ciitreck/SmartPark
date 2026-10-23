import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text } from 'react-native';

import { AuthInput, AuthLayout, authStyles } from '@/components/auth-layout';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/auth';
import { useEntranceShake } from '@/hooks/use-entrance-shake';
import { login } from '@/lib/auth';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { style, shake } = useEntranceShake();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    const result = await login(email, password);
    setBusy(false);
    if (result.ok) {
      setError('');
      signIn(result.user);
    } else {
      setError(result.error);
      shake();
    }
  };

  return (
    <AuthLayout animatedStyle={style}>
      <ThemedText style={[authStyles.logo, { fontSize: 34 }]}>🚗 Smart Park</ThemedText>
      <ThemedText style={authStyles.subtitle}>Inicia sesión para ver el estacionamiento</ThemedText>

      <AuthInput
        placeholder="Correo electrónico"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="next"
        value={email}
        onChangeText={setEmail}
      />
      <AuthInput
        placeholder="Contraseña"
        secureTextEntry
        autoComplete="current-password"
        returnKeyType="go"
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={submit}
      />

      {error ? <Text style={authStyles.error}>{error}</Text> : null}

      <Pressable
        onPress={submit}
        disabled={busy}
        style={({ pressed }) => [
          authStyles.button,
          { backgroundColor: '#1E88E5', opacity: pressed || busy ? 0.8 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
        ]}>
        <Text style={authStyles.buttonText}>{busy ? 'Entrando…' : 'Entrar'}</Text>
      </Pressable>

      <Pressable onPress={() => router.push('/register')} style={authStyles.linkWrap}>
        <ThemedText style={authStyles.link}>¿No tienes cuenta? Regístrate</ThemedText>
      </Pressable>
    </AuthLayout>
  );
}
