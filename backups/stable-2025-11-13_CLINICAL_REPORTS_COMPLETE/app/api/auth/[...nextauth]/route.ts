import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Configuração do NextAuth exportável - simplificada para desenvolvimento
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials", 
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Autenticação temporária simples para desenvolvimento
          if (credentials?.email && credentials?.password) {
            // Validação básica
            if (credentials.email.includes('@') && credentials.password.length >= 6) {
              // TEMPORÁRIO: aceitar qualquer email/senha para desenvolvimento
              const user = {
                id: `user_${credentials.email.replace('@', '_').replace('.', '_')}`,
                email: credentials.email,
                name: credentials.email.split('@')[0],
              }
              console.log('Usuário autorizado:', user)
              return user
            }
          }
          console.log('Credenciais inválidas')
          return null
        } catch (error) {
          console.error('Erro na autorização:', error)
          return null
        }
      }
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 horas
  },
  callbacks: {
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id
        }
        return token
      } catch (error) {
        console.error('Erro no JWT callback:', error)
        return token
      }
    },
    async session({ session, token }) {
      try {
        if (token && session.user) {
          (session.user as any).id = token.id as string
        }
        return session
      } catch (error) {
        console.error('Erro no session callback:', error)
        return session
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET || 'claramente-desenvolvimento-secret-key',
  debug: process.env.NODE_ENV === 'development',
}

// Configuração temporária sem Prisma até resolver dependências
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }