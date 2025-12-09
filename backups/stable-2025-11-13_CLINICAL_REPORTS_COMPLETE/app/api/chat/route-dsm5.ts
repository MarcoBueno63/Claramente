import { NextRequest, NextResponse } from "next/server";

// Protocolos DSM-5 expandidos
interface TherapeuticSession {
  userId: string;
  startTime: number;
  interactions: Array<{user: string, assistant: string, timestamp: number}>;
  primaryConcern: string;
  secondaryConcerns: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'crisis';
  phase: 'initial' | 'assessment' | 'intervention' | 'integration' | 'closure';
  sessionDuration: number; // em segundos
  count: number;
}

const sessions = new Map<string, TherapeuticSession>();

// Detecção expandida baseada no DSM-5
function detectDSMConditions(text: string): {primary: string, secondary: string[], risk: 'low' | 'medium' | 'high' | 'crisis'} {
  const lower = text.toLowerCase().trim();
  let primary = 'geral';
  let secondary: string[] = [];
  let risk: 'low' | 'medium' | 'high' | 'crisis' = 'low';
  
  // Avaliação de risco primeiro
  if (lower.includes('suicid') || lower.includes('morr') || lower.includes('acabar') || lower.includes('não aguento')) {
    risk = 'crisis';
    primary = 'ideacao_suicida';
    return {primary, secondary, risk};
  }
  
  if (lower.includes('machucar') || lower.includes('cortar') || lower.includes('automutila')) {
    risk = 'high';
    secondary.push('autolesao');
  }
  
  // Transtornos de Ansiedade (F40-F48)
  if (lower.includes('ansio') || lower.includes('nervos') || lower.includes('preocup') || lower.includes('medo') || lower.includes('panico')) {
    primary = primary === 'geral' ? 'ansiedade' : primary;
    if (!secondary.includes('ansiedade')) secondary.push('ansiedade');
    risk = risk === 'low' ? 'medium' : risk;
  }
  
  // Transtornos Depressivos (F32-F39)
  if (lower.includes('trist') || lower.includes('deprim') || lower.includes('vazio') || lower.includes('sem energia') || lower.includes('desmotiv')) {
    primary = primary === 'geral' ? 'depressao' : primary;
    if (!secondary.includes('depressao')) secondary.push('depressao');
    risk = risk === 'low' ? 'medium' : risk;
  }
  
  // Transtorno Bipolar (F31)
  if (lower.includes('humor') || lower.includes('mania') || lower.includes('eufori') || lower.includes('muito energi') || lower.includes('bipolar')) {
    primary = primary === 'geral' ? 'bipolar' : primary;
    if (!secondary.includes('bipolar')) secondary.push('bipolar');
    risk = 'high';
  }
  
  // TEPT e Trauma (F43)
  if (lower.includes('trauma') || lower.includes('flashback') || lower.includes('pesadelo') || lower.includes('abuso') || lower.includes('tept')) {
    primary = primary === 'geral' ? 'trauma' : primary;
    if (!secondary.includes('trauma')) secondary.push('trauma');
    risk = risk === 'low' ? 'high' : risk;
  }
  
  // Transtorno Obsessivo-Compulsivo (F42)
  if (lower.includes('obsess') || lower.includes('compuls') || lower.includes('ritual') || lower.includes('toc') || lower.includes('contamin')) {
    primary = primary === 'geral' ? 'toc' : primary;
    if (!secondary.includes('toc')) secondary.push('toc');
  }
  
  // Transtornos Alimentares (F50)
  if (lower.includes('comida') || lower.includes('peso') || lower.includes('gordo') || lower.includes('anorex') || lower.includes('bulim')) {
    primary = primary === 'geral' ? 'alimentar' : primary;
    if (!secondary.includes('alimentar')) secondary.push('alimentar');
    risk = 'medium';
  }
  
  // TDAH (F90)
  if (lower.includes('concentra') || lower.includes('atenção') || lower.includes('hiperativ') || lower.includes('tdah') || lower.includes('disperso')) {
    primary = primary === 'geral' ? 'tdah' : primary;
    if (!secondary.includes('tdah')) secondary.push('tdah');
  }
  
  // Transtornos de Personalidade (F60-F69)
  if (lower.includes('relacionamento') || lower.includes('abandono') || lower.includes('borderline') || lower.includes('personalidade')) {
    primary = primary === 'geral' ? 'personalidade' : primary;
    if (!secondary.includes('personalidade')) secondary.push('personalidade');
    risk = 'medium';
  }
  
  // Transtornos por Uso de Substâncias (F10-F19)
  if (lower.includes('droga') || lower.includes('álcool') || lower.includes('vício') || lower.includes('dependência')) {
    primary = primary === 'geral' ? 'substancia' : primary;
    if (!secondary.includes('substancia')) secondary.push('substancia');
    risk = 'high';
  }
  
  return {primary, secondary, risk};
}

