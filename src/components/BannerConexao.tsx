import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useConexao } from "../hooks/useConexao";

export default function BannerConexao() {
  const { online, carregando, isWifi } = useConexao();
  const translateY = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    if (carregando) return;
    Animated.spring(translateY, {
      toValue: online ? -60 : 0,
      useNativeDriver: true,
      tension: 80,
      friction: 10,
    }).start();
  }, [online, carregando]);

  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY }] }]}>
      <Text style={styles.icon}>📡</Text>
      <View>
        <Text style={styles.text}>Sem conexão com a internet</Text>
        <Text style={styles.sub}>Algumas funcionalidades podem estar indisponíveis</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    zIndex: 999,
    backgroundColor: "#1A1A2E",
    paddingHorizontal: 16, paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  icon: { fontSize: 22 },
  text: { fontSize: 14, fontWeight: "700", color: "#fff" },
  sub: { fontSize: 11, color: "#AAA", marginTop: 1 },
});
