import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  Share,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { pets } from "../../src/data/pets";

export default function PetDetailsScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [favorito, setFavorito] = useState(false);

  const pet = pets.find((item) => item.id === id);

  if (!pet) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.notFoundText}>Pet não encontrado.</Text>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  async function handleShare() {
    try {
      await Share.share({
        message: `Olha esse pet incrível para adoção: ${pet!.nome}, ${pet!.raca} em ${pet!.local}!`,
      });
    } catch {
      Alert.alert("Erro", "Não foi possível compartilhar.");
    }
  }

  return (
    <View style={styles.safe}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.headerBtn} onPress={() => router.back()}>
          <Text style={styles.headerBtnText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Detalhes Pet</Text>
        <Pressable style={styles.headerBtn} onPress={handleShare}>
          <Text style={styles.headerBtnText}>⎙</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        <View style={styles.imageWrapper}>
          {pet.imagem ? (
            <Image source={{ uri: pet.imagem }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={{ fontSize: 56 }}>🐾</Text>
            </View>
          )}
          <Pressable
            style={[styles.heartButton, favorito && styles.heartButtonActive]}
            onPress={() => setFavorito(!favorito)}
          >
            <Text style={styles.heartIcon}>{favorito ? "❤️" : "🤍"}</Text>
          </Pressable>
          <View style={styles.dots}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
            ))}
          </View>
        </View>

        {/* Nome */}
        <View style={styles.nameRow}>
          <Text style={styles.petName}>{pet.nome} </Text>
          <Text style={styles.petSpecies}>- {pet.especie}</Text>
        </View>

        {/* Informações */}
        <View style={styles.badgesRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>Gênero</Text>
            <Text style={styles.badgeValue}>{pet.sexo}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>Idade</Text>
            <Text style={styles.badgeValue}>{pet.idade}</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeLabel}>Raça</Text>
            <Text style={styles.badgeValue}>{pet.raca}</Text>
          </View>
        </View>

        {/* Instituição ou o tutor atual */}
        <View style={styles.institutionCard}>
          <View style={styles.institutionAvatar}>
            <Text style={{ fontSize: 22 }}>🏠</Text>
          </View>
          <View style={styles.institutionInfo}>
            <Text style={styles.institutionName}>Canil Doce Lar</Text>
            <Text style={styles.institutionType}>Instituição</Text>
          </View>
          <View style={styles.institutionActions}>
            <Pressable style={styles.institutionBtn} onPress={() => Alert.alert("Ligar", "Em breve!")}>
              <Text style={styles.institutionBtnIcon}>📞</Text>
            </Pressable>
            <Pressable style={styles.institutionBtn} onPress={() => Alert.alert("Mensagem", "Em breve!")}>
              <Text style={styles.institutionBtnIcon}>💬</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Sobre pet:</Text>
        <Text style={styles.description}>{pet.descricao}</Text>

        <Text style={styles.sectionTitle}>Personalidade:</Text>
        <View style={styles.personalityRow}>
          {pet.personalidade.map((trait) => (
            <View key={trait} style={styles.chip}>
              <Text style={styles.chipText}>{trait}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Informações:</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoText}>
            🔵 Vacinado: <Text style={styles.infoBold}>{pet.vacinado ? "Sim" : "Não"}</Text>
          </Text>
          <Text style={styles.infoText}>
            🔵 Castrado: <Text style={styles.infoBold}>{pet.castrado ? "Sim" : "Não"}</Text>
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Cuidados Especiais:</Text>
        <Text style={styles.description}>Não possui necessidades especiais.</Text>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          style={styles.adoptButton}
          onPress={() => Alert.alert("Adoção", `Você demonstrou interesse em adotar ${pet.nome}!`)}
        >
          <Text style={styles.adoptButtonText}>Quero Adotar!</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#fff" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#F0F0F0",
  },
  headerBtn: { width: 36, height: 36, justifyContent: "center", alignItems: "center" },
  headerBtnText: { fontSize: 28, color: "#111", lineHeight: 32 },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#111" },
  container: { flex: 1 },
  content: { paddingBottom: 32 },
  imageWrapper: { width: "100%", height: 300, position: "relative" },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  imagePlaceholder: { width: "100%", height: "100%", backgroundColor: "#EAEAEA", justifyContent: "center", alignItems: "center" },
  heartButton: {
    position: "absolute", top: 16, right: 16,
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "#2F80ED", justifyContent: "center", alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4,
  },
  heartButtonActive: { backgroundColor: "#E8452A" },
  heartIcon: { fontSize: 20 },
  dots: { position: "absolute", bottom: 12, left: 0, right: 0, flexDirection: "row", justifyContent: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.5)" },
  dotActive: { backgroundColor: "#fff" },
  nameRow: { flexDirection: "row", alignItems: "baseline", paddingHorizontal: 20, paddingTop: 20, marginBottom: 16 },
  petName: { fontSize: 24, fontWeight: "800", color: "#111" },
  petSpecies: { fontSize: 20, fontWeight: "400", color: "#888" },
  badgesRow: { flexDirection: "row", gap: 10, paddingHorizontal: 20, marginBottom: 20 },
  badge: { flex: 1, backgroundColor: "#EAF6F6", borderRadius: 12, padding: 12 },
  badgeLabel: { fontSize: 11, color: "#888", marginBottom: 4 },
  badgeValue: { fontSize: 14, fontWeight: "700", color: "#111" },
  institutionCard: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#E0E0E0", borderRadius: 14,
    padding: 14, marginHorizontal: 20, marginBottom: 24, gap: 12,
  },
  institutionAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#F0F0F0", justifyContent: "center", alignItems: "center" },
  institutionInfo: { flex: 1 },
  institutionName: { fontSize: 15, fontWeight: "700", color: "#111" },
  institutionType: { fontSize: 13, color: "#888" },
  institutionActions: { flexDirection: "row", gap: 8 },
  institutionBtn: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: "#DDD", justifyContent: "center", alignItems: "center" },
  institutionBtnIcon: { fontSize: 16 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: "#111", paddingHorizontal: 20, marginBottom: 8, marginTop: 4 },
  description: { fontSize: 14, lineHeight: 22, color: "#444", paddingHorizontal: 20, marginBottom: 20, textAlign: "justify" },
  personalityRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 20, marginBottom: 20 },
  chip: { backgroundColor: "#E8F0FE", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  chipText: { fontSize: 13, fontWeight: "600", color: "#2F80ED" },
  infoRow: { paddingHorizontal: 20, marginBottom: 20, gap: 6 },
  infoText: { fontSize: 14, color: "#444" },
  infoBold: { fontWeight: "700", color: "#111" },
  bottomBar: { paddingHorizontal: 20, paddingTop: 12, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#F0F0F0" },
  adoptButton: { backgroundColor: "#2F80ED", paddingVertical: 16, borderRadius: 14, alignItems: "center" },
  adoptButtonText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  notFoundText: { fontSize: 18, marginBottom: 16, color: "#333" },
  backButton: { backgroundColor: "#2F80ED", paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  backButtonText: { color: "#fff", fontWeight: "bold" },
});
