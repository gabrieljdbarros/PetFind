import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useFormik } from "formik";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert, Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Yup from "yup";
import { useSession } from "../src/context/SessionContext";
import { cadastrarPet } from "../src/services/petsService";

const CadastroPetSchema = Yup.object().shape({
  nome: Yup.string().min(2, "Nome muito curto").required("Nome é obrigatório"),
  especie: Yup.string().required("Selecione a espécie"),
  raca: Yup.string().required("Raça é obrigatória"),
  idade: Yup.string().required("Idade é obrigatória"),
  sexo: Yup.string().required("Selecione o sexo"),
  porte: Yup.string().required("Selecione o porte"),
  local: Yup.string().required("Cidade/UF é obrigatório"),
  descricao: Yup.string().min(20, "Descreva mais o pet").required("Descrição é obrigatória"),
});

const ESPECIES = ["Cão", "Gato", "Pássaro", "Coelho", "Outro"];
const PORTES = ["Pequeno", "Médio", "Grande"];
const SEXOS = ["Macho", "Fêmea"];
const PERSONALIDADES = [
  "Brincalhão", "Dócil", "Sociável", "Calmo", "Carinhoso",
  "Independente", "Protetor", "Tímido", "Curioso", "Companheiro",
];

function ChipSelector({
  label, options, value, onChange, error,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <View style={{ marginBottom: 4 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipsWrap}>
        {options.map((op) => (
          <Pressable
            key={op}
            style={[styles.optionChip, value === op && styles.optionChipActive]}
            onPress={() => onChange(op)}
          >
            <Text style={[styles.optionText, value === op && styles.optionTextActive]}>{op}</Text>
          </Pressable>
        ))}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

type InputFieldProps = {
  label: string;
  value: string;
  error?: string | false;
  touched?: boolean;
  onChangeText: (v: string) => void;
  onBlur: () => void;
  placeholder?: string;
  keyboard?: any;
  multiline?: boolean;
};

function InputField({
  label, value, error, onChangeText, onBlur, placeholder, keyboard, multiline,
}: InputFieldProps) {
  return (
    <View style={{ marginBottom: 4 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null, multiline && styles.textarea]}
        placeholder={placeholder}
        placeholderTextColor="#AAA"
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        keyboardType={keyboard}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical={multiline ? "top" : "center"}
        autoCorrect={false}
        autoComplete="off"
/>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}


export default function CadastrarPetScreen() {
  const insets = useSafeAreaInsets();
  const { usuario } = useSession();
  const [imagemUri, setImagemUri] = useState<string | null>(null);
  const [carregandoImagem, setCarregandoImagem] = useState(false);

  
  async function abrirCamera() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Precisamos de acesso à câmera para tirar uma foto.");
      return;
    }
    setCarregandoImagem(true);
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    setCarregandoImagem(false);
    if (!result.canceled) {
      setImagemUri(result.assets[0].uri);
    }
  }

  async function abrirGaleria() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão negada", "Precisamos de acesso à galeria para selecionar uma foto.");
      return;
    }
    setCarregandoImagem(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });
    setCarregandoImagem(false);
    if (!result.canceled) {
      setImagemUri(result.assets[0].uri);
    }
  }

  // Fotos
  function handleFoto() {
    Alert.alert("Adicionar foto", "Como deseja adicionar a foto?", [
      { text: "Câmera", onPress: abrirCamera },
      { text: "Galeria", onPress: abrirGaleria },
      { text: "Cancelar", style: "cancel" },
    ]);
  }

  const formik = useFormik({
    initialValues: {
      nome: "",
      especie: "",
      raca: "",
      idade: "",
      sexo: "",
      porte: "",
      local: "",
      descricao: "",
      vacinado: false,
      castrado: false,
      personalidade: [] as string[],
    },
    validationSchema: CadastroPetSchema,
    validateOnBlur: true,
    onSubmit: async (values) => {
      try {
        const novoPet = {
          nome: values.nome,
          especie: values.especie,
          raca: values.raca,
          idade: values.idade,
          sexo: values.sexo,
          porte: values.porte,
          local: values.local,
          descricao: values.descricao,
          vacinado: values.vacinado,
          castrado: values.castrado,
          personalidade: values.personalidade.length > 0 ? values.personalidade : ["Carinhoso"],
          // Usa imagem real se tiver, senão placeholder
          imagem: imagemUri ?? `https://placedog.net/500?id=${Math.floor(Math.random() * 20) + 5}`,
        };
        await cadastrarPet(novoPet, usuario?.uid ?? "anonimo");
        Alert.alert(
          "Pet cadastrado! 🎉",
          `${values.nome} foi adicionado com sucesso e já aparece na lista de adoção.`,
          [{ text: "Ver lista", onPress: () => router.replace("/adotar") }]
        );
      } catch {
        Alert.alert("Erro", "Não foi possível cadastrar o pet. Verifique sua conexão.");
      }
    },
  });

  function togglePersonalidade(trait: string) {
    const atual = formik.values.personalidade;
    formik.setFieldValue(
      "personalidade",
      atual.includes(trait) ? atual.filter((t) => t !== trait) : [...atual, trait]
    );
  }

  return (
    <View style={styles.safe}>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable style={styles.headerBtn} onPress={() => router.back()}>
          <Text style={styles.headerBtnText}>‹</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Cadastrar Pet</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Foto */}
        <Pressable style={styles.photoBox} onPress={handleFoto} disabled={carregandoImagem}>
          {carregandoImagem ? (
            <ActivityIndicator size="large" color="#2F80ED" />
          ) : imagemUri ? (
            <>
              <Image source={{ uri: imagemUri }} style={styles.photoPreview} />
              <View style={styles.photoEditBadge}>
                <Text style={styles.photoEditText}>Alterar foto</Text>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.photoEmoji}>📷</Text>
              <Text style={styles.photoLabel}>Adicionar foto</Text>
              <Text style={styles.photoSub}>Câmera ou galeria</Text>
            </>
          )}
        </Pressable>

        {/* Identificação */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Identificação</Text>
          <InputField
            label="Nome do pet:" placeholder="Ex: Thor, Luna..."
            value={formik.values.nome} error={formik.touched.nome && formik.errors.nome}
            onChangeText={formik.handleChange("nome")} onBlur={() => formik.setFieldTouched("nome")}
          />
          <ChipSelector
            label="Espécie:" options={ESPECIES} value={formik.values.especie}
            onChange={(v) => formik.setFieldValue("especie", v)}
            error={formik.touched.especie ? formik.errors.especie : undefined}
          />
          <InputField
            label="Raça:" placeholder="Ex: SRD, Golden Retriever..."
            value={formik.values.raca} error={formik.touched.raca && formik.errors.raca}
            onChangeText={formik.handleChange("raca")} onBlur={() => formik.setFieldTouched("raca")}
          />
          <InputField
            label="Idade:" placeholder="Ex: 2 anos, 6 meses..."
            value={formik.values.idade} error={formik.touched.idade && formik.errors.idade}
            onChangeText={formik.handleChange("idade")} onBlur={() => formik.setFieldTouched("idade")}
          />
          <ChipSelector
            label="Sexo:" options={SEXOS} value={formik.values.sexo}
            onChange={(v) => formik.setFieldValue("sexo", v)}
            error={formik.touched.sexo ? formik.errors.sexo : undefined}
          />
          <ChipSelector
            label="Porte:" options={PORTES} value={formik.values.porte}
            onChange={(v) => formik.setFieldValue("porte", v)}
            error={formik.touched.porte ? formik.errors.porte : undefined}
          />
          <InputField
            label="Cidade / UF:" placeholder="Ex: Maceió - AL"
            value={formik.values.local} error={formik.touched.local && formik.errors.local}
            onChangeText={formik.handleChange("local")} onBlur={() => formik.setFieldTouched("local")}
          />
        </View>

        {/* Saúde */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saúde</Text>
          <View style={styles.toggleRow}>
            <Pressable
              style={[styles.toggle, formik.values.vacinado && styles.toggleActive]}
              onPress={() => formik.setFieldValue("vacinado", !formik.values.vacinado)}
            >
              <Text style={[styles.toggleText, formik.values.vacinado && styles.toggleTextActive]}>
                {formik.values.vacinado ? "✓ " : ""}Vacinado
              </Text>
            </Pressable>
            <Pressable
              style={[styles.toggle, formik.values.castrado && styles.toggleActive]}
              onPress={() => formik.setFieldValue("castrado", !formik.values.castrado)}
            >
              <Text style={[styles.toggleText, formik.values.castrado && styles.toggleTextActive]}>
                {formik.values.castrado ? "✓ " : ""}Castrado
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Personalidade */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personalidade</Text>
          <Text style={styles.labelSub}>Selecione uma ou mais características:</Text>
          <View style={styles.chipsWrap}>
            {PERSONALIDADES.map((trait) => {
              const selected = formik.values.personalidade.includes(trait);
              return (
                <Pressable
                  key={trait}
                  style={[styles.optionChip, selected && styles.optionChipActive]}
                  onPress={() => togglePersonalidade(trait)}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextActive]}>
                    {selected ? "✓ " : ""}{trait}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Descrição */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <InputField
            label="Conte sobre o pet:"
            placeholder="Personalidade, rotina, necessidades especiais, história..."
            multiline
            value={formik.values.descricao} error={formik.touched.descricao && formik.errors.descricao}
            onChangeText={formik.handleChange("descricao")} onBlur={() => formik.setFieldTouched("descricao")}
          />
          <Text style={styles.charCount}>{formik.values.descricao.length} caracteres</Text>
        </View>

        <Pressable
          style={[styles.submitBtn, !formik.isValid && styles.submitBtnDisabled]}
          onPress={() => formik.handleSubmit()}
        >
          <Text style={styles.submitBtnText}>Cadastrar Pet 🐾</Text>
        </Pressable>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingBottom: 12,
    borderBottomWidth: 1, borderBottomColor: "#F0F0F0",
  },
  headerBtn: { width: 36, height: 36, justifyContent: "center", alignItems: "center" },
  headerBtnText: { fontSize: 28, color: "#111", lineHeight: 32 },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#111" },
  content: { padding: 20 },
  photoBox: {
    borderWidth: 2, borderColor: "#DDD", borderStyle: "dashed",
    borderRadius: 16, height: 180, alignItems: "center", justifyContent: "center",
    marginBottom: 24, backgroundColor: "#FAFAFA", overflow: "hidden",
  },
  photoPreview: { width: "100%", height: "100%", resizeMode: "cover" },
  photoEditBadge: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    backgroundColor: "rgba(0,0,0,0.45)", paddingVertical: 8, alignItems: "center",
  },
  photoEditText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  photoEmoji: { fontSize: 36, marginBottom: 8 },
  photoLabel: { fontSize: 16, fontWeight: "700", color: "#333", marginBottom: 4 },
  photoSub: { fontSize: 13, color: "#999" },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#111", marginBottom: 16 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 8, marginTop: 12 },
  labelSub: { fontSize: 13, color: "#888", marginBottom: 10 },
  input: {
    borderWidth: 1, borderColor: "#CCC", borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 13, fontSize: 15, color: "#111",
  },
  inputError: { borderColor: "#D0021B" },
  textarea: { minHeight: 100 },
  charCount: { fontSize: 12, color: "#AAA", textAlign: "right", marginTop: 4 },
  errorText: { color: "#D0021B", fontSize: 13, marginTop: 4 },
  chipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  optionChip: {
    paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20,
    borderWidth: 1.5, borderColor: "#DDD", backgroundColor: "#fff",
  },
  optionChipActive: { borderColor: "#2F80ED", backgroundColor: "#EAF0FF" },
  optionText: { fontSize: 13, color: "#555", fontWeight: "500" },
  optionTextActive: { color: "#2F80ED", fontWeight: "700" },
  toggleRow: { flexDirection: "row", gap: 12 },
  toggle: {
    flex: 1, paddingVertical: 13, borderRadius: 12, alignItems: "center",
    borderWidth: 1.5, borderColor: "#DDD",
  },
  toggleActive: { borderColor: "#1E9E52", backgroundColor: "#E8F7EE" },
  toggleText: { fontSize: 15, fontWeight: "600", color: "#555" },
  toggleTextActive: { color: "#1E9E52" },
  submitBtn: {
    backgroundColor: "#2F80ED", paddingVertical: 17,
    borderRadius: 14, alignItems: "center",
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});
