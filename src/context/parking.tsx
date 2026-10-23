import { createContext, use, useEffect, useState, type PropsWithChildren } from 'react';

import type { ParkingSpace } from '@/constants/parking-layout';
import { loadState, saveState, type FinishedStay, type ParkingState, type Stay } from '@/lib/parking-store';
import { costFor } from '@/lib/pricing';

type ParkingContextValue = {
  spaces: ParkingSpace[];
  myStay: Stay | null;
  history: FinishedStay[];
  /** El conductor se estaciona en un cajón libre. */
  parkHere: (spotId: string) => void;
  /** El conductor sale de su cajón; devuelve lo que se cobró. */
  leaveSpot: () => FinishedStay | null;
  /** Simulación mientras no hay sensores: libera u ocupa un cajón. */
  toggleSpot: (spotId: string) => void;
};

const ParkingContext = createContext<ParkingContextValue | null>(null);

export function ParkingProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<ParkingState>(loadState);

  // Se conserva al cerrar la app
  useEffect(() => {
    saveState(state);
  }, [state]);

  const parkHere = (spotId: string) => {
    const now = Date.now();
    setState((prev) => {
      if (prev.myStay) return prev;
      const spot = prev.spaces.find((s) => s.id === spotId);
      if (!spot || spot.status !== 'libre') return prev;
      return {
        ...prev,
        myStay: { spotId, since: now },
        spaces: prev.spaces.map((s) => (s.id === spotId ? { ...s, status: 'ocupado', since: now } : s)),
      };
    });
  };

  const leaveSpot = () => {
    const stay = state.myStay;
    if (!stay) return null;
    const end = Date.now();
    const finished: FinishedStay = { spotId: stay.spotId, start: stay.since, end, cost: costFor(end - stay.since) };
    setState((prev) => ({
      myStay: null,
      history: [...prev.history, finished].slice(-200),
      spaces: prev.spaces.map((s) => (s.id === stay.spotId ? { ...s, status: 'libre', since: undefined } : s)),
    }));
    return finished;
  };

  const toggleSpot = (spotId: string) => {
    const now = Date.now();
    setState((prev) => toggled(prev, spotId, now));
  };

  return (
    <ParkingContext value={{ ...state, parkHere, leaveSpot, toggleSpot }}>{children}</ParkingContext>
  );
}

function patch(spaces: ParkingSpace[], spotId: string, change: Partial<ParkingSpace>) {
  return spaces.map((s) => (s.id === spotId ? { ...s, ...change } : s));
}

function toggled(prev: ParkingState, spotId: string, now: number): ParkingState {
  // El cajón del conductor solo se libera con "Salir del cajón"
  if (prev.myStay?.spotId === spotId) return prev;
  const spot = prev.spaces.find((s) => s.id === spotId);
  if (!spot) return prev;

  if (spot.status === 'libre') {
    return { ...prev, spaces: patch(prev.spaces, spotId, { status: 'ocupado', since: now }) };
  }
  if (spot.status === 'ocupado') {
    const history =
      spot.since !== undefined
        ? [...prev.history, { spotId, start: spot.since, end: now, cost: costFor(now - spot.since) }].slice(-200)
        : prev.history;
    return { ...prev, history, spaces: patch(prev.spaces, spotId, { status: 'libre', since: undefined }) };
  }
  return prev;
}

export function useParking() {
  const value = use(ParkingContext);
  if (!value) throw new Error('useParking debe usarse dentro de <ParkingProvider>');
  return value;
}
