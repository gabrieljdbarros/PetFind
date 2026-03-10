# 🐾 PetFindM

Aplicativo mobile de adoção de pets desenvolvido com **React Native** e **Expo Router**.

---

## 📱 Telas

| Tela | Descrição |
|------|-----------|
| Login | Autenticação com validação de senha em tempo real |
| Cadastro | Registro com CPF, CEP formatados e barra de progresso |
| Home | Busca, categorias e maneiras de ajudar |
| Adotar | Lista completa de pets com filtros |
| Detalhes do Pet | Informações, personalidade e contato com a instituição |
| Perfil | Dados do usuário logado e logout |

---

## 🛠️ Tecnologias

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [Expo Router](https://expo.github.io/router/)
- [TypeScript](https://www.typescriptlang.org/)
- [Ionicons](https://ionic.io/ionicons)
- [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context)

---

## 📁 Estrutura do Projeto

```
PetFindM/
├── app/
│   ├── _layout.tsx          # Navegação raiz (Stack)
│   ├── index.tsx            # Redireciona para /login
│   ├── login.tsx            # Tela de login
│   ├── signup.tsx           # Tela de cadastro
│   ├── adotar.tsx           # Lista de pets para adoção
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Navegação por abas
│   │   ├── index.tsx        # Home
│   │   └── profile.tsx      # Perfil do usuário
│   └── pet/
│       └── [id].tsx         # Detalhes do pet (rota dinâmica)
└── src/
    ├── components/
    │   └── PetCard.tsx      # Componente reutilizável de card
    ├── data/
    │   ├── pets.ts          # Dados dos pets
    │   └── users.ts         # Dados dos usuários
    └── state/
        └── session.ts       # Sessão do usuário logado
```

---

## 🚀 Como rodar o projeto

**Pré-requisitos:** Node.js e Expo CLI instalados.

```bash
# Clone o repositório
git clone https://github.com/gabrieljdbarros/PetFind.git

# Entre na pasta
cd PetFind

# Instale as dependências
npm install

# Inicie o projeto
npx expo start
```

Escaneie o QR code com o app **Expo Go** no celular, ou pressione `a` para abrir no emulador Android.

---

## ✅ Funcionalidades

- [x] Autenticação com login e cadastro
- [x] Validação de formulários em tempo real
- [x] Busca e filtro de pets
- [x] Navegação Stack + Tabs
- [x] Tela de detalhes com rota dinâmica
- [x] Componente reutilizável (PetCard)
- [x] Layout responsivo com safe area

---

## 📌 Próximos passos

- [ ] Conectar a um banco de dados real
- [ ] Implementar favoritos
- [ ] Adicionar mais filtros (porte, idade)
- [ ] Tela de contato com a instituição

---

Desenvolvido por **Gabriel Barros**
