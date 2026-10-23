import Storage from 'expo-sqlite/kv-store';

import { parkingLayout, type ParkingSpace } from '@/constants/parking-layout';

const SPACES_KEY = 'smartpark.spaces';

/** Estado guardado de los cajones; si no hay nada guardado usa el layout inicial. */
export function loadSpaces(): ParkingSpace[] {
  try {
    const raw = Storage.getItemSync(SPACES_KEY);
    if (!raw) return parkingLayout;
    const saved = JSON.parse(raw) as Record<string, boolean>;
    return parkingLayout.map((s) => (s.id in saved ? { ...s, isAvailable: saved[s.id] } : s));
  } catch {
    return parkingLayout;
  }
}

export function saveSpaces(spaces: ParkingSpace[]) {
  const map = Object.fromEntries(spaces.map((s) => [s.id, s.isAvailable]));
  Storage.setItemSync(SPACES_KEY, JSON.stringify(map));
}
