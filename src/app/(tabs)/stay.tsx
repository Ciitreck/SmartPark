import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CarMascot } from '@/components/ui/car-mascot';
import { Screen } from '@/components/ui/screen';
import { StayTimer } from '@/components/ui/stay-timer';
import { SECTORS } from '@/constants/parking-layout';
import { Space } from '@/constants/theme';
import { useParking } from '@/context/parking';
import { useNow } from '@/hooks/use-now';
import type { FinishedStay } from '@/lib/parking-store';
import { formatDuration, formatMoney, FREE_TIME_MS, PRICE_PER_HOUR } from '@/lib/pricing';

export default function StayScreen() {
  const { spaces, myStay, leaveSpot } = useParking();
  const now = useNow(1000);
  const [receipt, setReceipt] = useState<FinishedStay | null>(null);

  if (!myStay) {
    return (
      <Screen title="Tu estancia">
        {receipt ? (
          <Card style={styles.center}>
            <CarMascot width={140} wave />
            <ThemedText variant="subtitle" align="center">
              ¡Buen viaje!
            </ThemedText>
            <ThemedText color="inkMuted" align="center">
              Estuviste {formatDuration(receipt.end - receipt.start)} en {receipt.spotId}.
            </ThemedText>
            <ThemedText variant="title" align="center" style={styles.tabular}>
              {formatMoney(receipt.cost)}
            </ThemedText>
          </Card>
        ) : (
          <Card style={styles.center}>
            <CarMascot width={140} />
            <ThemedText variant="subtitle" align="center">
              Aún no te estacionas
            </ThemedText>
            <ThemedText color="inkMuted" align="center">
              Elige un cajón libre en el mapa y aquí verás cuánto llevas.
            </ThemedText>
          </Card>
        )}
        <Button title="Buscar lugar" icon="parking" onPress={() => router.navigate('/')} />
        <Tariff />
      </Screen>
    );
  }

  const spot = spaces.find((s) => s.id === myStay.spotId);
  const sector = SECTORS.find((s) => s.id === spot?.sector);

  return (
    <Screen eyebrow={`${sector?.name ?? ''} · ${sector?.area ?? ''}`} title={`Cajón ${myStay.spotId}`}>
      <Card style={styles.timerCard}>
        <StayTimer elapsed={now - myStay.since} />
      </Card>
      <Button
        title="Salir del cajón"
        icon="car"
        onPress={() => {
          setReceipt(leaveSpot());
        }}
      />
      <Tariff />
    </Screen>
  );
}

function Tariff() {
  return (
    <View style={styles.tariff}>
      <ThemedText variant="caption" color="inkMuted" align="center">
        Tarifa: primeras {formatDuration(FREE_TIME_MS)} gratis · después {formatMoney(PRICE_PER_HOUR)} por hora o fracción
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { alignItems: 'center', paddingVertical: Space[8], gap: Space[2] },
  timerCard: { padding: Space[2] },
  tabular: { fontVariant: ['tabular-nums'], marginTop: Space[2] },
  tariff: { paddingHorizontal: Space[4] },
});
