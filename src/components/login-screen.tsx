import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, TextInput, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { validateUser } from '@/constants/users';

type Props = {
  onLogin: (name: string) => void;
  onRegister: () => void;
};

export default function LoginScreen({ onLogin, onRegister }: Props) {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const appear = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(appear, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, [appear]);

  const runShake = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 6, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const submit = () => {
    const user = validateUser(username, password);
    if (user) {
      setError('');
      onLogin(user.name);
    } else {
      setError('Usuario o contraseña incorrectos');
      runShake();
    }
  };

  const inputStyle = [styles.input, { backgroundColor: colors.backgroundElement, color: colors.text }];

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Animated.View
            style={[
              styles.card,
              {
                opacity: appear,
                transform: [
                  { translateY: appear.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) },
                  { translateX: shake },
                ],
              },
            ]}>
            <ThemedText style={styles.logo}>🚗 Smart Park</ThemedText>
            <ThemedText style={styles.subtitle}>Inicia sesión para ver el estacionamiento</ThemedText>

            <TextInput
              style={inputStyle}
              placeholder="Usuario"
              placeholderTextColor="#888"
              autoCapitalize="none"
              autoCorrect={false}
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={inputStyle}
              placeholder="Contraseña"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onSubmitEditing={submit}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Pressable
              onPress={submit}
              style={({ pressed }) => [styles.button, { opacity: pressed ? 0.8 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
              <Text style={styles.buttonText}>Entrar</Text>
            </Pressable>

            <Pressable onPress={onRegister} style={styles.linkWrap}>
              <ThemedText style={styles.link}>¿No tienes cuenta? Regístrate</ThemedText>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  card: { gap: 14 },
  logo: { fontSize: 34, fontWeight: '800', textAlign: 'center' },
  subtitle: { textAlign: 'center', opacity: 0.7, marginBottom: 12 },
  input: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 },
  error: { color: '#EF5350', textAlign: 'center', fontWeight: '600' },
  button: { backgroundColor: '#1E88E5', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 4 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '700' },
  linkWrap: { alignItems: 'center', paddingVertical: 8 },
  link: { fontWeight: '600', opacity: 0.8 },
});