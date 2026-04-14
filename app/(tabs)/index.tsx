import { useState } from "react";
import {
  View, Text, StyleSheet, TextInput,
  ScrollView, Image, Pressable, ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { pets } from "../../src/data/pets";
import { useSession } from "../../src/context/SessionContext";
import { useFavoritos } from "../../src/context/FavoritosContext";
import { useLocalizacao } from "../../src/hooks/useLocalizacao";
import PetCard from "../../src/components/PetCard";

const categorias = [
  { label: "Cães",   filtro: "Cães",  image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400" },
  { label: "Gatos",  filtro: "Gatos", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400" },
  { label: "Perto",  filtro: "Perto de mim", image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400" },
];

const maneiras = [
  { label: "Voluntariado",      image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400" },
  { label: "Comprar Alimentos", image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400" },
  { label: "Doações",           image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400" },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { usuario } = useSession();
  const { favoritos } = useFavoritos();
  const { localizacao, carregando: locCarregando, solicitarPermissao, permissaoNegada } = useLocalizacao();
  const [busca, setBusca] = useState("");

  const primeiroNome = usuario?.nome?.split(" ")[0] ?? "Visitante";

  const petsFiltrados = pets.filter((pet) => {
    const termo = busca.toLowerCase();
    return (
      pet.nome.toLowerCase().includes(termo) ||
      pet.raca.toLowerCase().includes(termo) ||
      pet.local.toLowerCase().includes(termo) ||
      pet.especie.toLowerCase().includes(termo)
    );
  });

  // Label da localização no header
  const localLabel = locCarregando
    ? "Detectando..."
    : localizacao
    ? `${localizacao.cidade}, ${localizacao.estado}`
    : permissaoNegada
    ? "Localização negada"
    : "Sem localização";

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Header com GPS */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Olá, {primeiroNome}! 👋</Text>
            <Pressable
              style={styles.locationRow}
              onPress={permissaoNegada ? solicitarPermissao : undefined}
            >
              <Text style={styles.locationPin}>📍</Text>
              {locCarregando ? (
                <ActivityIndicator size="small" color="#2F80ED" style={{ marginLeft: 4 }} />
              ) : (
                <Text style={styles.locationText} numberOfLines={1}>
                  {localLabel}
                </Text>
              )}
              {permissaoNegada && (
                <Text style={styles.locationRetry}> · Permitir</Text>
              )}
            </Pressable>
          </View>
          <Pressable style={styles.bellButton}>
            <Text style={styles.bellIcon}>🔔</Text>
          </Pressable>
        </View>

        {/* Barra de busca */}
        <View style={styles.searchRow}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar pet por nome, raça ou cidade"
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

        {/* Resultado da busca */}
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
            {/* Ações rápidas */}
            <Pressable style={styles.actionCard} onPress={() => router.push("/adotar")}>
              <View style={[styles.actionIcon, { backgroundColor: "#2F80ED" }]}>
                <Text style={styles.actionIconText}>🐾</Text>
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Adotar</Text>
                <Text style={styles.actionSubtitle}>
                  {localizacao
                    ? `Pets disponíveis em ${localizacao.cidade}`
                    : "Encontre um pet para adotar"}
                </Text>
              </View>
              <Text style={styles.actionChevron}>›</Text>
            </Pressable>

            <Pressable style={styles.actionCard} onPress={() => router.push("/(tabs)/favoritos")}>
              <View style={[styles.actionIcon, { backgroundColor: "#E8452A" }]}>
                <Text style={styles.actionIconText}>❤️</Text>
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Favoritos</Text>
                <Text style={styles.actionSubtitle}>
                  {favoritos.length > 0
                    ? `${favoritos.length} pet${favoritos.length > 1 ? "s" : ""} salvo${favoritos.length > 1 ? "s" : ""}`
                    : "Veja os pets que você salvou"}
                </Text>
              </View>
              <Text style={styles.actionChevron}>›</Text>
            </Pressable>

            <Pressable style={styles.actionCard} onPress={() => router.push("/cadastrar-pet")}>
              <View style={[styles.actionIcon, { backgroundColor: "#1E9E52" }]}>
                <Text style={styles.actionIconText}>➕</Text>
              </View>
              <View style={styles.actionText}>
                <Text style={styles.actionTitle}>Cadastrar Pet</Text>
                <Text style={styles.actionSubtitle}>Coloque um pet para adoção</Text>
              </View>
              <Text style={styles.actionChevron}>›</Text>
            </Pressable>

            {/* Categorias */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categorias</Text>
              <Pressable onPress={() => router.push("/adotar")}>
                <Text style={styles.seeAll}>Ver todas</Text>
              </Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {categorias.map((cat) => (
                <Pressable
                  key={cat.label}
                  style={styles.categoryCard}
                  onPress={() => router.push({
                    pathname: "/adotar",
                    params: {
                      filtroInicial: cat.filtro,
                      ...(cat.filtro === "Perto de mim" && localizacao
                        ? { cidadeUsuario: localizacao.cidade, estadoUsuario: localizacao.estado }
                        : {}),
                    },
                  })}
                >
                  <Image source={{ uri: cat.image }} style={styles.categoryImage} />
                  <View style={styles.categoryLabelRow}>
                    {cat.filtro === "Perto de mim" && <Text style={{ fontSize: 11 }}>📍 </Text>}
                    <Text style={styles.categoryLabel}>{cat.label}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>

            {/* Como ajudar */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Como ajudar</Text>
              <Pressable onPress={() => router.push("/ajudar")}>
                <Text style={styles.seeAll}>Ver mais</Text>
              </Pressable>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {maneiras.map((item) => (
                <Pressable key={item.label} style={styles.helpCard} onPress={() => router.push("/ajudar")}>
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
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  greeting: { fontSize: 14, color: "#666", marginBottom: 4 },
  locationRow: { flexDirection: "row", alignItems: "center" },
  locationPin: { fontSize: 13 },
  locationText: { fontSize: 15, fontWeight: "700", color: "#111", marginLeft: 4, maxWidth: 200 },
  locationRetry: { fontSize: 13, color: "#2F80ED", fontWeight: "600" },
  bellButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#F0F0F0", justifyContent: "center", alignItems: "center" },
  bellIcon: { fontSize: 18 },
  searchRow: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#CCC", borderRadius: 12,
    paddingHorizontal: 12, marginBottom: 20, backgroundColor: "#FAFAFA",
  },
  searchIcon: { fontSize: 16, marginRight: 8, color: "#999" },
  searchInput: { flex: 1, paddingVertical: 13, fontSize: 15, color: "#111" },
  clearIcon: { fontSize: 14, color: "#999", paddingLeft: 8 },
  actionCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#F7F9FF", borderRadius: 14,
    padding: 14, marginBottom: 10, gap: 12,
    borderWidth: 1, borderColor: "#EEF2FF",
  },
  actionIcon: { width: 46, height: 46, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  actionIconText: { fontSize: 20 },
  actionText: { flex: 1 },
  actionTitle: { fontSize: 15, fontWeight: "700", color: "#111", marginBottom: 2 },
  actionSubtitle: { fontSize: 12, color: "#666" },
  actionChevron: { fontSize: 22, color: "#BBB" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12, marginTop: 16 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: "#111" },
  seeAll: { fontSize: 14, color: "#2F80ED", fontWeight: "600" },
  horizontalScroll: { marginBottom: 8 },
  categoryCard: { width: 140, borderRadius: 14, borderWidth: 1.5, borderColor: "#2ABFBF", overflow: "hidden", marginRight: 12 },
  categoryImage: { width: "100%", height: 110, resizeMode: "cover" },
  categoryLabelRow: { flexDirection: "row", alignItems: "center", padding: 10 },
  categoryLabel: { fontSize: 14, fontWeight: "700", color: "#111" },
  helpCard: { width: 130, marginRight: 12 },
  helpImage: { width: "100%", height: 100, borderRadius: 12, resizeMode: "cover", marginBottom: 6 },
  helpLabel: { fontSize: 13, color: "#333", fontWeight: "500" },
  emptyText: { color: "#888", fontSize: 15, textAlign: "center", marginTop: 16 },
});
