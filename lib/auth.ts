// Exemplo de lógica de autenticação simples (mock)
import { v4 as uuidv4 } from "uuid";

export function getUser() {
  // Em produção, usar autenticação real (JWT, OAuth, etc.)
  let user = localStorage.getItem("claramente_user");
  if (!user) {
    user = JSON.stringify({ id: uuidv4(), locale: "pt-BR", freeSessionsUsed: 0 });
    localStorage.setItem("claramente_user", user);
  }
  return JSON.parse(user);
}

export type ClaraMenteUser = {
  id: string;
  locale: string;
  freeSessionsUsed: number;
  lastSessionId?: string;
};

export function setUser(user: ClaraMenteUser) {
  localStorage.setItem("claramente_user", JSON.stringify(user));
}
