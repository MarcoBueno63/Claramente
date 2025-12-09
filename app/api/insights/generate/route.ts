import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId, period = 'week' } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar dados do usuário dos últimos 7 dias (ou período especificado)
    const userData = await fetchUserData(userId, period);

    // Gerar insights com GPT-4
    const insights = await generateInsights(userData);

    return NextResponse.json({
      success: true,
      insights,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[AI Insights] Error:', error);
    return NextResponse.json(
      { error: 'Erro ao gerar insights' },
      { status: 500 }
    );
  }
}

async function fetchUserData(userId: string, period: string) {
  // Este é um mock - na produção, buscar do banco de dados
  // Incluiria: conversas, exercícios completados, mood check-ins, etc.
  
  return {
    userId,
    period,
    sessions: [
      {
        date: '2025-11-20',
        mood: 'ansioso',
        topics: ['trabalho', 'relacionamentos'],
        duration: 25,
        exercises: ['respiração'],
      },
      {
        date: '2025-11-22',
        mood: 'calmo',
        topics: ['autocuidado', 'gratidão'],
        duration: 30,
        exercises: ['meditação', 'journaling'],
      },
      {
        date: '2025-11-24',
        mood: 'motivado',
        topics: ['objetivos', 'crescimento'],
        duration: 35,
        exercises: ['visualização'],
      },
    ],
    checkins: [
      { date: '2025-11-20', mood: 3, note: 'Dia difícil no trabalho' },
      { date: '2025-11-21', mood: 4, note: 'Melhor hoje' },
      { date: '2025-11-22', mood: 5, note: 'Dia produtivo' },
      { date: '2025-11-23', mood: 4, note: 'Normal' },
      { date: '2025-11-24', mood: 5, note: 'Muito bem!' },
    ],
    streaks: {
      sessions: 7,
      exercises: 5,
      monitoring: 14,
    },
    completedExercises: ['respiração', 'meditação', 'journaling', 'grounding', 'visualização'],
  };
}

async function generateInsights(userData: any) {
  const openaiKey = process.env.OPENAI_API_KEY;

  if (!openaiKey) {
    console.warn('[AI Insights] OpenAI API key não configurada, retornando insights mock');
    return getMockInsights(userData);
  }

  try {
    const prompt = `
Você é Clara, uma terapeuta virtual especializada em TCC (Terapia Cognitivo-Comportamental).
Analise os dados do usuário da última semana e gere insights personalizados e construtivos.

Dados do usuário:
${JSON.stringify(userData, null, 2)}

Gere um relatório JSON com a seguinte estrutura:
{
  "summary": "Resumo geral da semana (2-3 frases)",
  "patterns": [
    {
      "title": "Nome do padrão identificado",
      "description": "Descrição detalhada",
      "type": "positive" | "neutral" | "concern",
      "recommendation": "Recomendação específica"
    }
  ],
  "moodTrend": {
    "direction": "improving" | "stable" | "declining",
    "description": "Análise da evolução do humor"
  },
  "achievements": [
    "Conquista 1",
    "Conquista 2",
    "Conquista 3"
  ],
  "suggestions": [
    {
      "title": "Sugestão 1",
      "description": "Descrição",
      "priority": "high" | "medium" | "low"
    }
  ],
  "encouragement": "Mensagem motivacional personalizada"
}

Seja empática, específica e focada em crescimento. Use os dados reais fornecidos.
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'Você é Clara, uma terapeuta virtual especializada em TCC. Gere insights sempre em formato JSON válido.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const insightsText = data.choices[0].message.content;
    const insights = JSON.parse(insightsText);

    return insights;
  } catch (error) {
    console.error('[AI Insights] Error calling OpenAI:', error);
    return getMockInsights(userData);
  }
}

function getMockInsights(userData: any) {
  // Análise básica dos dados
  const avgMood = userData.checkins.reduce((sum: number, c: any) => sum + c.mood, 0) / userData.checkins.length;
  const moodTrend = userData.checkins[userData.checkins.length - 1].mood > userData.checkins[0].mood
    ? 'improving'
    : userData.checkins[userData.checkins.length - 1].mood < userData.checkins[0].mood
    ? 'declining'
    : 'stable';

  return {
    summary: `Esta semana você completou ${userData.sessions.length} sessões e manteve uma sequência de ${userData.streaks.sessions} dias. Seu humor médio foi ${avgMood.toFixed(1)}/5, mostrando ${
      moodTrend === 'improving' ? 'melhora gradual' : moodTrend === 'declining' ? 'alguns desafios' : 'estabilidade'
    }.`,
    patterns: [
      {
        title: 'Consistência em Autocuidado',
        description: `Você tem mantido uma sequência de ${userData.streaks.sessions} dias consecutivos de sessões. Isso demonstra comprometimento com seu bem-estar.`,
        type: 'positive',
        recommendation: 'Continue priorizando este tempo para você. Considere estabelecer um horário fixo para tornar isso um hábito ainda mais sólido.',
      },
      {
        title: 'Variedade de Exercícios',
        description: `Você explorou ${userData.completedExercises.length} tipos diferentes de exercícios: ${userData.completedExercises.join(', ')}.`,
        type: 'positive',
        recommendation: 'Esta diversidade é excelente! Identifique quais exercícios trazem mais benefícios e inclua-os com mais frequência.',
      },
      {
        title: 'Tópicos Recorrentes',
        description: 'Suas sessões abordaram principalmente trabalho, relacionamentos e crescimento pessoal.',
        type: 'neutral',
        recommendation: 'Estes são temas importantes. Considere explorar técnicas específicas de TCC para cada área, como reestruturação cognitiva para pensamentos sobre trabalho.',
      },
    ],
    moodTrend: {
      direction: moodTrend,
      description:
        moodTrend === 'improving'
          ? 'Seu humor mostrou tendência de melhora ao longo da semana. Continue com as práticas que têm funcionado!'
          : moodTrend === 'declining'
          ? 'Houve uma leve diminuição no humor. Isso é normal e pode ser uma oportunidade para identificar gatilhos e aplicar estratégias de enfrentamento.'
          : 'Seu humor permaneceu relativamente estável, o que indica bom gerenciamento emocional.',
    },
    achievements: [
      `🔥 Manteve sequência de ${userData.streaks.sessions} dias de sessões`,
      `🧘 Completou ${userData.completedExercises.length} tipos diferentes de exercícios`,
      `📊 Registrou seu humor ${userData.checkins.length} vezes esta semana`,
      '💪 Demonstrou comprometimento com autocuidado',
    ],
    suggestions: [
      {
        title: 'Exercício de Gratidão',
        description: 'Baseado em suas conversas sobre gratidão, experimente manter um diário de gratidão diário por uma semana.',
        priority: 'medium',
      },
      {
        title: 'Técnicas de Relaxamento',
        description: 'Para complementar suas práticas de respiração, explore a meditação body scan de 10 minutos.',
        priority: 'medium',
      },
      {
        title: 'Definição de Objetivos',
        description: 'Você mencionou objetivos e crescimento. Que tal usar a técnica SMART para definir uma meta específica para o mês?',
        priority: 'high',
      },
    ],
    encouragement: `Você está fazendo um trabalho excepcional! Sua consistência de ${userData.streaks.sessions} dias mostra verdadeiro compromisso com seu bem-estar. Cada sessão, cada exercício, cada momento de reflexão é um investimento em você mesmo. Continue nessa jornada de autoconhecimento e crescimento. Você merece todo o cuidado que está se dedicando! 💜`,
  };
}
