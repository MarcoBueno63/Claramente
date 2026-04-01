// Exemplo de lógica de autenticação simples (mock)
import { v4 as uuidv4 } from 'uuid';

export type ClaraMenteUser = {
  id: string;
  locale: string;
  freeSessionsUsed: number;
  lastSessionId?: string;
  authToken?: string;
};

// Safe helpers that guard against server-side execution.
export function getUser(): ClaraMenteUser {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    // Running on server — return a lightweight placeholder user.
    return { id: 'server', locale: 'pt-BR', freeSessionsUsed: 0 };
  }

  let user = localStorage.getItem('claramente_user');
  if (!user) {
    user = JSON.stringify({ id: uuidv4(), locale: 'pt-BR', freeSessionsUsed: 0 });
    localStorage.setItem('claramente_user', user);
  }
  return JSON.parse(user) as ClaraMenteUser;
}

export function setUser(user: ClaraMenteUser) {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  localStorage.setItem('claramente_user', JSON.stringify(user));
}
