import { StyleSheet, View } from 'react-native';

import { SECTORS, type ParkingSpace } from '@/constants/parking-layout';
import { Radius, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { costFor, costReason, displayStatus, formatDuration, formatMoney } from '@/lib/pricing';

import { spotColors, STATUS_LABEL } from './parking-spot';
import { ThemedText } from './themed-text';
import { BottomSheet } from './ui/bottom-sheet';
import { Button } from './ui/button';

type Props = {
  space: ParkingSpace | null;
  now: number;
  myStayId: string | null;
  onClose: () => void;
  onPark: (id: string) => void;
  onToggle: (id: string) => void;
  onShowStay: () => void;
};

/** Detalle del cajón: número, estado, tiempo y costo acumulado. */
export function SpotSheet({ space, now, myStayId, onClose, onPark, onToggle, onShowStay }: Props) {
  return (
    <BottomSheet visible={!!space} onClose={onClose}>
      {space ? (
        <SheetContent
          space={space}
          now={now}
          myStayId={myStayId}
          onPark={onPark}
          onToggle={onToggle}
          onShowStay={onShowStay}
        />
      ) : null}
    </BottomSheet>
  );
}

function SheetContent({ space, now, myStayId, onPark, onToggle, onShowStay }: Omit<Props, 'space' | 'onClose'> & { space: ParkingSpace }) {
  const theme = useTheme();
  const status = displayStatus(space, now);
  const { fill, on } = spotColors(status, theme);
  const sector = SECTORS.find((s) => s.id === space.sector);
  const mine = myStayId === space.id;
  const elapsed = space.since !== undefined ? now - space.since : 0;
  const hasCar = status === 'ocupado' || status === 'excedido';

  return (
    <>
      <View style={styles.header}>
        <View style={styles.flex}>
          <ThemedText variant="title">Cajón {space.id}</ThemedText>
          <ThemedText variant="caption" color="inkMuted">
            {sector?.name} · {sector?.area}
          </ThemedText>
        </View>
        <View
          style={[
            styles.pill,
            status === 'sinSenal'
              ? { borderWidth: 1.5, borderStyle: 'dashed', borderColor: theme.spotOffline }
              : { backgroundColor: fill },
          ]}>
          <ThemedText variant="label" style={{ color: status === 'sinSenal' ? theme.ink : on }}>
            {mine ? 'Tu lugar' : STATUS_LABEL[status]}
          </ThemedText>
        </View>
      </View>

      {hasCar ? (
        <View style={[styles.details, { backgroundColor: theme.surface100 }]}>
          <Row label="Tiempo" value={formatDuration(elapsed)} />
          <Row label="Costo acumulado" value={formatMoney(costFor(elapsed))} />
          <ThemedText variant="caption" color="inkMuted">
            {costReason(elapsed)}
          </ThemedText>
        </View>
      ) : null}

      {status === 'libre' ? (
        <ThemedText color="inkMuted">¡Está libre! Las primeras 2 h son gratis.</ThemedText>
      ) : null}
      {status === 'reservado' ? (
        <ThemedText color="inkMuted">
          {space.reservedFor === 'discapacidad'
            ? 'Reservado para personas con discapacidad.'
            : 'Cajón preferente, reservado por el establecimiento.'}
        </ThemedText>
      ) : null}
      {status === 'sinSenal' ? (
        <ThemedText color="inkMuted">Este cajón no está enviando datos. Revisa su sensor.</ThemedText>
      ) : null}

      <View style={styles.actions}>
        {status === 'libre' && !myStayId ? (
          <Button title="Estacionarme aquí" icon="car" onPress={() => onPark(space.id)} />
        ) : null}
        {status === 'libre' && myStayId ? (
          <ThemedText variant="caption" color="inkMuted" align="center">
            Ya estás estacionado en {myStayId}.
          </ThemedText>
        ) : null}
        {mine ? <Button title="Ver mi estancia" icon="clock" onPress={onShowStay} /> : null}

        {/* Simulación mientras llegan los sensores */}
        {!mine && (space.status === 'libre' || space.status === 'ocupado') ? (
          <>
            <Button
              variant="secondary"
              title={space.status === 'libre' ? 'Marcar como ocupado' : 'Marcar como libre'}
              onPress={() => onToggle(space.id)}
            />
            <ThemedText variant="caption" color="inkMuted" align="center">
              Simulación: los sensores llegarán después.
            </ThemedText>
          </>
        ) : null}
      </View>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <ThemedText color="inkMuted">{label}</ThemedText>
      <ThemedText variant="subtitle" style={styles.tabular}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: Space[3] },
  pill: { borderRadius: Radius.pill, paddingHorizontal: Space[3], paddingVertical: Space[1] + 2 },
  details: { borderRadius: Radius.md, padding: Space[4], gap: Space[2] },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tabular: { fontVariant: ['tabular-nums'] },
  actions: { gap: Space[3] },
});
