import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Image, Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFavoritos } from "../../src/context/FavoritosContext";
import { pets } from "../../src/data/pets";

export default function FavoritosScreen() {
  const insets = useSafeAreaInsets();
  const { favoritos, toggleFavorito, carregando } = useFavoritos();

  const petsFavoritos = pets.filter((p) => favoritos.includes(p.id));

  if (carregando) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2F80ED" />
      </View>
    );
  }

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Favoritos</Text>
        {petsFavoritos.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{petsFavoritos.length}</Text>
          </View>
        )}
      </View>

      {petsFavoritos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🐾</Text>
          <Text style={styles.emptyTitle}>Nenhum favorito ainda</Text>
          <Text style={styles.emptySubtitle}>
            Toque no coração de um pet para salvá-lo aqui
          </Text>
          <Pressable style={styles.exploreBtn} onPress={() => router.push("/adotar")}>
            <Text style={styles.exploreBtnText}>Explorar pets</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={petsFavoritos}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() =>
                router.push({ pathname: "/pet/[id]", params: { id: item.id } })
              }
            >
              {item.imagem ? (
                <Image source={{ uri: item.imagem }} style={styles.cardImage} />
              ) : (
                <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
                  <Text style={{ fontSize: 32 }}>🐾</Text>
                </View>
              )}

              <View style={styles.cardContent}>
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardName}>{item.nome}</Text>
                    <Text style={styles.cardSub}>{item.especie} • {item.raca}</Text>
                    <Text style={styles.cardSub}>{item.idade} • {item.porte}</Text>
                  </View>
                  <Pressable
                    style={styles.heartBtn}
                    onPress={() => toggleFavorito(item.id)}
                    hitSlop={12}
                  >
                    <Text style={styles.heartIcon}>❤️</Text>
                  </Pressable>
                </View>

                <Text style={styles.cardLocation}>📍 {item.local}</Text>

                <View style={styles.chipsRow}>
                  {item.personalidade.slice(0, 2).map((t) => (
                    <View key={t} style={styles.chip}>
                      <Text style={styles.chipText}>{t}</Text>
                    </View>
                  ))}
                  {item.vacinado && (
                    <View style={styles.chipGreen}>
                      <Text style={styles.chipTextGreen}>Vacinado</Text>
                    </View>
                  )}
                </View>

                <Pressable
                  style={styles.adoptBtn}
                  onPress={() =>
                    router.push({
                      pathname: "/solicitacao-adocao",
                      params: { id: item.id },
                    })
                  }
                >
                  <Text style={styles.adoptBtnText}>Quero Adotar</Text>
                </Pressable>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    gap: 10,
  },
  headerTitle: { fontSize: 24, fontWeight: "800", color: "#111" },
  badge: {
    backgroundColor: "#2F80ED",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    alignItems: "center",
  },
  badgeText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  emptyContainer: {
    flex: 1, justifyContent: "center", alignItems: "center", padding: 40,
  },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: "800", color: "#111", marginBottom: 8 },
  emptySubtitle: {
    fontSize: 15, color: "#888", textAlign: "center", lineHeight: 22, marginBottom: 32,
  },
  exploreBtn: {
    backgroundColor: "#2F80ED", paddingHorizontal: 32,
    paddingVertical: 14, borderRadius: 12,
  },
  exploreBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  list: { padding: 16, gap: 16 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EEE",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImage: { width: "100%", height: 180, resizeMode: "cover" },
  cardImagePlaceholder: {
    backgroundColor: "#EAEAEA", justifyContent: "center", alignItems: "center",
  },
  cardContent: { padding: 14 },
  cardTop: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6 },
  cardName: { fontSize: 20, fontWeight: "800", color: "#111", marginBottom: 3 },
  cardSub: { fontSize: 13, color: "#666", marginBottom: 1 },
  heartBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "#FFF0F0", justifyContent: "center", alignItems: "center",
  },
  heartIcon: { fontSize: 18 },
  cardLocation: { fontSize: 13, color: "#888", marginBottom: 10 },
  chipsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 14 },
  chip: {
    backgroundColor: "#E8F0FE", paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 20,
  },
  chipText: { fontSize: 12, fontWeight: "600", color: "#2F80ED" },
  chipGreen: {
    backgroundColor: "#E8F7EE", paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 20,
  },
  chipTextGreen: { fontSize: 12, fontWeight: "600", color: "#1E9E52" },
  adoptBtn: {
    backgroundColor: "#2F80ED", paddingVertical: 12,
    borderRadius: 10, alignItems: "center",
  },
  adoptBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});
