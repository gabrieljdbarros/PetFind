import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { router } from "expo-router";
import { users } from "../src/data/users";

export default function CadastroScreen() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [cidade, setCidade] = useState("");
  const [cep, setCep] = useState("");
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

  function formatarCpf(valor: string) {
    const digits = valor.replace(/\D/g, "").slice(0, 11);
    const formatted = digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setCpf(formatted);
  }

  function formatarCep(valor: string) {
    const digits = valor.replace(/\D/g, "").slice(0, 8);
    const formatted = digits.replace(/(\d{5})(\d{1,3})$/, "$1-$2");
    setCep(formatted);
  }

  function handleCadastro() {
    if (!nome || !email || !cpf || !senha || !cidade || !cep) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      Alert.alert("Erro", "Digite um e-mail válido");
      return;
    }
    if (senhaErros.length > 0) {
      Alert.alert("Erro", "Corrija os erros antes de continuar");
      return;
    }
    users.push({ nome, email, senha });
    Alert.alert("Sucesso", `Usuário ${nome} cadastrado!`);
    router.replace("/login");
  }

  const progresso = [nome, email, cpf, senha, cidade, cep].filter(Boolean).length;
  const totalCampos = 6;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${(progresso / totalCampos) * 100}%` },
              ]}
            />
          </View>

          <Text style={styles.title}>Cadastro</Text>

          <Text style={styles.label}>Nome Completo:</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            returnKeyType="next"
          />

          <Text style={styles.label}>E-mail:</Text>
          <TextInput
            style={styles.input}
            placeholder="exemplo@email.com"
            placeholderTextColor="#AAA"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
          />

          <Text style={styles.label}>CPF:</Text>
          <TextInput
            style={styles.input}
            placeholder="Somente os dígitos"
            placeholderTextColor="#AAA"
            value={cpf}
            onChangeText={formatarCpf}
            keyboardType="numeric"
            returnKeyType="next"
          />

          <Text style={styles.label}>Senha:</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.inputFlex}
              placeholder="Crie uma senha para sua conta"
              placeholderTextColor="#AAA"
              secureTextEntry={!senhaVisivel}
              value={senha}
              onChangeText={validarSenha}
              returnKeyType="next"
            />
            <Pressable onPress={() => setSenhaVisivel(!senhaVisivel)}>
              <Text style={styles.eyeIcon}>{senhaVisivel ? "🙈" : "👁️"}</Text>
            </Pressable>
          </View>

          {senhaErros.map((erro, i) => (
            <Text key={i} style={styles.errorText}>{erro}</Text>
          ))}

          <Text style={styles.label}>Cidade:</Text>
          <TextInput
            style={styles.input}
            value={cidade}
            onChangeText={setCidade}
            returnKeyType="next"
          />

          <Text style={styles.label}>CEP:</Text>
          <TextInput
            style={styles.input}
            placeholder="Somente os dígitos"
            placeholderTextColor="#AAA"
            value={cep}
            onChangeText={formatarCep}
            keyboardType="numeric"
            returnKeyType="done"
            onSubmitEditing={handleCadastro}
          />

          <View style={styles.spacer} />

          <Pressable style={styles.button} onPress={handleCadastro}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </Pressable>

          <Pressable
            style={styles.backButton}
            onPress={() => router.replace("/login")}
          >
            <Text style={styles.backButtonText}>Voltar ao Login</Text>
          </Pressable>
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
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  progressTrack: {
    height: 6,
    backgroundColor: "#DDD",
    borderRadius: 99,
    marginBottom: 32,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2F80ED",
    borderRadius: 99,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#2F80ED",
    marginBottom: 28,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111",
    marginBottom: 18,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  inputFlex: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111",
  },
  eyeIcon: {
    fontSize: 18,
    paddingLeft: 8,
  },
  errorText: {
    color: "#D0021B",
    fontSize: 13,
    marginBottom: 6,
  },
  spacer: {
    height: 24,
  },
  button: {
    backgroundColor: "#2F80ED",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  backButton: {
    backgroundColor: "#EAF6F6",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  backButtonText: {
    color: "#2F80ED",
    fontSize: 15,
    fontWeight: "600",
  },
});
