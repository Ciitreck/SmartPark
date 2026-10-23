import { getApp, getApps, initializeApp } from 'firebase/app';

// Valores de la app web registrada en la consola de Firebase.
// Se leen de .env.local (variables EXPO_PUBLIC_*), que no se sube a git.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Evita inicializar dos veces con el recarga rápida (Fast Refresh)
export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
