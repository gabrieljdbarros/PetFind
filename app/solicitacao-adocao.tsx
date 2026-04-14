import {
  View, Text, StyleSheet, ScrollView,
  TextInput, Pressable, Alert, Image,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFormik } from "formik";
import * as Yup from "yup";
import { pets } from "../src/data/pets";
import { useSession } from "../src/context/SessionContext";
import { enviarSolicitacao } from "../src/services/petsService";

const SolicitacaoSchema = Yup.object().shape({
  telefone: Yup.string()
    .min(10, "Telefone inválido")
    .required("Telefone é obrigatório"),
  moradia: Yup.string().required("Selecione o tipo de moradia"),
  temOutrosAnimais: Yup.string().required("Responda esta pergunta"),
  temCriancas: Yup.string().required("Responda esta pergunta"),
  motivacao: Yup.string()
    .min(20, "Conte um pouco mais (mínimo 20 caracteres)")
    .required("Conte sua motivação"),
});

const MORADIA_OPTIONS = ["Casa com quintal", "Casa sem quintal", "Apartamento", "Sítio/Fazenda"];

function formatarTelefone(valor: string): string {
  const digits = valor.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
  }
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
}

export default function SolicitacaoAdocaoScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const { usuario } = useSession();

  const pet = pets.find((p) => p.id === id);

  const formik = useFormik({
    initialValues: {
      telefone: "",
      moradia: "",
      temOutrosAnimais: "",
      temCriancas: "",
      motivacao: "",
    },
    validationSchema: SolicitacaoSchema,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        await enviarSolicitacao({
          petId: pet?.id ?? "",
          petNome: pet?.nome ?? "",
          solicitanteUid: usuario?.uid ?? "",
          solicitanteNome: usuario?.nome ?? "",
          solicitanteEmail: usuario?.email ?? "",
          telefone: values.telefone,
          moradia: values.moradia,
          temOutrosAnimais: values.temOutrosAnimais,
          temCriancas: values.temCriancas,
          motivacao: values.motivacao,
        });
        Alert.alert(
          "Solicitação Enviada! 🎉",
          `Sua solicitação para adotar ${pet?.nome} foi enviada com sucesso.\n\nO abrigo entrará em contato em breve pelo número informado.`,
          [{ text: "Ótimo!", onPress: () => router.replace("/(tabs)") }]
        );
      } catch {
        Alert.alert("Erro", "Não foi possível enviar a solicitação. Verifique sua conexão.");
      }
    },
  });

  if (!pet) {
    return (
      <View style={styles.centered}>
        <Text>Pet não encontrado.</Text>
        <Pressable onPress={() => router.back()}><Text style={{ color: "#2F80ED" }}>Voltar</Text></Pressable>
      </View>
    );
  }

  return (
    <View style={styles.safe}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.headerBtn} onPress={() => router.back()}>
          <Text style={styles.headerBtnText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Solicitação de Adoção</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Resumo do pet */}
        <View style={styles.petCard}>
          {pet.imagem ? (
            <Image source={{ uri: pet.imagem }} style={styles.petThumb} />
          ) : (
            <View style={[styles.petThumb, styles.petThumbPlaceholder]}>
              <Text style={{ fontSize: 28 }}>🐾</Text>
            </View>
          )}
          <View style={styles.petInfo}>
            <Text style={styles.petName}>{pet.nome}</Text>
            <Text style={styles.petSub}>{pet.especie} • {pet.raca}</Text>
            <Text style={styles.petSub}>📍 {pet.local}</Text>
          </View>
        </View>

        {/* Dados do solicitante */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seus dados</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nome</Text>
            <Text style={styles.infoValue}>{usuario?.nome ?? "—"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>E-mail</Text>
            <Text style={styles.infoValue}>{usuario?.email ?? "—"}</Text>
          </View>

          <Text style={styles.label}>Telefone para contato:</Text>
          <TextInput
            style={[
              styles.input,
              formik.touched.telefone && formik.errors.telefone ? styles.inputError : null,
            ]}
            placeholder="(00) 00000-0000"
            placeholderTextColor="#AAA"
            keyboardType="phone-pad"
            value={formik.values.telefone}
            onChangeText={(v) => formik.setFieldValue("telefone", formatarTelefone(v))}
            onBlur={formik.handleBlur("telefone")}
          />
          {formik.touched.telefone && formik.errors.telefone && (
            <Text style={styles.errorText}>{formik.errors.telefone}</Text>
          )}
        </View>

        {/* Moradia */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre sua moradia</Text>
          <Text style={styles.label}>Tipo de moradia:</Text>
          <View style={styles.optionsGrid}>
            {MORADIA_OPTIONS.map((op) => (
              <Pressable
                key={op}
                style={[
                  styles.optionChip,
                  formik.values.moradia === op && styles.optionChipActive,
                ]}
                onPress={() => formik.setFieldValue("moradia", op)}
              >
                <Text style={[
                  styles.optionText,
                  formik.values.moradia === op && styles.optionTextActive,
                ]}>
                  {op}
                </Text>
              </Pressable>
            ))}
          </View>
          {formik.touched.moradia && formik.errors.moradia && (
            <Text style={styles.errorText}>{formik.errors.moradia}</Text>
          )}
        </View>

        {/* Outros animais */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações adicionais</Text>

          <Text style={styles.label}>Tem outros animais em casa?</Text>
          <View style={styles.radioRow}>
            {["Sim", "Não"].map((op) => (
              <Pressable
                key={op}
                style={[
                  styles.radioChip,
                  formik.values.temOutrosAnimais === op && styles.radioChipActive,
                ]}
                onPress={() => formik.setFieldValue("temOutrosAnimais", op)}
              >
                <Text style={[
                  styles.radioText,
                  formik.values.temOutrosAnimais === op && styles.radioTextActive,
                ]}>
                  {op}
                </Text>
              </Pressable>
            ))}
          </View>
          {formik.touched.temOutrosAnimais && formik.errors.temOutrosAnimais && (
            <Text style={styles.errorText}>{formik.errors.temOutrosAnimais}</Text>
          )}

          <Text style={styles.label}>Tem crianças em casa?</Text>
          <View style={styles.radioRow}>
            {["Sim", "Não"].map((op) => (
              <Pressable
                key={op}
                style={[
                  styles.radioChip,
                  formik.values.temCriancas === op && styles.radioChipActive,
                ]}
                onPress={() => formik.setFieldValue("temCriancas", op)}
              >
                <Text style={[
                  styles.radioText,
                  formik.values.temCriancas === op && styles.radioTextActive,
                ]}>
                  {op}
                </Text>
              </Pressable>
            ))}
          </View>
          {formik.touched.temCriancas && formik.errors.temCriancas && (
            <Text style={styles.errorText}>{formik.errors.temCriancas}</Text>
          )}
        </View>

        {/* Motivação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Motivação</Text>
          <Text style={styles.label}>Por que você quer adotar {pet.nome}?</Text>
          <TextInput
            style={[
              styles.textarea,
              formik.touched.motivacao && formik.errors.motivacao ? styles.inputError : null,
            ]}
            placeholder="Conte um pouco sobre você e por que quer adotar este pet..."
            placeholderTextColor="#AAA"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={formik.values.motivacao}
            onChangeText={formik.handleChange("motivacao")}
            onBlur={formik.handleBlur("motivacao")}
          />
          <Text style={styles.charCount}>{formik.values.motivacao.length} caracteres</Text>
          {formik.touched.motivacao && formik.errors.motivacao && (
            <Text style={styles.errorText}>{formik.errors.motivacao}</Text>
          )}
        </View>

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            ℹ️ Sua solicitação será analisada pelo abrigo. O processo de adoção pode incluir entrevista e visita domiciliar.
          </Text>
        </View>

        <Pressable
          style={[styles.submitBtn, !formik.isValid && styles.submitBtnDisabled]}
          onPress={() => formik.handleSubmit()}
        >
          <Text style={styles.submitBtnText}>Enviar Solicitação 🐾</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 12,
    backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#F0F0F0",
  },
  headerBtn: { width: 36, height: 36, justifyContent: "center", alignItems: "center" },
  headerBtnText: { fontSize: 28, color: "#111", lineHeight: 32 },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#111" },
  content: { padding: 20 },
  petCard: {
    flexDirection: "row", gap: 14, alignItems: "center",
    backgroundColor: "#F7F9FF", borderRadius: 16, padding: 14, marginBottom: 24,
    borderWidth: 1, borderColor: "#DDE8FF",
  },
  petThumb: { width: 72, height: 72, borderRadius: 12 },
  petThumbPlaceholder: { backgroundColor: "#EEE", justifyContent: "center", alignItems: "center" },
  petInfo: { flex: 1 },
  petName: { fontSize: 18, fontWeight: "800", color: "#111", marginBottom: 4 },
  petSub: { fontSize: 13, color: "#666", marginBottom: 2 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#111", marginBottom: 14 },
  infoRow: {
    flexDirection: "row", justifyContent: "space-between",
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#F0F0F0",
  },
  infoLabel: { fontSize: 14, color: "#888" },
  infoValue: { fontSize: 14, fontWeight: "600", color: "#111" },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginTop: 14, marginBottom: 8 },
  input: {
    borderWidth: 1, borderColor: "#CCC", borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: "#111",
  },
  inputError: { borderColor: "#D0021B" },
  textarea: {
    borderWidth: 1, borderColor: "#CCC", borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: "#111",
    minHeight: 110,
  },
  charCount: { fontSize: 12, color: "#AAA", textAlign: "right", marginTop: 4 },
  errorText: { color: "#D0021B", fontSize: 13, marginTop: 4 },
  optionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  optionChip: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1.5, borderColor: "#DDD", backgroundColor: "#fff",
  },
  optionChipActive: { borderColor: "#2F80ED", backgroundColor: "#EAF0FF" },
  optionText: { fontSize: 14, color: "#555", fontWeight: "500" },
  optionTextActive: { color: "#2F80ED", fontWeight: "700" },
  radioRow: { flexDirection: "row", gap: 12 },
  radioChip: {
    flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center",
    borderWidth: 1.5, borderColor: "#DDD", backgroundColor: "#fff",
  },
  radioChipActive: { borderColor: "#2F80ED", backgroundColor: "#EAF0FF" },
  radioText: { fontSize: 15, color: "#555", fontWeight: "600" },
  radioTextActive: { color: "#2F80ED" },
  disclaimer: {
    backgroundColor: "#FFFBEA", borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: "#FFE58F", marginBottom: 20,
  },
  disclaimerText: { fontSize: 13, color: "#7A6500", lineHeight: 20 },
  submitBtn: {
    backgroundColor: "#2F80ED", paddingVertical: 17,
    borderRadius: 14, alignItems: "center",
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});