function getSessionPhase(duration: number): 'initial' | 'assessment' | 'intervention' | 'integration' | 'closure' {
  if (duration < 300) return 'initial';        // 0-5min
  if (duration < 600) return 'assessment';     // 5-10min
  if (duration < 1200) return 'intervention';  // 10-20min
  if (duration < 1500) return 'integration';   // 20-25min
  return 'closure';                            // 25-30min
}

function getTherapeuticResponse(session: TherapeuticSession, userMessage: string): {message: string, technique: string, recommendations: string[]} {
  const detection = detectDSMConditions(userMessage);
  const currentTime = Date.now();
  const sessionDuration = Math.floor((currentTime - session.startTime) / 1000);
  const phase = getSessionPhase(sessionDuration);
  
  // Update session
  session.primaryConcern = detection.primary;
  session.secondaryConcerns = [...new Set([...session.secondaryConcerns, ...detection.secondary])];
  session.riskLevel = Math.max(session.riskLevel === 'low' ? 0 : session.riskLevel === 'medium' ? 1 : session.riskLevel === 'high' ? 2 : 3, 
                              detection.risk === 'low' ? 0 : detection.risk === 'medium' ? 1 : detection.risk === 'high' ? 2 : 3) === 0 ? 'low' : 
                              Math.max(session.riskLevel === 'low' ? 0 : session.riskLevel === 'medium' ? 1 : session.riskLevel === 'high' ? 2 : 3, 
                              detection.risk === 'low' ? 0 : detection.risk === 'medium' ? 1 : detection.risk === 'high' ? 2 : 3) === 1 ? 'medium' :
                              Math.max(session.riskLevel === 'low' ? 0 : session.riskLevel === 'medium' ? 1 : session.riskLevel === 'high' ? 2 : 3, 
                              detection.risk === 'low' ? 0 : detection.risk === 'medium' ? 1 : detection.risk === 'high' ? 2 : 3) === 2 ? 'high' : 'crisis';
  session.phase = phase;
  session.sessionDuration = sessionDuration;
  
  // Resposta de emergência
  if (session.riskLevel === 'crisis') {
    return {
      message: `🚨 **ATENÇÃO URGENTE** 🚨

Percebo que você está passando por um momento muito difícil e pode estar pensando em se machucar. **Você não está sozinho e sua vida tem valor.**

**RECURSOS IMEDIATOS:**
📞 **CVV:** 188 (24h, gratuito)
📞 **CAPS:** 190 (urgências psiquiátricas)
📞 **SAMU:** 192
📱 **Chat CVV:** www.cvv.org.br

**Vamos respirar juntos agora:**
1. Inspire devagar por 4 segundos
2. Segure o ar por 4 segundos  
3. Expire por 6 segundos
4. Repita 5 vezes

**Por favor, procure ajuda profissional imediatamente. Sua segurança é a prioridade.**`,
      technique: 'Intervenção em Crise e Prevenção ao Suicídio',
      recommendations: ['Buscar ajuda profissional imediata', 'Contactar CVV', 'Não ficar sozinho', 'Remover meios lesivos']
    };
  }
  
  return generatePhaseBasedResponse(session, userMessage, phase);
}

