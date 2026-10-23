import { FirebaseError } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';

import { auth } from '@/lib/firebase';

export type User = { uid: string; email: string; name: string };

type AuthResult = { ok: true; user: User } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Convierte el usuario de Firebase al formato que usa la app. */
export function toUser(fbUser: FirebaseUser): User {
  const email = fbUser.email ?? '';
  return {
    uid: fbUser.uid,
    email,
    // Si no tiene nombre guardado, usa la parte del correo antes de la @
    name: fbUser.displayName || email.split('@')[0] || 'Usuario',
  };
}

/** Traduce los códigos de error de Firebase a mensajes para el usuario. */
function errorMessage(err: unknown): string {
  const code = err instanceof FirebaseError ? err.code : '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Correo o contraseña incorrectos';
    case 'auth/invalid-email':
      return 'El correo no es válido';
    case 'auth/email-already-in-use':
      return 'Ya existe una cuenta con ese correo';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Espera un momento e inténtalo de nuevo';
    case 'auth/network-request-failed':
      return 'Sin conexión. Revisa tu internet';
    default:
      return 'Ocurrió un error. Inténtalo de nuevo';
  }
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !password) {
    return { ok: false, error: 'Escribe tu correo y contraseña' };
  }

  try {
    const { user } = await signInWithEmailAndPassword(auth, cleanEmail, password);
    return { ok: true, user: toUser(user) };
  } catch (err) {
    return { ok: false, error: errorMessage(err) };
  }
}

export async function register(
  name: string,
  email: string,
  password: string,
  confirm: string
): Promise<AuthResult> {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanName || !cleanEmail || !password) {
    return { ok: false, error: 'Completa todos los campos' };
  }
  if (!EMAIL_RE.test(cleanEmail)) {
    return { ok: false, error: 'El correo no es válido' };
  }
  if (password.length < 6) {
    return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres' };
  }
  if (password !== confirm) {
    return { ok: false, error: 'Las contraseñas no coinciden' };
  }

  try {
    const { user } = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    // Guarda el nombre en el perfil de Firebase
    await updateProfile(user, { displayName: cleanName });
    return { ok: true, user: toUser(user) };
  } catch (err) {
    return { ok: false, error: errorMessage(err) };
  }
}

export function logout() {
  return signOut(auth);
}
