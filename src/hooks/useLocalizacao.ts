import { useState, useEffect } from "react";
import * as Location from "expo-location";

export type Localizacao = {
  cidade: string;
  estado: string;
  latitude: number;
  longitude: number;
};

type UseLocalizacaoResult = {
  localizacao: Localizacao | null;
  carregando: boolean;
  erro: string | null;
  solicitarPermissao: () => Promise<void>;
  permissaoNegada: boolean;
};

export function useLocalizacao(): UseLocalizacaoResult {
  const [localizacao, setLocalizacao] = useState<Localizacao | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [permissaoNegada, setPermissaoNegada] = useState(false);

  async function obterLocalizacao() {
    setCarregando(true);
    setErro(null);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setPermissaoNegada(true);
        setErro("Permissão de localização negada");
        return;
      }

      setPermissaoNegada(false);

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;

      // Geocodificação reversa para obter cidade/estado
      const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });

      setLocalizacao({
        cidade: place.city ?? place.subregion ?? "Cidade desconhecida",
        estado: place.region ?? place.isoCountryCode ?? "",
        latitude,
        longitude,
      });
    } catch (e) {
      setErro("Não foi possível obter a localização");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    obterLocalizacao();
  }, []);

  return {
    localizacao,
    carregando,
    erro,
    solicitarPermissao: obterLocalizacao,
    permissaoNegada,
  };
}