function generatePhaseBasedResponse(session: TherapeuticSession, userMessage: string, phase: string): {message: string, technique: string, recommendations: string[]} {
  const concern = session.primaryConcern;
  const count = session.count;
  const remainingTime = Math.max(0, 1800 - session.sessionDuration); // 30min = 1800s
  
  switch (phase) {
    case 'initial':
      return {
        message: `**Bem-vindo à sua sessão terapêutica!** 🌟

Olá! Sou Clara, sua assistente terapêutica. Temos **30 minutos** juntos hoje para trabalhar no que está te preocupando.

${getInitialAssessment(concern, userMessage)}

**Para começarmos bem:** me conte o que mais tem ocupado seus pensamentos ultimamente?`,
        technique: 'Estabelecimento de Rapport e Avaliação Inicial',
        recommendations: ['Criar ambiente seguro', 'Estabelecer objetivos', 'Avaliar motivação']
      };
      
    case 'assessment':
      return {
        message: `**Vamos entender melhor sua situação** 🔍

${getAssessmentResponse(concern, userMessage)}

**Pergunta importante:** quando isso que você está sentindo começou a interferir mais no seu dia a dia? 

⏰ *Temos cerca de ${Math.floor(remainingTime/60)} minutos para trabalhar juntos.*`,
        technique: getAssessmentTechnique(concern),
        recommendations: getAssessmentRecommendations(concern)
      };
      
    case 'intervention':
      return {
        message: `**Vamos trabalhar técnicas práticas** 🛠️

${getInterventionResponse(concern, userMessage)}

${getPracticalExercise(concern)}

**Como você se sente ao praticar isso?**

⏰ *Ainda temos ${Math.floor(remainingTime/60)} minutos para aprofundar.*`,
        technique: getInterventionTechnique(concern),
        recommendations: getInterventionRecommendations(concern)
      };
      
    case 'integration':
      return {
        message: `**Integrando o que aprendemos** 💡

${getIntegrationResponse(concern, session)}

**Pergunta de reflexão:** qual dessas estratégias que praticamos hoje você sente que poderia usar em casa?

⏰ *Temos ${Math.floor(remainingTime/60)} minutos para finalizar e planejar seus próximos passos.*`,
        technique: 'Integração e Consolidação de Aprendizados',
        recommendations: ['Escolher 1-2 técnicas para praticar', 'Definir metas específicas', 'Planejar implementação']
      };
      
    case 'closure':
      return {
        message: `**Finalizando nossa sessão** ✨

${getClosureResponse(concern, session)}

**Seu "homework" para esta semana:** pratique ${getHomeworkAssignment(concern)} por 5-10 minutos diários.

**Recursos para levar:** ${getResourcesForHome(concern)}

⏰ *Últimos ${Math.floor(remainingTime/60)} minutos - alguma dúvida ou algo que gostaria de reforçar?*

**📋 Como você avalia nossa sessão de hoje? (1-10)**`,
        technique: 'Encerramento Terapêutico e Planejamento Futuro',
        recommendations: ['Praticar técnicas aprendidas', 'Agendar follow-up', 'Manter recursos de apoio']
      };
      
    default:
      return generateDefaultResponse(concern, count);
  }
}

// Funções auxiliares para cada tipo de transtorno
function getInitialAssessment(concern: string, message: string): string {
  const assessments = {
    ansiedade: 'Percebo que a ansiedade tem estado presente. Vamos trabalhar juntos para entender e manejar esses sintomas.',
    depressao: 'Vejo que você está enfrentando um período difícil. É corajoso buscar apoio, e estamos aqui para isso.',
    bipolar: 'Flutuações de humor podem ser desafiadoras. Vamos encontrar estratégias para maior estabilidade.',
    trauma: 'Experiências traumáticas deixam marcas. Trabalharemos com cuidado e no seu ritmo.',
    toc: 'Pensamentos intrusivos e compulsões podem ser muito desgastantes. Há técnicas específicas que podem ajudar.',
    tdah: 'Dificuldades de concentração afetam muito o dia a dia. Vamos desenvolver estratégias práticas.',
    alimentar: 'Nossa relação com a comida e corpo merece cuidado especial. Trabalharemos isso com gentileza.',
    personalidade: 'Relacionamentos e senso de identidade são áreas complexas. Vamos explorar isso juntos.',
    substancia: 'Dependências são desafios sérios que requerem apoio especializado. Estou aqui para ajudar.',
    geral: 'Cada pessoa é única. Vamos descobrir juntos o que funciona melhor para você.'
  };
  return assessments[concern] || assessments.geral;
}

