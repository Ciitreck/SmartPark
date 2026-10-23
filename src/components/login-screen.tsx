import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthLayout, AuthLink, FormError } from '@/components/auth-layout';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { CarMascot } from '@/components/ui/car-mascot';
import { TextField } from '@/components/ui/text-field';
import { Wordmark } from '@/components/ui/wordmark';
import { Space } from '@/constants/theme';
import { useAuth } from '@/context/auth';
import { useEntranceShake } from '@/hooks/use-entrance-shake';
import { login, type AuthField } from '@/lib/auth';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const { style, shake } = useEntranceShake();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [field, setField] = useState<AuthField | 'both' | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    const result = await login(email, password);
    setBusy(false);
    if (result.ok) {
      setError('');
      setField(null);
      signIn(result.user);
    } else {
      setError(result.error);
      setField(result.field ?? 'both');
      shake();
    }
  };

  const invalid = (f: AuthField) => field === f || field === 'both';

  return (
    <AuthLayout animatedStyle={style}>
      <View style={styles.hero}>
        <View style={styles.cars}>
          <CarMascot tone="mint" width={120} wave />
          <CarMascot tone="sky" width={96} flip delay={150} />
        </View>
        <Wordmark size={40} />
        <ThemedText color="inkMuted" align="center">
          Encuentra lugar sin dar vueltas
        </ThemedText>
      </View>

      <TextField
        placeholder="Correo electrónico"
        accessibilityLabel="Correo electrónico"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="next"
        value={email}
        onChangeText={setEmail}
        invalid={invalid('email')}
      />
      <TextField
        placeholder="Contraseña"
        accessibilityLabel="Contraseña"
        password
        autoComplete="current-password"
        returnKeyType="go"
        value={password}
        onChangeText={setPassword}
        onSubmitEditing={submit}
        invalid={invalid('password')}
      />

      <FormError message={error} />

      <Button title={busy ? 'Entrando…' : 'Entrar'} onPress={submit} disabled={busy} style={styles.button} />

      <AuthLink text="¿No tienes cuenta?" action="Únete" onPress={() => router.push('/register')} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: Space[2], marginBottom: Space[6] },
  cars: { flexDirection: 'row', alignItems: 'flex-end', gap: Space[2], marginBottom: Space[3] },
  button: { marginTop: Space[3] },
});
