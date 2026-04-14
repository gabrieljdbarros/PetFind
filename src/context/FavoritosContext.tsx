import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@petfind:favoritos";

type FavoritosContextType = {
  favoritos: string[];
  isFavorito: (id: string) => boolean;
  toggleFavorito: (id: string) => void;
  carregando: boolean;
};

const FavoritosContext = createContext<FavoritosContextType | undefined>(undefined);

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Carrega do AsyncStorage na inicialização
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setFavoritos(JSON.parse(raw));
      })
      .catch(() => {})
      .finally(() => setCarregando(false));
  }, []);

  // Persiste sempre que favoritos mudar
  useEffect(() => {
    if (!carregando) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favoritos)).catch(() => {});
    }
  }, [favoritos, carregando]);

  const isFavorito = useCallback((id: string) => favoritos.includes(id), [favoritos]);

  const toggleFavorito = useCallback((id: string) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  }, []);

  return (
    <FavoritosContext.Provider value={{ favoritos, isFavorito, toggleFavorito, carregando }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos(): FavoritosContextType {
  const ctx = useContext(FavoritosContext);
  if (!ctx) throw new Error("useFavoritos deve ser usado dentro de FavoritosProvider");
  return ctx;
}
