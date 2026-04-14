import { useState, useEffect } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

export type StatusConexao = {
  online: boolean;
  tipo: string | null; // "wifi", "cellular", "none", etc.
  isWifi: boolean;
  carregando: boolean;
};

export function useConexao(): StatusConexao {
  const [estado, setEstado] = useState<StatusConexao>({
    online: true,
    tipo: null,
    isWifi: false,
    carregando: true,
  });

  useEffect(() => {
    // Leitura inicial
    NetInfo.fetch().then((info) => {
      setEstado({
        online: !!info.isConnected && !!info.isInternetReachable,
        tipo: info.type,
        isWifi: info.type === "wifi",
        carregando: false,
      });
    });

    // Listener de mudanças em tempo real
    const unsubscribe = NetInfo.addEventListener((info: NetInfoState) => {
      setEstado({
        online: !!info.isConnected && !!info.isInternetReachable,
        tipo: info.type,
        isWifi: info.type === "wifi",
        carregando: false,
      });
    });

    return () => unsubscribe();
  }, []);

  return estado;
}
