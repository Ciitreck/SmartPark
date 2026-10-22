import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import LoginScreen from '@/components/login-screen';
import ParkingMap from '@/components/parking-map';
import RegisterScreen from '@/components/register-screen';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset } from '@/constants/theme';

export default function HomeScreen() {
  const [user, setUser] = useState<string | null>(null);
  const [screen, setScreen] = useState<'login' | 'register'>('login');

  if (!user) {
    return screen === 'login' ? (
      <LoginScreen onLogin={setUser} onRegister={() => setScreen('register')} />
    ) : (
      <RegisterScreen onRegistered={setUser} onBack={() => setScreen('login')} />
    );
  }

  const logout = () => {
    setUser(null);
    setScreen('login');
  };

  return (
    <ThemedView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <ThemedText style={styles.hello}>Hola, {user}</ThemedText>
          <Pressable onPress={logout} style={styles.logout}>
            <Text style={styles.logoutText}>Salir</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: BottomTabInset + 16 }}>
          <ParkingMap />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  hello: { fontSize: 20, fontWeight: '700' },
  logout: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: '#EF5350' },
  logoutText: { color: 'white', fontWeight: '700' },
});