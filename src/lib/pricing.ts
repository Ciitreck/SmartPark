import type { ParkingSpace, SpotStatus } from '@/constants/parking-layout';

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

/** Tarifa: las primeras 2 h son gratis; después, $15 por hora o fracción. */
export const FREE_TIME_MS = 2 * HOUR;
export const PRICE_PER_HOUR = 15;

export function overtimeMs(elapsed: number) {
  return Math.max(0, elapsed - FREE_TIME_MS);
}

export function costFor(elapsed: number) {
  const extra = overtimeMs(elapsed);
  return extra === 0 ? 0 : Math.ceil(extra / HOUR) * PRICE_PER_HOUR;
}

/** Estado que se dibuja: un cajón ocupado más de 2 h pasa a "excedido". */
export function displayStatus(space: ParkingSpace, now: number): SpotStatus {
  if (space.status === 'ocupado' && space.since !== undefined && now - space.since > FREE_TIME_MS) {
    return 'excedido';
  }
  return space.status;
}

/** `01:24:05` para el contador. */
export function formatClock(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
}

/** "1 h 24 min" para textos. */
export function formatDuration(ms: number) {
  const totalMin = Math.max(0, Math.floor(ms / MINUTE));
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}

/** "$25.00 MXN" */
export function formatMoney(amount: number) {
  return `$${amount.toFixed(2)} MXN`;
}

/** El porqué del cobro: "Tiempo libre: 2 h · Excedido: 24 min". */
export function costReason(elapsed: number) {
  const extra = overtimeMs(elapsed);
  const free = `Tiempo libre: ${formatDuration(FREE_TIME_MS)}`;
  return extra === 0 ? `${free} · Te quedan ${formatDuration(FREE_TIME_MS - elapsed)}` : `${free} · Excedido: ${formatDuration(extra)}`;
}
