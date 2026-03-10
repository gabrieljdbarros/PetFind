export type Pet = {
  id: string;
  nome: string;
  idade: string;
  especie: string;
  raca: string;
  local: string;
  descricao: string;
  sexo: string;
  porte: string;
  vacinado: boolean;
  castrado: boolean;
  personalidade: string[];
  imagem?: string;
};

export const pets: Pet[] = [
  {
    id: "1",
    nome: "Thor",
    idade: "2 anos",
    especie: "Cão",
    raca: "Golden Retriever",
    local: "Maceió - AL",
    descricao: "Muito brincalhão e dócil. Adora correr, passear e interagir com pessoas.",
    sexo: "Macho",
    porte: "Grande",
    vacinado: true,
    castrado: true,
    personalidade: ["Brincalhão", "Dócil", "Sociável"],
    imagem: "https://placedog.net/500?id=1",
  },
  {
    id: "2",
    nome: "Luna",
    idade: "1 ano",
    especie: "Cão",
    raca: "SRD",
    local: "Maceió - AL",
    descricao: "Muito carinhosa, adora crianças e se adapta bem a ambientes familiares.",
    sexo: "Fêmea",
    porte: "Médio",
    vacinado: true,
    castrado: false,
    personalidade: ["Carinhosa", "Calma", "Companheira"],
    imagem: "https://placedog.net/500?id=2",
  },

  {
    id: "3",
    nome: "Luna",
    idade: "1 ano",
    especie: "Gato",
    raca: "SRD",
    local: "Maceió - AL",
    descricao: "Muito carinhosa, adora crianças e se adapta bem a ambientes familiares.",
    sexo: "Fêmea",
    porte: "Médio",
    vacinado: true,
    castrado: true,
    personalidade: ["Carinhosa", "Calma", "Companheira"],
    imagem: "https://placedog.net/500?id=3",
  }
];