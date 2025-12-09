// Session Manager - Gestão de persistência de dados
// Implementação temporária sem Prisma até resolver dependências

export interface PersistentSessionData {
  id: string
  userId: string
  startedAt: Date
  status: 'active' | 'ended'
  detectedEmotions: string[]
  appliedTechniques: string[]
  conversationStage: 'greeting' | 'exploration' | 'deepening' | 'intervention' | 'closure'
  userSymptoms: string[]
  urgencyLevel: 'low' | 'medium' | 'high' | 'crisis'
  primaryConcern?: string
}

// Interface de contexto de sessão (temporário)
interface SessionContext {
  userId: string;
  startTime: Date;
  messages: string[];
  detectedEmotions: string[];
  appliedTechniques: string[];
  conversationStage: 'greeting' | 'exploration' | 'deepening' | 'intervention' | 'closure';
  userSymptoms: string[];
  suggestedProtocols: any[];
}

// Armazenamento temporário em memória (substituir por Prisma depois)
const memoryStore = {
  sessions: new Map<string, any>(),
  users: new Map<string, any>(),
  messages: new Map<string, any[]>()
}

export class SessionManager {
  // Criar nova sessão
  static async createSession(userId: string, persona: string = 'empática', style: string = 'profissional'): Promise<PersistentSessionData> {
    try {
      const sessionId = `session_${Date.now()}_${userId.slice(-8)}`
      
      const sessionData: PersistentSessionData = {
        id: sessionId,
        userId,
        startedAt: new Date(),
        status: 'active',
        detectedEmotions: [],
        appliedTechniques: [],
        conversationStage: 'greeting',
        userSymptoms: [],
        urgencyLevel: 'low'
      }

      memoryStore.sessions.set(sessionId, sessionData)
      console.log(`✅ Sessão criada: ${sessionId} para usuário ${userId}`)

      return sessionData
    } catch (error) {
      console.error('Erro ao criar sessão:', error)
      throw new Error('Falha ao criar sessão')
    }
  }

  // Obter sessão ativa do usuário
  static async getActiveSession(userId: string): Promise<PersistentSessionData | null> {
    try {
      // Buscar sessão ativa mais recente do usuário
      for (const [sessionId, sessionData] of memoryStore.sessions) {
        if (sessionData.userId === userId && sessionData.status === 'active') {
          console.log(`📖 Sessão ativa encontrada: ${sessionId}`)
          return sessionData
        }
      }
      
      console.log(`❌ Nenhuma sessão ativa para usuário ${userId}`)
      return null
    } catch (error) {
      console.error('Erro ao buscar sessão ativa:', error)
      return null
    }
  }

  // Atualizar contexto da sessão
  static async updateSessionContext(sessionId: string, updates: Partial<PersistentSessionData>): Promise<void> {
    try {
      const session = memoryStore.sessions.get(sessionId)
      if (!session) {
        throw new Error(`Sessão ${sessionId} não encontrada`)
      }

      const updatedSession = { ...session, ...updates }
      memoryStore.sessions.set(sessionId, updatedSession)
      
      console.log(`📝 Sessão ${sessionId} atualizada:`, {
        emotions: updates.detectedEmotions?.length || 0,
        techniques: updates.appliedTechniques?.length || 0,
        stage: updates.conversationStage,
        symptoms: updates.userSymptoms?.length || 0
      })
    } catch (error) {
      console.error('Erro ao atualizar sessão:', error)
      throw new Error('Falha ao atualizar contexto da sessão')
    }
  }

  // Finalizar sessão
  static async endSession(sessionId: string, summary?: string): Promise<void> {
    try {
      const session = memoryStore.sessions.get(sessionId)
      if (!session) return

      const messages = memoryStore.messages.get(sessionId) || []
      const durationMin = Math.round(
        (new Date().getTime() - session.startedAt.getTime()) / (1000 * 60)
      )

      session.status = 'ended'
      session.endedAt = new Date()
      session.durationMin = durationMin
      session.summary = summary || `Sessão de ${durationMin} minutos com ${messages.length} mensagens trocadas.`

      memoryStore.sessions.set(sessionId, session)
      console.log(`🔚 Sessão finalizada: ${sessionId} (${durationMin}min, ${messages.length} mensagens)`)
    } catch (error) {
      console.error('Erro ao finalizar sessão:', error)
      throw new Error('Falha ao finalizar sessão')
    }
  }

