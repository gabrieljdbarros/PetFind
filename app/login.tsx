import {
  View, Text, TextInput, Pressable, StyleSheet,
  Alert, Image, Dimensions, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { login as firebaseLogin } from "../src/services/authService";
import { useSession } from "../src/context/SessionContext";

const { width } = Dimensions.get("window");
const CURVE_HEIGHT = 280;

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("E-mail inválido").required("E-mail é obrigatório"),
  senha: Yup.string().min(6, "Mínimo 6 caracteres").required("Senha é obrigatória"),
});

export default function LoginScreen() {
  const { setUsuario } = useSession();
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", senha: "" },
    validationSchema: LoginSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async ({ email, senha }) => {
      setLoading(true);
      try {
        const usuario = await firebaseLogin(email, senha);
        setUsuario(usuario);
        router.replace("/(tabs)");
      } catch (e: any) {
        const msg =
          e.code === "auth/invalid-credential" || e.code === "auth/wrong-password"
            ? "E-mail ou senha incorretos."
            : e.code === "auth/user-not-found"
            ? "Usuário não encontrado."
            : e.code === "auth/too-many-requests"
            ? "Muitas tentativas. Tente novamente mais tarde."
            : "Erro ao fazer login. Verifique sua conexão.";
        Alert.alert("Erro de login", msg);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <SafeAreaView style={styles.safe} edges={["bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800" }}
              style={styles.headerImage}
            />
            <View style={styles.curveOverlay} />
          </View>

          <View style={styles.form}>
            <Text style={styles.welcomeTitle}>Bem-vindo de volta 🐾</Text>
            <Text style={styles.welcomeSub}>Faça login para continuar</Text>

            <Text style={styles.label}>E-mail</Text>
            <View style={[styles.inputRow, formik.touched.email && formik.errors.email && styles.inputRowError]}>
              <TextInput
                style={styles.input}
                placeholder="exemplo@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formik.values.email}
                onChangeText={formik.handleChange("email")}
                onBlur={formik.handleBlur("email")}
                returnKeyType="next"
                editable={!loading}
              />
              <Text style={styles.inputIcon}>@</Text>
            </View>
            {formik.touched.email && formik.errors.email && (
              <Text style={styles.errorText}>{formik.errors.email}</Text>
            )}

            <Text style={styles.label}>Senha</Text>
            <View style={[styles.inputRow, formik.touched.senha && formik.errors.senha && styles.inputRowError]}>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                secureTextEntry={!senhaVisivel}
                value={formik.values.senha}
                onChangeText={formik.handleChange("senha")}
                onBlur={formik.handleBlur("senha")}
                returnKeyType="done"
                onSubmitEditing={() => formik.handleSubmit()}
                editable={!loading}
              />
              <Pressable onPress={() => setSenhaVisivel(!senhaVisivel)}>
                <Text style={styles.inputIcon}>{senhaVisivel ? "🙈" : "👁️"}</Text>
              </Pressable>
            </View>
            {formik.touched.senha && formik.errors.senha && (
              <Text style={styles.errorText}>{formik.errors.senha}</Text>
            )}

            <Pressable style={styles.button} onPress={() => formik.handleSubmit()} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </Pressable>

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Ainda não tem conta? </Text>
              <Pressable onPress={() => router.push("/signup")}>
                <Text style={styles.signupLink}>Cadastre-se</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { flexGrow: 1 },
  imageContainer: { width: "100%", height: CURVE_HEIGHT, overflow: "hidden" },
  headerImage: { width: "100%", height: "100%", resizeMode: "cover" },
  curveOverlay: {
    position: "absolute", bottom: -60, left: -width * 0.1,
    width: width * 1.2, height: 120, backgroundColor: "#2F80ED",
    borderRadius: width * 0.6,
  },
  form: { flex: 1, paddingHorizontal: 24, paddingTop: 28, paddingBottom: 24 },
  welcomeTitle: { fontSize: 22, fontWeight: "800", color: "#111", marginBottom: 4 },
  welcomeSub: { fontSize: 14, color: "#888", marginBottom: 28 },
  label: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 6 },
  inputRow: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1, borderColor: "#CCC", borderRadius: 10,
    paddingHorizontal: 14, marginBottom: 4,
  },
  inputRowError: { borderColor: "#D0021B" },
  input: { flex: 1, paddingVertical: 14, fontSize: 15, color: "#111" },
  inputIcon: { fontSize: 16, color: "#2F80ED", paddingLeft: 8 },
  errorText: { color: "#D0021B", fontSize: 12, marginBottom: 12, marginTop: 2 },
  button: {
    backgroundColor: "#2F80ED", paddingVertical: 16,
    borderRadius: 12, alignItems: "center", marginTop: 24, marginBottom: 20,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  signupRow: { flexDirection: "row", justifyContent: "center", alignItems: "center" },
  signupText: { fontSize: 14, color: "#444" },
  signupLink: { fontSize: 14, color: "#2F80ED", fontWeight: "600" },
});
