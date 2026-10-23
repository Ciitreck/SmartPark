import { kv } from '@/lib/kv';

import { initialSpaces, type ParkingSpace } from '@/constants/parking-layout';

const STATE_KEY = 'smartpark.state.v2';

/** Estancia del conductor en este teléfono. */
export type Stay = { spotId: string; since: number };

/** Estancia ya terminada (para los cobros del panel de empresa). */
export type FinishedStay = { spotId: string; start: number; end: number; cost: number };

export type ParkingState = {
  spaces: ParkingSpace[];
  myStay: Stay | null;
  history: FinishedStay[];
};

/** Estado guardado; si no hay nada (o está dañado) usa los datos de ejemplo. */
export function loadState(): ParkingState {
  const fresh: ParkingState = { spaces: initialSpaces(Date.now()), myStay: null, history: [] };
  try {
    const raw = kv.get(STATE_KEY);
    if (!raw) return fresh;
    const saved = JSON.parse(raw) as Partial<ParkingState>;
    if (!Array.isArray(saved.spaces) || saved.spaces.length !== fresh.spaces.length) return fresh;
    return { spaces: saved.spaces, myStay: saved.myStay ?? null, history: saved.history ?? [] };
  } catch {
    return fresh;
  }
}

export function saveState(state: ParkingState) {
  try {
    kv.set(STATE_KEY, JSON.stringify(state));
  } catch {
    // Si no se puede guardar, la app sigue funcionando con lo que hay en memoria
  }
}
