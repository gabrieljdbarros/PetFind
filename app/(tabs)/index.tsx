import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { pets } from "../../src/data/pets";
import { usuarioLogado } from "../../src/state/session";
import PetCard from "../../src/components/PetCard";

const categorias = [
  { label: "Cães",   image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400" },
  { label: "Gatos",  image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400" },
  { label: "Idosos", image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400" },
];

const maneiras = [
  { label: "Voluntariado",      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400" },
  { label: "Comprar Alimentos", image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400" },
  { label: "Doações",           image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400" },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [busca, setBusca] = useState("");

  const petsFiltrados = pets.filter((pet) => {
    const termo = busca.toLowerCase();
    return (
      pet.nome.toLowerCase().includes(termo) ||
      pet.raca.toLowerCase().includes(termo) ||
      pet.local.toLowerCase().includes(termo) ||
      pet.especie.toLowerCase().includes(termo)
    );
  });

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Olá {usuarioLogado?.nome ?? "Usuário"}!</Text>
            <Text style={styles.title}>Busca:</Text>
          </View>
          <Pressable style={styles.bellButton}>
            <Text style={styles.bellIcon}>🔔</Text>
          </Pressable>
        </View>

        {/*  Barra de busca*/}
        <View style={styles.searchRow}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Busca pet"
            value={busca}
            onChangeText={setBusca}
            placeholderTextColor="#999"
          />
          {busca.length > 0 && (
            <Pressable onPress={() => setBusca("")}>
              <Text style={styles.clearIcon}>✕</Text>
            </Pressable>
          )}
        </View>

        {busca.length > 0 ? (
          <View>
            <Text style={styles.sectionTitle}>
              {petsFiltrados.length} {petsFiltrados.length === 1 ? "resultado" : "resultados"}
            </Text>
            {petsFiltrados.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum pet encontrado.</Text>
            ) : (
              petsFiltrados.map((pet) => <PetCard key={pet.id} pet={pet} />)
            )}
          </View>
        ) : (
          <>
            <Pressable style={styles.actionCard} onPress={() => router.push("/adotar")}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>📋</Text>
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Adotar</Text>
                <Text style={styles.actionSubtitle}>Encontre um pet para adotar perto de você</Text>
              </View>
              <Text style={styles.actionChevron}>›</Text>
            </Pressable>

            <Pressable style={styles.actionCard} onPress={() => {}}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>❤️</Text>
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Favoritos</Text>
                <Text style={styles.actionSubtitle}>Veja os pets que você salvou</Text>
              </View>
              <Text style={styles.actionChevron}>›</Text>
            </Pressable>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categorias:</Text>
              <Pressable onPress={() => router.push("/adotar")}>
                <Text style={styles.seeAll}>Ver todas</Text>
              </Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {categorias.map((cat) => (
                <Pressable key={cat.label} style={styles.categoryCard}>
                  <Image source={{ uri: cat.image }} style={styles.categoryImage} />
                  <Text style={styles.categoryLabel}>{cat.label}</Text>
                </Pressable>
              ))}
            </ScrollView>

            <Text style={styles.sectionTitle}>Maneiras de ajudar:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {maneiras.map((item) => (
                <Pressable key={item.label} style={styles.helpCard}>
                  <Image source={{ uri: item.image }} style={styles.helpImage} />
                  <Text style={styles.helpLabel}>{item.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  header: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "flex-start", marginBottom: 16,
  },
  greeting: { fontSize: 15, color: "#444" },
  title: { fontSize: 26, fontWeight: "bold", color: "#111" },
  bellButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "#F0F0F0", justifyContent: "center", alignItems: "center",
  },
  bellIcon: { fontSize: 18 },
  searchRow: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#CCC", borderRadius: 12,
    paddingHorizontal: 12, marginBottom: 20, backgroundColor: "#fff",
  },
  searchIcon: { fontSize: 16, marginRight: 8, color: "#999" },
  searchInput: { flex: 1, paddingVertical: 13, fontSize: 15, color: "#111" },
  clearIcon: { fontSize: 14, color: "#999", paddingLeft: 8 },
  actionCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#EAF6F6", borderRadius: 14,
    padding: 14, marginBottom: 12, gap: 12,
  },
  actionIcon: {
    width: 48, height: 48, backgroundColor: "#2F80ED",
    borderRadius: 10, justifyContent: "center", alignItems: "center",
  },
  actionIconText: { fontSize: 22 },
  actionText: { flex: 1 },
  actionTitle: { fontSize: 15, fontWeight: "700", color: "#111", marginBottom: 2 },
  actionSubtitle: { fontSize: 12, color: "#555" },
  actionChevron: { fontSize: 22, color: "#888" },
  sectionHeader: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", marginBottom: 12, marginTop: 8,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#111", marginBottom: 12, marginTop: 8 },
  seeAll: { fontSize: 14, color: "#2F80ED" },
  horizontalScroll: { marginBottom: 20 },
  categoryCard: {
    width: 140, borderRadius: 14, borderWidth: 1.5,
    borderColor: "#2ABFBF", overflow: "hidden", marginRight: 12,
  },
  categoryImage: { width: "100%", height: 110, resizeMode: "cover" },
  categoryLabel: { fontSize: 14, fontWeight: "600", color: "#111", padding: 10 },
  helpCard: { width: 130, marginRight: 12 },
  helpImage: { width: "100%", height: 100, borderRadius: 12, resizeMode: "cover", marginBottom: 6 },
  helpLabel: { fontSize: 13, color: "#333", fontWeight: "500" },
  emptyText: { color: "#888", fontSize: 15, textAlign: "center", marginTop: 16 },
});
