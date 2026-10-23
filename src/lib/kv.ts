import Storage from 'expo-sqlite/kv-store';

/** Almacén clave-valor síncrono (Android/iOS: SQLite). */
export const kv = {
  get: (key: string) => Storage.getItemSync(key),
  set: (key: string, value: string) => Storage.setItemSync(key, value),
};