  // Salvar mensagem
  static async saveMessage(
    sessionId: string, 
    role: 'user' | 'assistant' | 'system', 
    content: string,
    metadata?: {
      technique?: string
      intervention?: string
      emotionalTone?: string
      urgencyLevel?: string
    }
  ): Promise<void> {
    try {
      const messages = memoryStore.messages.get(sessionId) || []
      
      const message = {
        id: `msg_${Date.now()}_${messages.length}`,
        sessionId,
        role,
        content,
        createdAt: new Date(),
        ...metadata
      }

      messages.push(message)
      memoryStore.messages.set(sessionId, messages)
      
      console.log(`💬 Mensagem salva: ${role} em ${sessionId} (${content.substring(0, 50)}...)`)
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error)
      throw new Error('Falha ao salvar mensagem')
    }
  }

  // Obter histórico de mensagens da sessão
  static async getSessionMessages(sessionId: string) {
    try {
      const messages = memoryStore.messages.get(sessionId) || []
      console.log(`📚 Recuperando ${messages.length} mensagens para sessão ${sessionId}`)
      return messages
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error)
      return []
    }
  }

  // Obter usuário ou criar se não existir
  static async getOrCreateUser(userId: string): Promise<any> {
    try {
      let user = memoryStore.users.get(userId)

      if (!user) {
        user = {
          id: userId,
          ageConfirmed: true,
          createdAt: new Date(),
          therapeuticProfile: {},
          riskProfile: 'low',
          primaryConcerns: [],
          therapeuticGoals: []
        }
        memoryStore.users.set(userId, user)
        console.log(`👤 Usuário criado: ${userId}`)
      }

      return user
    } catch (error) {
      console.error('Erro ao obter/criar usuário:', error)
      throw new Error('Falha ao gerenciar usuário')
    }
  }

  // Converter SessionContext em PersistentSessionData
  static toPersistentData(sessionContext: SessionContext, sessionId: string): PersistentSessionData {
    return {
      id: sessionId,
      userId: sessionContext.userId,
      startedAt: sessionContext.startTime,
      status: 'active',
      detectedEmotions: sessionContext.detectedEmotions,
      appliedTechniques: sessionContext.appliedTechniques,
      conversationStage: sessionContext.conversationStage,
      userSymptoms: sessionContext.userSymptoms,
      urgencyLevel: 'low' // Pode ser derivado da análise
    }
  }

  // Obter estatísticas do usuário
  static async getUserStats(userId: string) {
    try {
      let totalSessions = 0
      let completedSessions = 0
      let totalMessages = 0
      const recentSessions = []

      // Contar sessões do usuário
      for (const [sessionId, session] of memoryStore.sessions) {
        if (session.userId === userId) {
          totalSessions++
          if (session.status === 'ended') {
            completedSessions++
          }

          // Contar mensagens desta sessão
          const messages = memoryStore.messages.get(sessionId) || []
          totalMessages += messages.length

          // Adicionar às sessões recentes
          if (recentSessions.length < 5) {
            recentSessions.push({
              id: sessionId,
              startedAt: session.startedAt,
              durationMin: session.durationMin || 0,
              messageCount: messages.length,
              primaryConcern: session.primaryConcern
            })
          }
        }
      }

      console.log(`📊 Stats para ${userId}: ${totalSessions} sessões, ${totalMessages} mensagens`)

      return {
        totalSessions,
        completedSessions,
        totalMessages,
        recentSessions: recentSessions.slice(-5) // últimas 5 sessões
      }
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error)
      return {
        totalSessions: 0,
        completedSessions: 0,
        totalMessages: 0,
        recentSessions: []
      }
    }
  }

  // Debug - Ver estado atual do armazenamento
  static getMemoryStoreStats() {
    return {
      totalSessions: memoryStore.sessions.size,
      totalUsers: memoryStore.users.size,
      totalMessageGroups: memoryStore.messages.size,
      sessions: Array.from(memoryStore.sessions.entries()).map(([id, session]) => ({
        id,
        userId: session.userId,
        status: session.status,
        messageCount: memoryStore.messages.get(id)?.length || 0
      }))
    }
  }
}