import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";
import { users } from "../src/data/users";
import { setUsuarioLogado } from "../src/state/session";

const { width } = Dimensions.get("window");
const CURVE_HEIGHT = 280;

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [senhaErros, setSenhaErros] = useState<string[]>([]);

  function validarSenha(valor: string) {
    setSenha(valor);
    const erros: string[] = [];
    if (valor.length > 0 && valor.length < 8) {
      erros.push("Senha precisa ter no mínimo 8 dígitos.");
    }
    if (valor.length > 0 && !/[!@#$%^&*(),.?":{}|<>]/.test(valor)) {
      erros.push("Senha precisa ter no mínimo um (1) caracter especial");
    }
    setSenhaErros(erros);
  }

  function handleLogin() {
    const usuario = users.find(
      (u) => u.email === email && u.senha === senha
    );
    if (!usuario) {
      Alert.alert("Erro", "Usuário ou senha inválidos");
      return;
    }
    setUsuarioLogado(usuario);
    router.replace("/(tabs)");
  }

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

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>E-mail:</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="exemplo@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                returnKeyType="next"
              />
              <Text style={styles.inputIcon}>@</Text>
            </View>

            <Text style={styles.label}>Senha:</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="••••••••••••••••"
                secureTextEntry={!senhaVisivel}
                value={senha}
                onChangeText={validarSenha}
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <Pressable onPress={() => setSenhaVisivel(!senhaVisivel)}>
                <Text style={styles.inputIcon}>{senhaVisivel ? "🙈" : "👁️"}</Text>
              </Pressable>
            </View>

            {senhaErros.map((erro, i) => (
              <Text key={i} style={styles.errorText}>{erro}</Text>
            ))}

            <Pressable onPress={() => Alert.alert("Em breve", "Funcionalidade ainda não disponível.")}>
              <Text style={styles.forgotPassword}>Esqueceu sua senha?</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Entrar</Text>
            </Pressable>

            <View style={styles.signupRow}>
              <Text style={styles.signupText}>Ainda não tem uma conta? </Text>
              <Pressable onPress={() => router.push("/signup")}>
                <Text style={styles.signupLink}>Inscreva-se agora!</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
  },
  imageContainer: {
    width: "100%",
    height: CURVE_HEIGHT,
    overflow: "hidden",
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  curveOverlay: {
    position: "absolute",
    bottom: -60,
    left: -width * 0.1,
    width: width * 1.2,
    height: 120,
    backgroundColor: "#2F80ED",
    borderRadius: width * 0.6,
  },
  form: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111",
  },
  inputIcon: {
    fontSize: 16,
    color: "#2F80ED",
    paddingLeft: 8,
  },
  errorText: {
    color: "#D0021B",
    fontSize: 13,
    marginTop: -10,
    marginBottom: 8,
  },
  forgotPassword: {
    color: "#2F80ED",
    fontSize: 14,
    textAlign: "right",
    marginBottom: 32,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#2F80ED",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signupText: {
    fontSize: 14,
    color: "#444",
  },
  signupLink: {
    fontSize: 14,
    color: "#2F80ED",
    fontWeight: "600",
  },
});
