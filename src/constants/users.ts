export type User = { username: string; password: string; name: string };

type RegisterResult = { ok: true; name: string } | { ok: false; error: string };

// Los usuarios registrados se guardan en esta lista, en memoria
export const users: User[] = [
  { username: 'admin', password: 'smartpark', name: 'Admin' },
  { username: 'usuario', password: '1234', name: 'Usuario' },
];

export function validateUser(username: string, password: string) {
  return users.find(
    (u) => u.username === username.trim().toLowerCase() && u.password === password
  );
}

export function registerUser(
  name: string,
  username: string,
  password: string,
  confirm: string
): RegisterResult {
  const cleanName = name.trim();
  const cleanUser = username.trim().toLowerCase();

  if (!cleanName || !cleanUser || !password) {
    return { ok: false, error: 'Completa todos los campos' };
  }
  if (cleanUser.length < 3 || /\s/.test(cleanUser)) {
    return { ok: false, error: 'El usuario debe tener 3 o más caracteres, sin espacios' };
  }
  if (password.length < 6) {
    return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres' };
  }
  if (password !== confirm) {
    return { ok: false, error: 'Las contraseñas no coinciden' };
  }
  if (users.some((u) => u.username === cleanUser)) {
    return { ok: false, error: 'Ese usuario ya existe' };
  }

  users.push({ username: cleanUser, password, name: cleanName });
  return { ok: true, name: cleanName };
}