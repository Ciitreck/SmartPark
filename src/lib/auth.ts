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

export type AuthField = 'name' | 'email' | 'password' | 'confirm';

type AuthResult = { ok: true; user: User } | { ok: false; error: string; field?: AuthField };

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
function failure(err: unknown): { ok: false; error: string; field?: AuthField } {
  const code = err instanceof FirebaseError ? err.code : '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return { ok: false, error: 'Correo o contraseña incorrectos' };
    case 'auth/invalid-email':
      return { ok: false, error: 'Revisa tu correo, parece que le falta algo', field: 'email' };
    case 'auth/email-already-in-use':
      return { ok: false, error: 'Ya hay una cuenta con ese correo. ¿Quieres entrar?', field: 'email' };
    case 'auth/weak-password':
      return { ok: false, error: 'Tu contraseña necesita al menos 6 caracteres', field: 'password' };
    case 'auth/too-many-requests':
      return { ok: false, error: 'Demasiados intentos. Espera un momento y vuelve a intentarlo' };
    case 'auth/network-request-failed':
      return { ok: false, error: 'Sin conexión. Revisa tu internet y vuelve a intentarlo' };
    default:
      return { ok: false, error: 'Algo salió mal. Vuelve a intentarlo' };
  }
}

export async function login(email: string, password: string): Promise<AuthResult> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) {
    return { ok: false, error: 'Escribe tu correo', field: 'email' };
  }
  if (!password) {
    return { ok: false, error: 'Ya casi, solo falta tu contraseña', field: 'password' };
  }

  try {
    const { user } = await signInWithEmailAndPassword(auth, cleanEmail, password);
    return { ok: true, user: toUser(user) };
  } catch (err) {
    return failure(err);
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

  if (!EMAIL_RE.test(cleanEmail)) {
    return { ok: false, error: 'Escribe un correo válido, como nombre@correo.com', field: 'email' };
  }
  if (!cleanName) {
    return { ok: false, error: '¿Cómo te llamas? Escribe tu nombre', field: 'name' };
  }
  if (password.length < 6) {
    return { ok: false, error: 'Tu contraseña necesita al menos 6 caracteres', field: 'password' };
  }
  if (password !== confirm) {
    return { ok: false, error: 'Las contraseñas no coinciden. Escríbela otra vez', field: 'confirm' };
  }

  try {
    const { user } = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    // Guarda el nombre en el perfil de Firebase
    await updateProfile(user, { displayName: cleanName });
    return { ok: true, user: toUser(user) };
  } catch (err) {
    return failure(err);
  }
}

export function logout() {
  return signOut(auth);
}
