import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text } from 'react-native';

import { AuthInput, AuthLayout, authStyles } from '@/components/auth-layout';
import { ThemedText } from '@/components/themed-text';
import { useAuth } from '@/context/auth';
import { useEntranceShake } from '@/hooks/use-entrance-shake';
import { register } from '@/lib/auth';

export default function RegisterScreen() {
  const { signIn } = useAuth();
  const { style, shake } = useEntranceShake();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    const result = await register(name, email, password, confirm);
    setBusy(false);
    if (result.ok) {
      setError('');
      signIn(result.user); // entra directo a la app
    } else {
      setError(result.error);
      shake();
    }
  };

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/login'));

  return (
    <AuthLayout animatedStyle={style}>
      <ThemedText style={authStyles.logo}>🚗 Crear cuenta</ThemedText>
      <ThemedText style={authStyles.subtitle}>Regístrate para usar Smart Park</ThemedText>

      <AuthInput placeholder="Nombre" autoComplete="name" value={name} onChangeText={setName} />
      <AuthInput
        placeholder="Correo electrónico"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        value={email}
        onChangeText={setEmail}
      />
      <AuthInput
        placeholder="Contraseña (mínimo 6 caracteres)"
        secureTextEntry
        autoComplete="new-password"
        value={password}
        onChangeText={setPassword}
      />
      <AuthInput
        placeholder="Confirmar contraseña"
        secureTextEntry
        autoComplete="new-password"
        returnKeyType="go"
        value={confirm}
        onChangeText={setConfirm}
        onSubmitEditing={submit}
      />

      {error ? <Text style={authStyles.error}>{error}</Text> : null}

      <Pressable
        onPress={submit}
        disabled={busy}
        style={({ pressed }) => [
          authStyles.button,
          { backgroundColor: '#43A047', opacity: pressed || busy ? 0.8 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] },
        ]}>
        <Text style={authStyles.buttonText}>{busy ? 'Creando cuenta…' : 'Registrarme'}</Text>
      </Pressable>

      <Pressable onPress={goBack} style={authStyles.linkWrap}>
        <ThemedText style={authStyles.link}>¿Ya tienes cuenta? Inicia sesión</ThemedText>
      </Pressable>
    </AuthLayout>
  );
}
