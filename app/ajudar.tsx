import { router } from "expo-router";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
/*
Tecnicamente a função de ajudar não faz nada, mas agora tem a página 
*/ 
const formasDeAjuda = [
  {
    id: "voluntariado",
    titulo: "Voluntariado",
    emoji: "🤝",
    cor: "#EAF6FF",
    corBorda: "#BFD9FF",
    corTitulo: "#1565C0",
    descricao:
      "Doe seu tempo ajudando a cuidar dos animais nos abrigos parceiros. Atividades incluem banho, passeio, socialização e apoio administrativo.",
    imagem: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600",
    acoes: [
      { label: "Ver abrigos próximos", url: "https://www.instagram.com/" },
      { label: "Formulário de voluntário", url: "https://forms.google.com" },
    ],
    dicas: [
      "Disponibilidade mínima de 2h/semana",
      "Não é necessária experiência prévia",
      "Treinamento fornecido pelo abrigo",
    ],
  },
  {
    id: "alimentos",
    titulo: "Comprar Alimentos",
    emoji: "🦴",
    cor: "#FFF3E0",
    corBorda: "#FFCC80",
    corTitulo: "#E65100",
    descricao:
      "Compre ração, petiscos e suplementos para os pets dos abrigos. Você pode entregar diretamente ou enviar para o endereço do abrigo.",
    imagem: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=600",
    acoes: [
      { label: "Lista de necessidades", url: "https://www.google.com" },
    ],
    dicas: [
      "Ração Premium Adulto — maior demanda",
      "Ração filhote — cães e gatos",
      "Medicamentos e vermífugos",
    ],
  },
  {
    id: "doacoes",
    titulo: "Doações",
    emoji: "❤️",
    cor: "#FCE4EC",
    corBorda: "#F48FB1",
    corTitulo: "#C62828",
    descricao:
      "Doe via Pix ou transferência bancária para custear tratamentos veterinários, vacinas e a manutenção dos abrigos parceiros.",
    imagem: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600",
    acoes: [
      {
        label: "Copiar Pix",
        pix: true,
        url: "petfind@exemplo.com",
      },
    ],
    dicas: [
      "100% revertido aos animais",
      "Recibo disponível para doações acima de R$50",
      "Doações mensais fazem a diferença",
    ],
  },
];

export default function AjudarScreen() {
  const insets = useSafeAreaInsets();

  async function handleAcao(acao: { label: string; url: string; pix?: boolean }) {
    if (acao.pix) {
      Alert.alert(
        "Chave Pix copiada!",
        `Chave: ${acao.url}\n\nObrigado por contribuir! Cada doação faz a diferença.`
      );
      return;
    }
    const supported = await Linking.canOpenURL(acao.url);
    if (supported) {
      Linking.openURL(acao.url);
    } else {
      Alert.alert("Indisponível", "Não foi possível abrir o link.");
    }
  }

  return (
    <View style={[styles.safe, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Como Ajudar</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Existem diversas formas de fazer a diferença na vida dos animais.
          Escolha a que se encaixa melhor no seu dia a dia!
        </Text>

        {formasDeAjuda.map((item) => (
          <View
            key={item.id}
            style={[styles.card, { backgroundColor: item.cor, borderColor: item.corBorda }]}
          >
            <Image source={{ uri: item.imagem }} style={styles.cardImage} />

            <View style={styles.cardBody}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardEmoji}>{item.emoji}</Text>
                <Text style={[styles.cardTitle, { color: item.corTitulo }]}>
                  {item.titulo}
                </Text>
              </View>

              <Text style={styles.cardDesc}>{item.descricao}</Text>

              <View style={styles.dicasBox}>
                <Text style={styles.dicasTitle}>📌 Informações úteis:</Text>
                {item.dicas.map((d, i) => (
                  <Text key={i} style={styles.dica}>• {d}</Text>
                ))}
              </View>

              <View style={styles.acoesRow}>
                {item.acoes.map((acao, i) => (
                  <Pressable
                    key={i}
                    style={[styles.acaoBtn, { borderColor: item.corTitulo }]}
                    onPress={() => handleAcao(acao)}
                  >
                    <Text style={[styles.acaoBtnText, { color: item.corTitulo }]}>
                      {acao.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        ))}

        <View style={styles.footerCard}>
          <Text style={styles.footerTitle}>Tem um abrigo?</Text>
          <Text style={styles.footerText}>
            Cadastre sua ONG ou abrigo na plataforma e conecte-se com potenciais adotantes e voluntários.
          </Text>
          <Pressable
            style={styles.footerBtn}
            onPress={() => Alert.alert("Em breve!", "Funcionalidade de cadastro de abrigos chegando em breve.")}
          >
            <Text style={styles.footerBtnText}>Cadastrar abrigo</Text>
          </Pressable>
        </View>

        <View style={{ height: 32 }} />
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
  content: { padding: 20 },
  intro: {
    fontSize: 15, color: "#555", lineHeight: 22,
    marginBottom: 24, textAlign: "center",
  },
  card: {
    borderRadius: 18, borderWidth: 1.5,
    overflow: "hidden", marginBottom: 20,
  },
  cardImage: { width: "100%", height: 160, resizeMode: "cover" },
  cardBody: { padding: 18 },
  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  cardEmoji: { fontSize: 26 },
  cardTitle: { fontSize: 20, fontWeight: "800" },
  cardDesc: { fontSize: 14, color: "#444", lineHeight: 22, marginBottom: 14 },
  dicasBox: {
    backgroundColor: "rgba(255,255,255,0.6)", borderRadius: 12,
    padding: 12, marginBottom: 16,
  },
  dicasTitle: { fontSize: 13, fontWeight: "700", color: "#333", marginBottom: 6 },
  dica: { fontSize: 13, color: "#555", marginBottom: 4 },
  acoesRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  acaoBtn: {
    borderWidth: 1.5, borderRadius: 10,
    paddingHorizontal: 18, paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  acaoBtnText: { fontSize: 14, fontWeight: "700" },
  footerCard: {
    backgroundColor: "#F7F9FF", borderRadius: 18,
    padding: 20, borderWidth: 1, borderColor: "#DDE8FF", alignItems: "center",
  },
  footerTitle: { fontSize: 18, fontWeight: "800", color: "#111", marginBottom: 8 },
  footerText: { fontSize: 14, color: "#555", textAlign: "center", lineHeight: 22, marginBottom: 16 },
  footerBtn: {
    backgroundColor: "#2F80ED", paddingHorizontal: 24,
    paddingVertical: 12, borderRadius: 12,
  },
  footerBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
