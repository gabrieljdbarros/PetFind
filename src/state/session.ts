import { User } from "../data/users";

export let usuarioLogado: User | null = null;

export function setUsuarioLogado(user: User | null) {
  usuarioLogado = user;
}