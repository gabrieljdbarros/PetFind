import { Pet, pets as mockPets } from '../data/pets';

// Armazenamento em memória — reinicia ao fechar o app NÃO ESTÁ ASYNC, mas será integrado na 3av
let store: Pet[] = [...mockPets];

export async function listarPets(): Promise<Pet[]> {
  return [...store];
}

export async function buscarPet(id: string): Promise<Pet | null> {
  return store.find((p) => p.id === id) ?? null;
}

export async function cadastrarPet(
  pet: Omit<Pet, 'id'>,
  donoUid: string
): Promise<string> {
  const id = Date.now().toString();
  store = [{ id, ...pet }, ...store];
  return id;
}

export async function enviarSolicitacao(dados: {
  petId: string;
  petNome: string;
  solicitanteUid: string;
  solicitanteNome: string;
  solicitanteEmail: string;
  telefone: string;
  moradia: string;
  temOutrosAnimais: string;
  temCriancas: string;
  motivacao: string;
}): Promise<void> {
  // Mock: só loga no console por enquanto
  console.log('[Mock] Solicitação de adoção recebida:', dados);
}

export async function seedPets(_pets?: Omit<Pet, 'id'>[]): Promise<void> {
}
