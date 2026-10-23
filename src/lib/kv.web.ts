/** Almacén clave-valor síncrono (web: localStorage, sin el .wasm de SQLite). */
export const kv = {
  get: (key: string) => (typeof localStorage === 'undefined' ? null : localStorage.getItem(key)),
  set: (key: string, value: string) => {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  },
};
