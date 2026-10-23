import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import ParkingMap from '@/components/parking-map';
import { SpotSheet } from '@/components/spot-sheet';
import { ThemedText } from '@/components/themed-text';
import { AvailabilityCard } from '@/components/ui/availability-card';
import { Card } from '@/components/ui/card';
import { CarMascot } from '@/components/ui/car-mascot';
import { Icon } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { SectorChip } from '@/components/ui/sector-chip';
import { SECTORS } from '@/constants/parking-layout';
import { Radius, Space } from '@/constants/theme';
import { useAuth } from '@/context/auth';
import { useParking } from '@/context/parking';
import { useNow } from '@/hooks/use-now';
import { useTheme } from '@/hooks/use-theme';
import { formatDuration } from '@/lib/pricing';

export default function PlacesScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const { spaces, myStay, parkHere, toggleSpot } = useParking();
  const now = useNow(15_000);

  const freeIn = (sectorId: string) => spaces.filter((s) => s.sector === sectorId && s.status === 'libre').length;

  // Al abrir, muestra el sector con más lugares libres
  const [sectorId, setSectorId] = useState(() =>
    SECTORS.reduce((best, s) => (freeIn(s.id) > freeIn(best.id) ? s : best), SECTORS[0]).id
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sector = SECTORS.find((s) => s.id === sectorId) ?? SECTORS[0];
  const sectorSpaces = spaces.filter((s) => s.sector === sector.id);
  const free = freeIn(sector.id);
  const totalFree = spaces.filter((s) => s.status === 'libre').length;
  const selected = spaces.find((s) => s.id === selectedId) ?? null;

  const title =
    free > 0
      ? `¡Hay ${free} ${free === 1 ? 'lugar libre' : 'lugares libres'} en ${sector.name}!`
      : `${sector.name} está lleno`;

  return (
    <Screen eyebrow={`Hola, ${user?.name.split(' ')[0] ?? ''}`} title={title}>
      {myStay ? (
        <Pressable onPress={() => router.navigate('/stay')} accessibilityRole="button">
          <View style={[styles.stayBanner, { backgroundColor: theme.brandSoft }]}>
            <Icon name="pin" size={20} color={theme.accent} />
            <ThemedText variant="label" style={styles.flex}>
              Estás en {myStay.spotId} · {formatDuration(now - myStay.since)}
            </ThemedText>
            <Icon name="chevronRight" size={20} color={theme.accent} />
          </View>
        </Pressable>
      ) : null}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} accessibilityRole="tablist">
        {SECTORS.map((s) => (
          <SectorChip key={s.id} label={s.id} free={freeIn(s.id)} active={s.id === sector.id} onPress={() => setSectorId(s.id)} />
        ))}
      </ScrollView>

      <AvailabilityCard
        title={sector.name}
        subtitle={`${sector.area} · ${totalFree} libres en todo el estacionamiento`}
        free={free}
        total={sectorSpaces.length}
      />

      {totalFree === 0 ? (
        <Card style={styles.empty}>
          <CarMascot tone="sky" width={120} sad />
          <ThemedText variant="subtitle" align="center">
            No hay lugares por ahora
          </ThemedText>
          <ThemedText color="inkMuted" align="center">
            En cuanto se libere uno, lo verás aquí.
          </ThemedText>
        </Card>
      ) : null}

      <ParkingMap
        spaces={sectorSpaces}
        now={now}
        selectedId={selectedId}
        myStayId={myStay?.spotId ?? null}
        onSelect={setSelectedId}
      />

      <SpotSheet
        space={selected}
        now={now}
        myStayId={myStay?.spotId ?? null}
        onClose={() => setSelectedId(null)}
        onPark={(id) => {
          parkHere(id);
          setSelectedId(null);
          router.navigate('/stay');
        }}
        onToggle={toggleSpot}
        onShowStay={() => {
          setSelectedId(null);
          router.navigate('/stay');
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  chips: { gap: Space[2] },
  stayBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Space[2],
    borderRadius: Radius.md,
    paddingHorizontal: Space[4],
    paddingVertical: Space[3],
  },
  empty: { alignItems: 'center', paddingVertical: Space[6] },
});
