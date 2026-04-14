import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PetCard from "../src/components/PetCard";
import { Pet } from "../src/data/pets";
import { listarPets } from "../src/services/petsService";

const FILTROS_BASE = ["Todos", "Cães", "Gatos", "Vacinados", "Castrados", "Perto de mim"];

export default function AdotarScreen() {
  const insets = useSafeAreaInsets();
  const { filtroInicial, cidadeUsuario, estadoUsuario } = useLocalSearchParams<{
    filtroInicial?: string;
    cidadeUsuario?: string;
    estadoUsuario?: string;
  }>();

  const [busca, setBusca] = useState("");
  const [filtroAtivo, setFiltroAtivo] = useState<string>(
    filtroInicial && FILTROS_BASE.includes(filtroInicial) ? filtroInicial : "Todos"
  );
  const [listaPets, setListaPets] = useState<Pet[]>([]);

useEffect(() => {
  listarPets().then(setListaPets);
}, []);

  const petsFiltrados = listaPets.filter((pet) => {
    const termo = busca.toLowerCase();
    const matchBusca =
      pet.nome.toLowerCase().includes(termo) ||
      pet.raca.toLowerCase().includes(termo) ||
      pet.local.toLowerCase().includes(termo) ||
      pet.especie.toLowerCase().includes(termo);

    let matchFiltro = true;
    if (filtroAtivo === "Cães") matchFiltro = pet.especie === "Cão";
    else if (filtroAtivo === "Gatos") matchFiltro = pet.especie === "Gato";
    else if (filtroAtivo === "Vacinados") matchFiltro = pet.vacinado;
    else if (filtroAtivo === "Castrados") matchFiltro = pet.castrado;
    else if (filtroAtivo === "Perto de mim" && (cidadeUsuario || estadoUsuario)) {
      // Filtra pets p o mesmo local do usuário
      const local = pet.local.toLowerCase();
      const cidade = (cidadeUsuario ?? "").toLowerCase();
      const estado = (estadoUsuario ?? "").toLowerCase();
      matchFiltro =
        (cidade.length > 0 && local.includes(cidade)) ||
        (estado.length > 0 && local.includes(estado));
    }

    return matchBusca && matchFiltro;
  });

  const subtituloFiltro = filtroAtivo === "Perto de mim" && cidadeUsuario
    ? `📍 ${cidadeUsuario}${estadoUsuario ? `, ${estadoUsuario}` : ""}`
    : null;

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>‹</Text>
        </Pressable>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.headerTitle}>Adotar</Text>
          {subtituloFiltro && <Text style={styles.headerSub}>{subtituloFiltro}</Text>}
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* Busca */}
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
        horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
        style={styles.filtersScroll}
        keyboardShouldPersistTaps="handled"
      >
        {FILTROS_BASE.map((item) => (
          <Pressable
            key={item}
            style={[styles.filterChip, filtroAtivo === item && styles.filterChipActive]}
            onPress={() => setFiltroAtivo(item)}
          >
            {item === "Perto de mim" && <Text style={styles.filterEmoji}>📍</Text>}
            <Text style={[styles.filterText, filtroAtivo === item && styles.filterTextActive]}>
              {item}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Text style={styles.countText}>
        {petsFiltrados.length} {petsFiltrados.length === 1 ? "pet encontrado" : "pets encontrados"}
        {filtroAtivo === "Perto de mim" && !cidadeUsuario
          ? " · Ative o GPS para filtrar por região"
          : ""}
      </Text>

      <ScrollView
        style={styles.petList}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        {petsFiltrados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>
              {filtroAtivo === "Perto de mim" ? "📍" : "🐾"}
            </Text>
            <Text style={styles.emptyText}>
              {filtroAtivo === "Perto de mim" && !cidadeUsuario
                ? "GPS não disponível"
                : "Nenhum pet encontrado"}
            </Text>
            <Text style={styles.emptySubtext}>
              {filtroAtivo === "Perto de mim" && !cidadeUsuario
                ? "Ative a localização para filtrar pets perto de você"
                : "Tente outro filtro ou termo de busca"}
            </Text>
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
    borderBottomWidth: 1, borderBottomColor: "#F0F0F0",
  },
  backBtn: { width: 36, height: 36, justifyContent: "center", alignItems: "center" },
  backBtnText: { fontSize: 28, color: "#111", lineHeight: 32 },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#111" },
  headerSub: { fontSize: 12, color: "#2F80ED", fontWeight: "500", marginTop: 1 },
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
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#E4E6EB", paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 20,
  },
  filterChipActive: { backgroundColor: "#2F80ED" },
  filterEmoji: { fontSize: 12, marginRight: 4 },
  filterText: { fontSize: 14, fontWeight: "600", color: "#111" },
  filterTextActive: { color: "#fff" },
  countText: { fontSize: 13, color: "#888", paddingHorizontal: 16, marginTop: 8, marginBottom: 4 },
  petList: { flex: 1 },
  listContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 17, fontWeight: "600", color: "#333", marginBottom: 6 },
  emptySubtext: { fontSize: 14, color: "#888", textAlign: "center", paddingHorizontal: 20 },
});
