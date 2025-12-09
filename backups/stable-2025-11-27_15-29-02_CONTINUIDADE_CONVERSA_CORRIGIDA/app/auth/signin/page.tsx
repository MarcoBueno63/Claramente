"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Validação básica
      if (!email.includes('@')) {
        setError('Por favor, insira um email válido')
        setLoading(false)
        return
      }
      
      if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres')
        setLoading(false)
        return
      }

      // Simular login (para desenvolvimento)
      console.log('Tentativa de login:', { email, password })
      
      // Simular delay de autenticação
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Para desenvolvimento, aceitar qualquer email/senha válidos
      console.log('Login bem-sucedido, redirecionando...')
      
      // Armazenar dados básicos do usuário
      const userData = {
        id: `user_${email.replace('@', '_').replace('.', '_')}`,
        email: email,
        name: email.split('@')[0],
        loginTime: new Date().toISOString()
      }
      
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('isAuthenticated', 'true')
      
      console.log('Dados do usuário salvos:', userData)
      console.log('Iniciando redirecionamento...')
      
      // Usar window.location como fallback
      try {
        await router.push('/chat')
        console.log('Router.push executado')
      } catch (routerError) {
        console.error('Erro com router.push, usando window.location:', routerError)
        window.location.href = '/chat'
      }
    } catch (err) {
      console.error('Exceção no login:', err)
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ClaraMente</h1>
          <p className="text-gray-600 mt-2">Faça login para acessar suas sessões</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Não tem conta?{' '}
            <button
              onClick={() => router.push('/auth/signup')}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              Criar conta
            </button>
          </p>
        </div>

        {/* Login de desenvolvimento */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center mb-4">
            🔧 Modo Desenvolvimento - Use qualquer email/senha válidos
          </p>
          <button
            onClick={() => {
              setEmail('admin@claramente.dev')
              setPassword('123456')
            }}
            className="w-full text-xs bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Preencher Login de Teste
          </button>
        </div>

        {/* Status do Sistema */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            <span>Sistema Operacional</span>
          </div>
        </div>
      </div>
    </div>
  )
}