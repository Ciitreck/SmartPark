// src/constants/parking-layout.ts
export type ParkingSpace = {
  id: string;
  isAvailable: boolean;
  row: number;
  position: number;
};

/**
 * Define una disposición estática de espacios de estacionamiento.
 * Cada espacio tiene un `id`, estado de disponibilidad (`isAvailable`),
 * `row` (fila) y `position` (posición dentro de la fila).
 */
export const parkingLayout: ParkingSpace[] = [
  { id: '1', isAvailable: true, row: 1, position: 1 },
  { id: '2', isAvailable: false, row: 1, position: 2 },
  { id: '3', isAvailable: true, row: 1, position: 3 },
  { id: '4', isAvailable: true, row: 1, position: 4 },
  { id: '5', isAvailable: false, row: 1, position: 5 },
  { id: '6', isAvailable: true, row: 1, position: 6 },
  { id: '7', isAvailable: false, row: 1, position: 7 },
  { id: '8', isAvailable: true, row: 1, position: 8 },
  { id: '9', isAvailable: true, row: 1, position: 9 },
  { id: '10', isAvailable: false, row: 1, position: 10 },
  { id: '11', isAvailable: true, row: 2, position: 1 },
  { id: '12', isAvailable: true, row: 2, position: 2 },
  { id: '13', isAvailable: false, row: 2, position: 3 },
  { id: '14', isAvailable: true, row: 2, position: 4 },
  { id: '15', isAvailable: false, row: 2, position: 5 },
  { id: '16', isAvailable: true, row: 2, position: 6 },
  { id: '17', isAvailable: true, row: 2, position: 7 },
  { id: '18', isAvailable: false, row: 2, position: 8 },
  { id: '19', isAvailable: true, row: 2, position: 9 },
  { id: '20', isAvailable: true, row: 2, position: 10 },
];