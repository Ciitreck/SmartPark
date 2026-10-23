import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { AvailabilityCard, OccupancyBar } from '@/components/ui/availability-card';
import { Card } from '@/components/ui/card';
import { Icon, type IconName } from '@/components/ui/icon';
import { Screen } from '@/components/ui/screen';
import { SECTORS } from '@/constants/parking-layout';
import { Space, type ThemeColor } from '@/constants/theme';
import { useParking } from '@/context/parking';
import { useNow } from '@/hooks/use-now';
import { useTheme } from '@/hooks/use-theme';
import { costFor, displayStatus, formatDuration, formatMoney } from '@/lib/pricing';

/** Panel de empresa: ocupación por área, tiempo de estancia y cobros del día. */
export default function PanelScreen() {
  const { spaces, history } = useParking();
  const now = useNow(30_000);

  const usable = spaces.filter((s) => s.status !== 'reservado' && s.status !== 'sinSenal');
  const occupied = spaces.filter((s) => s.status === 'ocupado' && s.since !== undefined);
  const free = spaces.filter((s) => s.status === 'libre').length;
  const overtime = spaces.filter((s) => displayStatus(s, now) === 'excedido').length;
  const offline = spaces.filter((s) => s.status === 'sinSenal').length;

  const avgStay = occupied.length
    ? occupied.reduce((sum, s) => sum + (now - (s.since ?? now)), 0) / occupied.length
    : 0;
  const pending = occupied.reduce((sum, s) => sum + costFor(now - (s.since ?? now)), 0);

  const startOfDay = new Date(now).setHours(0, 0, 0, 0);
  const today = history.filter((h) => h.end >= startOfDay);
  const collected = today.reduce((sum, h) => sum + h.cost, 0);

  return (
    <Screen eyebrow="Empresa" title="Panel del estacionamiento">
      <Card>
        <View style={styles.between}>
          <ThemedText variant="subtitle">Ocupación general</ThemedText>
          <ThemedText variant="label" style={styles.tabular}>
            {usable.length ? Math.round((occupied.length / usable.length) * 100) : 0}%
          </ThemedText>
        </View>
        <OccupancyBar value={usable.length ? occupied.length / usable.length : 0} />
        <ThemedText variant="caption" color="inkMuted">
          {occupied.length} ocupados · {free} libres · {spaces.length} cajones en total
        </ThemedText>
      </Card>

      <View style={styles.grid}>
        <Stat icon="clock" label="Tiempo promedio" value={formatDuration(avgStay)} />
        <Stat icon="cash" label="Cobros del día" value={formatMoney(collected)} hint={`${today.length} salidas`} />
        <Stat icon="car" label="Por cobrar ahora" value={formatMoney(pending)} hint={`${overtime} ${overtime === 1 ? 'excedido' : 'excedidos'}`} />
        <Stat icon="offline" label="Sin señal" value={`${offline} cajones`} hint="Revisa sus sensores" tint="spotOffline" />
      </View>

      <View style={styles.section}>
        <ThemedText variant="subtitle">Por área</ThemedText>
        {SECTORS.map((sector) => {
          const inSector = spaces.filter((s) => s.sector === sector.id);
          return (
            <AvailabilityCard
              key={sector.id}
              title={sector.name}
              subtitle={sector.area}
              free={inSector.filter((s) => s.status === 'libre').length}
              total={inSector.length}
            />
          );
        })}
      </View>
    </Screen>
  );
}

function Stat({
  icon,
  label,
  value,
  hint,
  tint = 'accent',
}: {
  icon: IconName;
  label: string;
  value: string;
  hint?: string;
  tint?: ThemeColor;
}) {
  const theme = useTheme();
  return (
    <Card style={styles.stat}>
      <Icon name={icon} size={20} color={theme[tint]} />
      <ThemedText variant="caption" color="inkMuted">
        {label}
      </ThemedText>
      <ThemedText variant="subtitle" style={styles.tabular} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </ThemedText>
      {hint ? (
        <ThemedText variant="caption" color="inkMuted" numberOfLines={1}>
          {hint}
        </ThemedText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tabular: { fontVariant: ['tabular-nums'] },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Space[3] },
  stat: { flexBasis: '45%', flexGrow: 1, gap: Space[1] },
  section: { gap: Space[3] },
});
