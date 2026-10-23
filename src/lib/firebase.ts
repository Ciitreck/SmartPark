import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth, getReactNativePersistence, initializeAuth, type Auth } from 'firebase/auth';

import { app } from './firebase-config';

// En Android/iOS la sesión se guarda con AsyncStorage para no pedir login cada vez
function createAuth(): Auth {
  try {
    return initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  } catch {
    // Ya estaba inicializado (Fast Refresh)
    return getAuth(app);
  }
}

export { app };
export const auth = createAuth();
