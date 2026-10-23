import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/auth';

export default function AccountScreen() {
  const { user, signOut } = useAuth();

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.content} edges={['top', 'left', 'right']}>
        <ThemedText style={styles.title}>Mi cuenta</ThemedText>

        <ThemedView type="backgroundElement" style={styles.card}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.flex}>
            <ThemedText style={styles.name} numberOfLines={1}>
              {user?.name}
            </ThemedText>
            <ThemedText themeColor="textSecondary" numberOfLines={1}>
              {user?.email}
            </ThemedText>
          </View>
        </ThemedView>

        <Pressable
          onPress={signOut}
          style={({ pressed }) => [styles.logout, { opacity: pressed ? 0.8 : 1 }]}>
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flex: 1, padding: 20, gap: 20 },
  title: { fontSize: 28, fontWeight: '800', lineHeight: 36 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 16 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1E88E5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: 'white', fontSize: 22, fontWeight: '800' },
  name: { fontSize: 18, fontWeight: '700' },
  logout: { backgroundColor: '#EF5350', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  logoutText: { color: 'white', fontSize: 16, fontWeight: '700' },
});
