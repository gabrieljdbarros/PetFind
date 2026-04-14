import React, {
  createContext, useContext, useState,
  useEffect, ReactNode,
} from 'react';
import { onAuthChange, AppUser } from '../services/authService';

type SessionContextType = {
  usuario: AppUser | null;
  setUsuario: (u: AppUser | null) => void;
  isLogado: boolean;
  carregando: boolean;
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<AppUser | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange((user) => {
      setUsuario(user);
      setCarregando(false);
    });
    return () => unsub();
  }, []);

  return (
    <SessionContext.Provider
      value={{ usuario, setUsuario, isLogado: !!usuario, carregando }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextType {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession deve ser usado dentro de SessionProvider');
  return ctx;
}