function getAssessmentTechnique(concern: string): string {
  const techniques = {
    ansiedade: 'Avaliação de Sintomas de Ansiedade (GAD-7 adaptado)',
    depressao: 'Rastreamento de Humor e Sintomas Depressivos (PHQ-9 adaptado)',
    bipolar: 'Monitoramento de Ciclos de Humor (MDQ adaptado)',
    trauma: 'Avaliação de Impacto Traumático (PC-PTSD adaptado)',
    toc: 'Yale-Brown Obsessive-Compulsive Scale (Y-BOCS adaptado)',
    tdah: 'Avaliação de Sintomas TDAH (ASRS adaptado)',
    alimentar: 'Eating Attitudes Test (EAT adaptado)',
    personalidade: 'Avaliação de Padrões Relacionais',
    substancia: 'CAGE Questionnaire adaptado',
    geral: 'Avaliação Clínica Geral e Funcional'
  };
  return techniques[concern] || techniques.geral;
}

// Continua com mais funções auxiliares...

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body.message?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Mensagem é obrigatória'
      }, { status: 400 });
    }

    const userId = body.userId || 'default_user';
    const userMessage = body.message.trim();
    const currentTime = Date.now();
    
    console.log(`\n=== SESSÃO TERAPÊUTICA DSM-5 ===`);
    console.log(`User: ${userMessage}`);
    console.log(`Time: ${new Date().toLocaleTimeString()}`);
    
    // Pega ou cria sessão
    if (!sessions.has(userId)) {
      sessions.set(userId, {
        userId,
        startTime: currentTime,
        interactions: [],
        primaryConcern: 'geral',
        secondaryConcerns: [],
        riskLevel: 'low',
        phase: 'initial',
        sessionDuration: 0,
        count: 0
      });
    }
    
    const session = sessions.get(userId)!;
    session.count++;
    
    // Verifica se sessão ultrapassou 30 minutos
    const sessionDuration = Math.floor((currentTime - session.startTime) / 1000);
    if (sessionDuration > 1800) { // 30 minutos
      sessions.delete(userId);
      return NextResponse.json({
        success: true,
        message: `**Sessão finalizada automaticamente** ⏰

Nossa sessão de 30 minutos chegou ao fim. Foi um prazer trabalhar com você hoje!

**Resumo da sessão:**
- Foco principal: ${session.primaryConcern}
- Técnicas trabalhadas: ${session.count} interações
- Nível de apoio: ${session.riskLevel === 'low' ? 'Estável' : session.riskLevel === 'medium' ? 'Atenção' : 'Cuidado intensivo'}

**Continue praticando o que aprendemos e cuide-se bem! 💙**

*Para uma nova sessão, inicie uma nova conversa.*`,
        guidance: 'Sessão finalizada - 30 minutos completados',
        sessionComplete: true,
        timestamp: new Date().toISOString()
      });
    }
    
    const response = getTherapeuticResponse(session, userMessage);
    
    session.interactions.push({
      user: userMessage,
      assistant: response.message,
      timestamp: currentTime
    });
    
    sessions.set(userId, session);
    
    console.log(`Condição: ${session.primaryConcern}`);
    console.log(`Fase: ${session.phase}`);
    console.log(`Risco: ${session.riskLevel}`);
    console.log(`Duração: ${Math.floor(sessionDuration/60)}min${Math.floor(sessionDuration%60)}s`);
    console.log(`Técnica: ${response.technique}`);
    
    return NextResponse.json({
      success: true,
      message: response.message,
      guidance: `${response.technique} | ${session.phase} | ${Math.floor((1800-sessionDuration)/60)}:${String(Math.floor((1800-sessionDuration)%60)).padStart(2,'0')} restantes`,
      recommendations: response.recommendations,
      sessionData: {
        phase: session.phase,
        duration: sessionDuration,
        timeRemaining: 1800 - sessionDuration,
        riskLevel: session.riskLevel,
        primaryConcern: session.primaryConcern
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na API:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro interno do servidor'
    }, { status: 500 });
  }
}

// Implementações das funções auxiliares continuam...
function getAssessmentResponse(concern: string, message: string): string {
  return `Entendo melhor sua situação com ${concern}. Vamos mapear como isso tem afetado diferentes áreas da sua vida.`;
}

