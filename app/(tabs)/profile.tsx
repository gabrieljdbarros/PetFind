import { View, Text, StyleSheet, Pressable, Alert, ScrollView } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSession } from "../../src/context/SessionContext";
import { logout as firebaseLogout } from "../../src/services/authService";
import { useFavoritos } from "../../src/context/FavoritosContext";
import { useConexao } from "../../src/hooks/useConexao";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { usuario, setUsuario } = useSession();
  const { favoritos } = useFavoritos();
  const { online, isWifi, tipo } = useConexao();

  async function handleLogout() {
    Alert.alert("Sair", "Deseja realmente sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          try {
            await firebaseLogout();
            setUsuario(null);
            router.replace("/login");
          } catch {
            Alert.alert("Erro", "Não foi possível sair. Tente novamente.");
          }
        },
      },
    ]);
  }

  const tipoConexaoLabel = !online
    ? "Offline"
    : isWifi
    ? "Wi-Fi"
    : tipo === "cellular"
    ? "Dados móveis"
    : "Conectado";

  const tipoConexaoEmoji = !online ? "🔴" : isWifi ? "📶" : "📡";

  return (
    <ScrollView
      style={styles.safe}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 12 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar e nome */}
      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {usuario?.nome?.charAt(0).toUpperCase() ?? "?"}
          </Text>
        </View>
        <Text style={styles.nomeText}>{usuario?.nome}</Text>
        <Text style={styles.emailText}>{usuario?.email}</Text>
      </View>

      {/* Info da conta */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Dados da conta</Text>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Nome</Text>
          <Text style={styles.rowValue}>{usuario?.nome ?? "—"}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.row}>
          <Text style={styles.rowLabel}>E-mail</Text>
          <Text style={styles.rowValue}>{usuario?.email ?? "—"}</Text>
        </View>
        <View style={styles.divider} />

        {usuario?.cidade ? (
          <>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Cidade</Text>
              <Text style={styles.rowValue}>{usuario.cidade}</Text>
            </View>
            <View style={styles.divider} />
          </>
        ) : null}

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Pets favoritos</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{favoritos.length}</Text>
          </View>
        </View>
      </View>

      {/* Status de conexão — recurso nativo */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Conexão</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Status</Text>
          <View style={styles.conexaoRow}>
            <Text style={styles.conexaoEmoji}>{tipoConexaoEmoji}</Text>
            <Text style={[styles.rowValue, !online && { color: "#D0021B" }]}>
              {tipoConexaoLabel}
            </Text>
          </View>
        </View>
      </View>

      {/* Ações */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F9FF" },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  avatarSection: { alignItems: "center", marginBottom: 24 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "#2F80ED", justifyContent: "center",
    alignItems: "center", marginBottom: 12,
  },
  avatarText: { fontSize: 34, fontWeight: "800", color: "#fff" },
  nomeText: { fontSize: 20, fontWeight: "800", color: "#111", marginBottom: 4 },
  emailText: { fontSize: 14, color: "#888" },
  card: {
    backgroundColor: "#fff", borderRadius: 16, padding: 16,
    marginBottom: 16, borderWidth: 1, borderColor: "#EEF2FF",
  },
  cardTitle: { fontSize: 13, fontWeight: "700", color: "#2F80ED", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 },
  rowLabel: { fontSize: 14, color: "#888" },
  rowValue: { fontSize: 14, fontWeight: "600", color: "#111", flexShrink: 1, textAlign: "right", maxWidth: "60%" },
  divider: { height: 1, backgroundColor: "#F0F0F0" },
  badge: { backgroundColor: "#2F80ED", borderRadius: 12, paddingHorizontal: 10, paddingVertical: 2 },
  badgeText: { color: "#fff", fontSize: 13, fontWeight: "700" },
  conexaoRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  conexaoEmoji: { fontSize: 16 },
  logoutButton: {
    backgroundColor: "#FF4444", paddingVertical: 16,
    borderRadius: 14, alignItems: "center",
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
