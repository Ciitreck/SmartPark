import { onAuthStateChanged } from 'firebase/auth';
import { createContext, use, useEffect, useState, type PropsWithChildren } from 'react';

import { logout, toUser, type User } from '@/lib/auth';
import { auth } from '@/lib/firebase';

type AuthContextValue = {
  user: User | null;
  /** true mientras Firebase revisa si hay una sesión guardada */
  initializing: boolean;
  signIn: (user: User) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Firebase avisa al abrir la app (sesión guardada) y cada vez que alguien entra o sale
  useEffect(() => {
    return onAuthStateChanged(auth, (fbUser) => {
      setUser(fbUser ? toUser(fbUser) : null);
      setInitializing(false);
    });
  }, []);

  // Al registrarse, Firebase avisa antes de guardar el nombre; esto lo actualiza
  const signIn = (next: User) => setUser(next);

  const signOut = () => logout();

  return <AuthContext value={{ user, initializing, signIn, signOut }}>{children}</AuthContext>;
}

export function useAuth() {
  const value = use(AuthContext);
  if (!value) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return value;
}
