import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { pets } from "../src/data/pets";
import PetCard from "../src/components/PetCard";

const filtros = ["Todos", "Cães", "Gatos", "Vacinados", "Castrados"];

export default function AdotarScreen() {
  const insets = useSafeAreaInsets();
  const [busca, setBusca] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState("Todos");

  const petsFiltrados = pets.filter((pet) => {
    const termo = busca.toLowerCase();
    const matchBusca =
      pet.nome.toLowerCase().includes(termo) ||
      pet.raca.toLowerCase().includes(termo) ||
      pet.local.toLowerCase().includes(termo) ||
      pet.especie.toLowerCase().includes(termo);

    const matchFiltro =
      filtroAtivo === "Todos" ||
      (filtroAtivo === "Cães" && pet.especie === "Cão") ||
      (filtroAtivo === "Gatos" && pet.especie === "Gato") ||
      (filtroAtivo === "Vacinados" && pet.vacinado) ||
      (filtroAtivo === "Castrados" && pet.castrado);

    return matchBusca && matchFiltro;
  });

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Adotar</Text>
        <View style={{ width: 36 }} />
      </View>

      {/*   Busca */}
      <View style={styles.searchRow}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome, raça ou cidade"
          value={busca}
          onChangeText={setBusca}
          placeholderTextColor="#999"
          returnKeyType="search"
        />
        {busca.length > 0 && (
          <Pressable onPress={() => setBusca("")}>
            <Text style={styles.clearIcon}>✕</Text>
          </Pressable>
        )}
      </View>

      {/* Filtros */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
        style={styles.filtersScroll}
        keyboardShouldPersistTaps="handled"
      >
        {filtros.map((item) => (
          <Pressable
            key={item}
            style={[styles.filterChip, filtroAtivo === item && styles.filterChipActive]}
            onPress={() => setFiltroAtivo(item)}
          >
            <Text style={[styles.filterText, filtroAtivo === item && styles.filterTextActive]}>
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.countText}>
        {petsFiltrados.length} {petsFiltrados.length === 1 ? "pet encontrado" : "pets encontrados"}
      </Text>

      {/* O teclado ainda não tá funcionando na busca */}
      <ScrollView
        style={styles.petList}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {petsFiltrados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Nenhum pet encontrado.</Text>
            <Text style={styles.emptySubtext}>Tente outro filtro ou termo de busca.</Text>
          </View>
        ) : (
          petsFiltrados.map((pet) => <PetCard key={pet.id} pet={pet} />)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12,
    backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#F0F0F0",
  },
  backBtn: { width: 36, height: 36, justifyContent: "center", alignItems: "center" },
  backBtnText: { fontSize: 28, color: "#111", lineHeight: 32 },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#111" },
  searchRow: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#CCC", borderRadius: 12,
    paddingHorizontal: 12, marginHorizontal: 16, marginTop: 16, marginBottom: 12,
  },
  searchIcon: { fontSize: 15, marginRight: 8, color: "#999" },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: "#111" },
  clearIcon: { fontSize: 14, color: "#999", paddingLeft: 8 },
  filtersScroll: { flexGrow: 0 },
  filtersContainer: { paddingHorizontal: 16, paddingVertical: 8, gap: 10 },
  filterChip: {
    backgroundColor: "#E4E6EB", paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 20, justifyContent: "center", alignItems: "center",
  },
  filterChipActive: { backgroundColor: "#2F80ED" },
  filterText: { fontSize: 14, fontWeight: "600", color: "#111" },
  filterTextActive: { color: "#fff" },
  countText: { fontSize: 13, color: "#888", paddingHorizontal: 16, marginTop: 8, marginBottom: 4 },
  petList: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 17, fontWeight: "600", color: "#333", marginBottom: 6 },
  emptySubtext: { fontSize: 14, color: "#888" },
});
