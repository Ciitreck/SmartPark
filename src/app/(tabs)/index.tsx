import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ParkingMap from '@/components/parking-map';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset } from '@/constants/theme';
import { useAuth } from '@/context/auth';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ThemedView style={styles.flex}>
      <SafeAreaView style={styles.flex} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <ThemedText style={styles.hello} numberOfLines={1}>
            Hola, {user?.name.split(' ')[0]}
          </ThemedText>
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: BottomTabInset + 16 }}>
          <ParkingMap />
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8 },
  hello: { fontSize: 20, fontWeight: '700' },
});
