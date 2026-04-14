import { router } from "expo-router";
import { useFormik } from "formik";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert, KeyboardAvoidingView, Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text, TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";
import { useSession } from "../src/context/SessionContext";
import { cadastrar } from "../src/services/authService";

const CadastroSchema = Yup.object().shape({
  nome: Yup.string().min(3, "Nome muito curto").required("Nome é obrigatório"),
  email: Yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  cpf: Yup.string()
    .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido")
    .required("CPF é obrigatório"),
  senha: Yup.string()
    .min(8, "Mínimo 8 caracteres")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Precisa ter um caractere especial")
    .required("Senha é obrigatória"),
  cidade: Yup.string().required("Cidade é obrigatória"),
  cep: Yup.string()
    .matches(/^\d{5}-\d{3}$/, "CEP inválido")
    .required("CEP é obrigatório"),
});

function formatarCpf(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  return d.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
function formatarCep(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  return d.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
}

type FieldProps = {
  label: string;
  field: string;
  value: string;
  error?: string | false;
  touched?: boolean;
  onChangeText: (v: string) => void;
  onBlur: () => void;
  placeholder?: string;
  keyboard?: any;
  secure?: boolean;
  senhaVisivel?: boolean;
  onToggleSenha?: () => void;
  formatted?: (v: string) => string;
  editable?: boolean;
};

function Field({
  label, value, error, touched, onChangeText, onBlur,
  placeholder, keyboard, secure, senhaVisivel, onToggleSenha,
  formatted, editable = true,
}: FieldProps) {
  const hasError = touched && error;
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, hasError ? styles.inputRowError : null]}>
        <TextInput
          style={styles.inputFlex}
          placeholder={placeholder}
          placeholderTextColor="#AAA"
          value={value}
          onChangeText={(v) => onChangeText(formatted ? formatted(v) : v)}
          onBlur={onBlur}
          keyboardType={keyboard ?? "default"}
          secureTextEntry={secure && !senhaVisivel}
          returnKeyType="next"
          editable={editable}
        />
        {secure && (
          <Pressable onPress={onToggleSenha}>
            <Text style={styles.eyeIcon}>{senhaVisivel ? "🙈" : "👁️"}</Text>
          </Pressable>
        )}
      </View>
      {hasError && <Text style={styles.errorText}>{error as string}</Text>}
    </>
  );
}

export default function CadastroScreen() {
  const { setUsuario } = useSession();
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { nome: "", email: "", cpf: "", senha: "", cidade: "", cep: "" },
    validationSchema: CadastroSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async ({ nome, email, senha, cidade, cep, cpf }) => {
      setLoading(true);
      try {
        const usuario = await cadastrar({ nome, email, senha, cidade, cep, cpf });
        setUsuario(usuario);
        Alert.alert("Conta criada! 🎉", `Bem-vindo(a), ${nome}!`, [
          { text: "Continuar", onPress: () => router.replace("/(tabs)") },
        ]);
      } catch (e: any) {
        const msg =
          e.code === "auth/email-already-in-use"
            ? "Este e-mail já está em uso."
            : e.code === "auth/weak-password"
            ? "Senha muito fraca."
            : "Erro ao criar conta. Verifique sua conexão.";
        Alert.alert("Erro no cadastro", msg);
      } finally {
        setLoading(false);
      }
    },
  });

  const preenchidos = Object.values(formik.values).filter(Boolean).length;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(preenchidos / 6) * 100}%` }]} />
          </View>

          <Text style={styles.title}>Criar conta</Text>
          <Text style={styles.sub}>Junte-se a quem transforma vidas 🐾</Text>

          <Field label="Nome Completo" field="nome"
            value={formik.values.nome} error={formik.errors.nome} touched={formik.touched.nome}
            onChangeText={(v) => formik.setFieldValue("nome", v)}
            onBlur={() => formik.setFieldTouched("nome")} editable={!loading} />

          <Field label="E-mail" field="email" placeholder="exemplo@email.com" keyboard="email-address"
            value={formik.values.email} error={formik.errors.email} touched={formik.touched.email}
            onChangeText={(v) => formik.setFieldValue("email", v)}
            onBlur={() => formik.setFieldTouched("email")} editable={!loading} />

          <Field label="CPF" field="cpf" placeholder="000.000.000-00" keyboard="numeric" formatted={formatarCpf}
            value={formik.values.cpf} error={formik.errors.cpf} touched={formik.touched.cpf}
            onChangeText={(v) => formik.setFieldValue("cpf", v)}
            onBlur={() => formik.setFieldTouched("cpf")} editable={!loading} />

          <Field label="Senha" field="senha" placeholder="Crie uma senha segura" secure
            senhaVisivel={senhaVisivel} onToggleSenha={() => setSenhaVisivel(!senhaVisivel)}
            value={formik.values.senha} error={formik.errors.senha} touched={formik.touched.senha}
            onChangeText={(v) => formik.setFieldValue("senha", v)}
            onBlur={() => formik.setFieldTouched("senha")} editable={!loading} />

          <Field label="Cidade" field="cidade"
            value={formik.values.cidade} error={formik.errors.cidade} touched={formik.touched.cidade}
            onChangeText={(v) => formik.setFieldValue("cidade", v)}
            onBlur={() => formik.setFieldTouched("cidade")} editable={!loading} />

          <Field label="CEP" field="cep" placeholder="00000-000" keyboard="numeric" formatted={formatarCep}
            value={formik.values.cep} error={formik.errors.cep} touched={formik.touched.cep}
            onChangeText={(v) => formik.setFieldValue("cep", v)}
            onBlur={() => formik.setFieldTouched("cep")} editable={!loading} />

          <Pressable
            style={[styles.button, (loading || !formik.isValid) && styles.buttonDisabled]}
            onPress={() => formik.handleSubmit()}
            disabled={loading || !formik.isValid}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Criar conta</Text>}
          </Pressable>

          <Pressable style={styles.backButton} onPress={() => router.replace("/login")}>
            <Text style={styles.backButtonText}>Já tenho conta</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  content: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
  progressTrack: { height: 6, backgroundColor: "#DDD", borderRadius: 99, marginBottom: 28, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: "#2F80ED", borderRadius: 99 },
  title: { fontSize: 28, fontWeight: "800", color: "#2F80ED", marginBottom: 4 },
  sub: { fontSize: 14, color: "#888", marginBottom: 28 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 6, marginTop: 14 },
  inputRow: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#CCC", borderRadius: 10,
    paddingHorizontal: 14, marginBottom: 4,
  },
  inputRowError: { borderColor: "#D0021B" },
  inputFlex: { flex: 1, paddingVertical: 14, fontSize: 15, color: "#111" },
  eyeIcon: { fontSize: 18, paddingLeft: 8 },
  errorText: { color: "#D0021B", fontSize: 12, marginBottom: 6, marginTop: 2 },
  button: {
    backgroundColor: "#2F80ED", paddingVertical: 16,
    borderRadius: 12, alignItems: "center", marginTop: 28, marginBottom: 12,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  backButton: { backgroundColor: "#EAF6F6", paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  backButtonText: { color: "#2F80ED", fontSize: 15, fontWeight: "600" },
});