function getAssessmentRecommendations(concern: string): string[] {
  return ['Mapear sintomas', 'Identificar triggers', 'Avaliar impacto funcional'];
}

function getInterventionResponse(concern: string, message: string): string {
  return `Agora vamos trabalhar estratégias específicas para ${concern}. O que você me contou mostra que há pontos onde podemos atuar.`;
}

function getInterventionTechnique(concern: string): string {
  const techniques = {
    ansiedade: 'Técnicas de Regulação da Ansiedade (TCC)',
    depressao: 'Ativação Comportamental e Reestruturação Cognitiva',
    bipolar: 'Técnicas de Estabilização do Humor (DBT)',
    trauma: 'Técnicas de Grounding e Regulação Emocional',
    toc: 'Exposição e Prevenção de Resposta (EPR)',
    tdah: 'Estratégias de Organização e Foco',
    alimentar: 'Mindful Eating e Regulação Emocional',
    personalidade: 'Habilidades Interpessoais (DBT)',
    substancia: 'Técnicas de Redução de Danos',
    geral: 'Técnicas de Autorregulação'
  };
  return techniques[concern] || techniques.geral;
}

function getInterventionRecommendations(concern: string): string[] {
  return ['Praticar técnicas diariamente', 'Monitorar sintomas', 'Implementar gradualmente'];
}

function getPracticalExercise(concern: string): string {
  const exercises = {
    ansiedade: '**Exercício: Respiração 4-7-8**\n1. Inspire por 4 segundos\n2. Segure por 7 segundos\n3. Expire por 8 segundos\n4. Repita 4x',
    depressao: '**Exercício: Agenda de Atividades Prazerosas**\n1. Liste 3 atividades que já te deram prazer\n2. Escolha uma para hoje\n3. Execute por 10-15 minutos',
    bipolar: '**Exercício: Termômetro do Humor**\n1. Avalie seu humor de 1-10\n2. Note gatilhos que influenciaram\n3. Use técnicas de estabilização',
    trauma: '**Exercício: Grounding 5-4-3-2-1**\n5 coisas que vê\n4 que toca\n3 que ouve\n2 que cheira\n1 que saboreia',
    toc: '**Exercício: Distanciamento do Pensamento**\n1. Note o pensamento intrusivo\n2. Diga: "Estou tendo o pensamento que..."\n3. Continue atividade sem ritual',
    geral: '**Exercício: Mindfulness Básico**\n1. Respire naturalmente\n2. Observe sensações\n3. Volte à respiração quando dispersar'
  };
  return exercises[concern] || exercises.geral;
}

function getIntegrationResponse(concern: string, session: TherapeuticSession): string {
  return `Fizemos um bom trabalho hoje explorando ${concern}. Você demonstrou ${session.riskLevel === 'low' ? 'boa capacidade de enfrentamento' : 'coragem para trabalhar questões difíceis'}.`;
}

function getClosureResponse(concern: string, session: TherapeuticSession): string {
  return `Nossa sessão foi produtiva. Você trabalhou questões importantes relacionadas a ${concern} e desenvolveu ${session.count} insights terapêuticos importantes.`;
}

function getHomeworkAssignment(concern: string): string {
  const assignments = {
    ansiedade: 'respiração 4-7-8 e registro de momentos de ansiedade',
    depressao: 'agenda de atividades prazerosas e caminhada diária',
    bipolar: 'monitoramento do humor 2x/dia',
    trauma: 'técnicas de grounding quando ativado',
    toc: 'atrasar rituais por 2-3 minutos',
    geral: 'mindfulness de 5 minutos e journaling'
  };
  return assignments[concern] || assignments.geral;
}

function getResourcesForHome(concern: string): string {
  return 'App Headspace para meditação, canal do Youtube "Psicologia com Ciência", livros de autoajuda baseados em evidências.';
}

function generateDefaultResponse(concern: string, count: number): {message: string, technique: string, recommendations: string[]} {
  return {
    message: `Continuamos trabalhando bem juntos. Percebo que você está se engajando no processo terapêutico.`,
    technique: 'Manutenção do Rapport Terapêutico',
    recommendations: ['Manter engajamento', 'Continuar explorando']
  };
}