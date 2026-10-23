import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { SPOTS_PER_ROW, type ParkingSpace, type SpotStatus } from '@/constants/parking-layout';
import { MaxContentWidth, Radius, Space } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { displayStatus } from '@/lib/pricing';

import { ThemedText } from './themed-text';
import ParkingSpot, { spotColors, STATUS_LABEL } from './parking-spot';

const GAP = Space[1];
const PADDING = Space[4];

type Props = {
  spaces: ParkingSpace[];
  now: number;
  selectedId: string | null;
  myStayId: string | null;
  onSelect: (id: string) => void;
};

/** Cuadrícula de un sector, como elegir asiento en el cine: dos filas enfrentadas y un carril. */
export default function ParkingMap({ spaces, now, selectedId, myStayId, onSelect }: Props) {
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  const mapWidth = Math.min(screenWidth, MaxContentWidth) - Space[6] * 2;
  const spotWidth = Math.floor((mapWidth - PADDING * 2 - GAP * (SPOTS_PER_ROW - 1)) / SPOTS_PER_ROW);
  const spotHeight = Math.max(64, Math.round(spotWidth * 1.3));

  const rows = ([1, 2] as const).map((row) =>
    spaces.filter((s) => s.row === row).sort((a, b) => a.position - b.position)
  );

  const renderRow = (items: ParkingSpace[]) => (
    <View style={styles.row}>
      {items.map((space) => (
        <ParkingSpot
          key={space.id}
          space={space}
          status={displayStatus(space, now)}
          width={spotWidth}
          height={spotHeight}
          selected={selectedId === space.id}
          mine={myStayId === space.id}
          onPress={() => onSelect(space.id)}
        />
      ))}
    </View>
  );

  return (
    <View style={{ gap: Space[3] }}>
      <View style={[styles.map, { backgroundColor: theme.asphalt }]}>
        {renderRow(rows[0])}
        <Lane color={theme.laneLine} />
        {renderRow(rows[1])}
      </View>
      <Legend />
    </View>
  );
}

/** Carril con guiones `lane-line`. */
function Lane({ color }: { color: string }) {
  return (
    <View style={styles.lane} accessible={false}>
      {Array.from({ length: 9 }, (_, i) => (
        <View key={i} style={[styles.dash, { backgroundColor: color }]} />
      ))}
    </View>
  );
}

const LEGEND: SpotStatus[] = ['libre', 'ocupado', 'reservado', 'excedido', 'sinSenal'];

function Legend() {
  const theme = useTheme();
  return (
    <View style={styles.legend}>
      {LEGEND.map((status) => {
        const { fill } = spotColors(status, theme);
        return (
          <View key={status} style={styles.legendItem}>
            <View
              style={[
                styles.swatch,
                status === 'sinSenal'
                  ? { borderWidth: 1.5, borderStyle: 'dashed', borderColor: theme.spotOffline }
                  : { backgroundColor: fill },
              ]}
            />
            <ThemedText variant="caption" color="inkMuted">
              {STATUS_LABEL[status]}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  map: { borderRadius: Radius.md, padding: PADDING },
  row: { flexDirection: 'row', justifyContent: 'center', gap: GAP },
  lane: {
    height: Space[6] + Space[4],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Space[2],
  },
  dash: { width: 16, height: 3, borderRadius: 2 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: Space[4], rowGap: Space[2] },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: Space[1] + 2 },
  swatch: { width: 12, height: 12, borderRadius: 3 },
});
