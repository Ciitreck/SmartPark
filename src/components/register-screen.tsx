import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthLayout, AuthLink, FormError } from '@/components/auth-layout';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { CarMascot } from '@/components/ui/car-mascot';
import { TextField } from '@/components/ui/text-field';
import { Space } from '@/constants/theme';
import { useAuth } from '@/context/auth';
import { useEntranceShake } from '@/hooks/use-entrance-shake';
import { register, type AuthField } from '@/lib/auth';

export default function RegisterScreen() {
  const { signIn } = useAuth();
  const { style, shake } = useEntranceShake();

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [field, setField] = useState<AuthField | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    const result = await register(name, email, password, confirm);
    setBusy(false);
    if (result.ok) {
      setError('');
      setField(null);
      signIn(result.user); // entra directo a la app
    } else {
      setError(result.error);
      setField(result.field ?? null);
      shake();
    }
  };

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/login'));

  return (
    <AuthLayout animatedStyle={style} onBack={goBack}>
      <View style={styles.hero}>
        <ThemedText variant="display" align="center" accessibilityRole="header">
          Únete a SmartPark
        </ThemedText>
        <CarMascot tone="mint" width={130} wave />
      </View>

      <TextField
        placeholder="Correo electrónico"
        accessibilityLabel="Correo electrónico"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        value={email}
        onChangeText={setEmail}
        invalid={field === 'email'}
      />
      <TextField
        placeholder="Nombre"
        accessibilityLabel="Nombre"
        autoComplete="name"
        value={name}
        onChangeText={setName}
        invalid={field === 'name'}
      />
      <TextField
        placeholder="Contraseña (mínimo 6 caracteres)"
        accessibilityLabel="Contraseña"
        password
        autoComplete="new-password"
        value={password}
        onChangeText={setPassword}
        invalid={field === 'password'}
      />
      <TextField
        placeholder="Confirmar contraseña"
        accessibilityLabel="Confirmar contraseña"
        password
        autoComplete="new-password"
        returnKeyType="go"
        value={confirm}
        onChangeText={setConfirm}
        onSubmitEditing={submit}
        invalid={field === 'confirm'}
      />

      <FormError message={error} />

      <Button title={busy ? 'Creando tu cuenta…' : 'Crear cuenta'} onPress={submit} disabled={busy} style={styles.button} />

      <AuthLink text="¿Ya tienes cuenta?" action="Entra" onPress={goBack} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: Space[6], marginBottom: Space[6] },
  button: { marginTop: Space[3] },
});
