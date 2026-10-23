import { StyleSheet, Text, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { Wordmark } from '@/components/ui/wordmark';
import { Space, Type } from '@/constants/theme';
import { useAuth } from '@/context/auth';
import { useTheme } from '@/hooks/use-theme';
import { formatDuration, formatMoney, FREE_TIME_MS, PRICE_PER_HOUR } from '@/lib/pricing';

export default function AccountScreen() {
  const theme = useTheme();
  const { user, signOut } = useAuth();

  return (
    <Screen title="Mi cuenta">
      <Card style={styles.profile}>
        <View style={[styles.avatar, { backgroundColor: theme.brand }]}>
          <Text style={[Type.title, { color: theme.inkOnDark }]}>{user?.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.flex}>
          <ThemedText variant="subtitle" numberOfLines={1}>
            {user?.name}
          </ThemedText>
          <ThemedText color="inkMuted" numberOfLines={1}>
            {user?.email}
          </ThemedText>
        </View>
      </Card>

      <Card>
        <View style={styles.row}>
          <Icon name="cash" size={20} color={theme.accent} />
          <ThemedText variant="subtitle">Tarifa</ThemedText>
        </View>
        <ThemedText color="inkMuted">
          Las primeras {formatDuration(FREE_TIME_MS)} son gratis. Después, {formatMoney(PRICE_PER_HOUR)} por hora o fracción.
        </ThemedText>
      </Card>

      <Button title="Cerrar sesión" variant="danger" icon="logout" onPress={signOut} />

      <View style={styles.footer}>
        <Wordmark size={22} />
        <ThemedText variant="caption" color="inkMuted">
          Encuentra lugar sin dar vueltas
        </ThemedText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: Space[4] },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: Space[2] },
  footer: { alignItems: 'center', gap: Space[1], marginTop: Space[4] },
});
