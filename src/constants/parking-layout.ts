/** Estado guardado de un cajón. "excedido" no se guarda: se calcula con el tiempo. */
export type StoredStatus = 'libre' | 'ocupado' | 'reservado' | 'sinSenal';

/** Estado que se dibuja en el mapa. */
export type SpotStatus = StoredStatus | 'excedido';

export type ParkingSpace = {
  /** Número visible del cajón, p. ej. "A-04" */
  id: string;
  sector: string;
  /** 1 = fila de arriba del carril, 2 = fila de abajo */
  row: 1 | 2;
  position: number;
  status: StoredStatus;
  /** Momento (ms) en que se ocupó, si está ocupado */
  since?: number;
  /** Ícono del cajón reservado */
  reservedFor?: 'discapacidad' | 'preferente';
};

export type Sector = { id: string; name: string; area: string };

export const SECTORS: Sector[] = [
  { id: 'A', name: 'Sector A', area: 'Nivel 1' },
  { id: 'B', name: 'Sector B', area: 'Nivel 1' },
  { id: 'C', name: 'Sector C', area: 'Área Norte' },
];

export const SPOTS_PER_ROW = 5;

/** Datos de ejemplo mientras llegan los sensores (Arduino). `m` = minutos ocupado. */
type Seed = { s: StoredStatus; m?: number; r?: ParkingSpace['reservedFor'] };

const SEED: Record<string, Seed[]> = {
  A: [
    { s: 'reservado', r: 'discapacidad' }, { s: 'libre' }, { s: 'ocupado', m: 35 }, { s: 'libre' }, { s: 'ocupado', m: 150 },
    { s: 'ocupado', m: 12 }, { s: 'libre' }, { s: 'libre' }, { s: 'ocupado', m: 80 }, { s: 'sinSenal' },
  ],
  B: [
    { s: 'reservado', r: 'preferente' }, { s: 'libre' }, { s: 'libre' }, { s: 'ocupado', m: 95 }, { s: 'libre' },
    { s: 'libre' }, { s: 'ocupado', m: 22 }, { s: 'libre' }, { s: 'libre' }, { s: 'libre' },
  ],
  C: [
    { s: 'ocupado', m: 200 }, { s: 'ocupado', m: 64 }, { s: 'libre' }, { s: 'ocupado', m: 5 }, { s: 'ocupado', m: 130 },
    { s: 'libre' }, { s: 'ocupado', m: 48 }, { s: 'ocupado', m: 18 }, { s: 'sinSenal' }, { s: 'libre' },
  ],
};

/** Cajones iniciales; los tiempos se cuentan desde `now`. */
export function initialSpaces(now: number): ParkingSpace[] {
  return SECTORS.flatMap((sector) =>
    SEED[sector.id].map((seed, i) => ({
      id: `${sector.id}-${String(i + 1).padStart(2, '0')}`,
      sector: sector.id,
      row: i < SPOTS_PER_ROW ? 1 : 2,
      position: (i % SPOTS_PER_ROW) + 1,
      status: seed.s,
      since: seed.m !== undefined ? now - seed.m * 60_000 : undefined,
      reservedFor: seed.r,
    }))
  );
}
