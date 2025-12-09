// Sistema de Autenticação Integrado - ClaraMente
// Conecta NextAuth com persistência de dados e gerenciamento de usuários

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { v4 as uuidv4 } from 'uuid';
import { userService, ClaraMenteUser } from './user-service';

// Lista de usuários para desenvolvimento (remover em produção)
const DEVELOPMENT_USERS = [
  {
    id: '1',
    email: 'teste@claramente.ai',
    password: '123456',
    name: 'Usuário Teste',
  },
  {
    id: '2',
    email: 'demo@claramente.ai',
    password: 'demo123',
    name: 'Demo User',
  },
  {
    id: '3',
    email: 'psicologo@claramente.ai',
    password: 'psi123',
    name: 'Dr. Clara Silva',
  }
];

// Configuração do NextAuth
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Em desenvolvimento, usar lista de usuários
        const user = DEVELOPMENT_USERS.find(
          u => u.email === credentials.email && u.password === credentials.password
        );

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

// Serviço integrado de autenticação e dados do usuário
export const authService = {
  // Criar ou atualizar usuário com base na sessão NextAuth
  async createOrUpdateUser(session: any): Promise<ClaraMenteUser | null> {
    if (!session?.user) return null;
    
    try {
      return await userService.createOrUpdateUser(session);
    } catch (error) {
      console.error('Erro ao criar/atualizar usuário:', error);
      return null;
    }
  },
  
  // Buscar usuário por ID
  getUserById: (userId: string) => userService.getUserById(userId),
  
  // Salvar dados do usuário
  saveUser: (user: ClaraMenteUser) => userService.saveUser(user),
  
  // Iniciar sessão terapêutica
  startTherapySession: (userId: string) => userService.startTherapySession(userId),
  
  // Finalizar sessão terapêutica
  endTherapySession: (sessionId: string, moodAfter?: number) => 
    userService.endTherapySession(sessionId, moodAfter),
  
  // Buscar sessões do usuário
  getUserSessions: (userId: string, limit?: number) => 
    userService.getUserSessions(userId, limit),
  
  // Calcular progresso
  calculateProgress: (userId: string, period?: '7d' | '30d' | '90d' | 'all') =>
    userService.calculateUserProgress(userId, period),
  
  // Deletar dados do usuário (GDPR)
  deleteUserData: (userId: string) => userService.deleteUserData(userId),
  
  // Verificar se usuário pode iniciar nova sessão (controle de sessões grátis)
  canStartNewSession: (user: ClaraMenteUser): boolean => {
    // Permitir 5 sessões grátis por usuário
    return user.freeSessionsUsed < 5;
  },
  
  // Usar uma sessão grátis
  useFreeSessio: (user: ClaraMenteUser): ClaraMenteUser => {
    if (user.freeSessionsUsed < 5) {
      user.freeSessionsUsed += 1;
      userService.saveUser(user);
    }
    return user;
  }
};

// Função para compatibilidade com código existente
export function getUser(): ClaraMenteUser {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    // Running on server — return a lightweight placeholder user.
    return { 
      id: 'server', 
      locale: 'pt-BR', 
      freeSessionsUsed: 0,
      email: undefined,
      name: 'Usuário Servidor',
      createdAt: new Date(),
      lastLogin: new Date(),
      totalSessions: 0,
      completedAssessments: 0,
      preferredPersona: 'empática',
      preferredStyle: 'conversacional',
      notificationsEnabled: true,
      currentStreak: 0,
      longestStreak: 0,
      achievementsUnlocked: [],
      dataRetentionDays: 365,
      shareProgressWithTherapist: false
    };
  }

  // Verificar se existe usuário autenticado via NextAuth
  let user = userService.getUserById('anonymous');
  
  if (!user) {
    // Criar usuário anônimo temporário
    const anonymousId = 'anonymous_' + uuidv4();
    user = {
      id: anonymousId,
      locale: 'pt-BR',
      freeSessionsUsed: 0,
      email: undefined,
      name: 'Usuário Anônimo',
      createdAt: new Date(),
      lastLogin: new Date(),
      totalSessions: 0,
      completedAssessments: 0,
      preferredPersona: 'empática',
      preferredStyle: 'conversacional',
      notificationsEnabled: true,
      currentStreak: 0,
      longestStreak: 0,
      achievementsUnlocked: [],
      dataRetentionDays: 365,
      shareProgressWithTherapist: false
    };
    userService.saveUser(user);
  }
  
  return user;
}

export function setUser(user: ClaraMenteUser) {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
  userService.saveUser(user);
}

// Exportar interface para compatibilidade
export type { ClaraMenteUser };
