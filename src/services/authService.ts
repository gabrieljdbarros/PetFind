import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppUser = {
  uid: string;
  nome: string;
  email: string;
  cidade?: string;
  cep?: string;
  cpf?: string;
};

const USERS_KEY = '@petfind:users';
const SESSION_KEY = '@petfind:session';

async function getUsers(): Promise<AppUser[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export async function cadastrar(params: {
  nome: string;
  email: string;
  senha: string;
  cidade?: string;
  cep?: string;
  cpf?: string;
}): Promise<AppUser> {
  const users = await getUsers();
  if (users.find((u) => u.email === params.email)) {
    throw { code: 'auth/email-already-in-use' };
  }
  const user: AppUser = {
    uid: Date.now().toString(),
    nome: params.nome,
    email: params.email,
    cidade: params.cidade ?? '',
    cep: params.cep ?? '',
    cpf: params.cpf ?? '',
  };
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export async function login(email: string, senha: string): Promise<AppUser> {
  const users = await getUsers();
  const user = users.find((u) => u.email === email);
  if (!user) throw { code: 'auth/user-not-found' };
  // está sem verificação de ser por ser um placeholder, será mudado na 3av quando implementar o firebase de verdade
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return user;
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}


export function onAuthChange(callback: (user: AppUser | null) => void): () => void {
  AsyncStorage.getItem(SESSION_KEY).then((raw) => {
    callback(raw ? JSON.parse(raw) : null);
  });
  return () => {};
}
