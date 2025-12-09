/**
 * Biblioteca de Frases Emocionais para Teclado Customizado
 * Facilita expressão rápida de sentimentos e necessidades terapêuticas
 */

export interface EmotionalPhrase {
  id: string;
  text: string;
  category: EmotionCategory;
  subcategory?: string;
  therapeuticContext?: string;
}

export type EmotionCategory =
  | 'feliz'
  | 'triste'
  | 'ansioso'
  | 'calmo'
  | 'frustrado'
  | 'grato'
  | 'confuso';

export const EMOTION_LABELS: Record<EmotionCategory, { label: string; emoji: string; color: string }> = {
  feliz: { label: 'Feliz', emoji: '😊', color: '#fbbf24' },
  triste: { label: 'Triste', emoji: '😢', color: '#60a5fa' },
  ansioso: { label: 'Ansioso', emoji: '😰', color: '#f87171' },
  calmo: { label: 'Calmo', emoji: '😌', color: '#34d399' },
  frustrado: { label: 'Frustrado', emoji: '😤', color: '#fb923c' },
  grato: { label: 'Grato', emoji: '🙏', color: '#a78bfa' },
  confuso: { label: 'Confuso', emoji: '😕', color: '#94a3b8' },
};

export const EMOTIONAL_PHRASES: Record<EmotionCategory, EmotionalPhrase[]> = {
  feliz: [
    { id: 'f1', text: 'Estou me sentindo bem hoje!', category: 'feliz' },
    { id: 'f2', text: 'Consegui superar um desafio.', category: 'feliz', therapeuticContext: 'Progresso' },
    { id: 'f3', text: 'Tive um momento de alegria genuína.', category: 'feliz' },
    { id: 'f4', text: 'Estou orgulhoso(a) de mim mesmo(a).', category: 'feliz', therapeuticContext: 'Autoestima' },
    { id: 'f5', text: 'Recebi um elogio que me fez bem.', category: 'feliz' },
    { id: 'f6', text: 'Consegui praticar o autocuidado.', category: 'feliz', therapeuticContext: 'Autocuidado' },
    { id: 'f7', text: 'Estou animado(a) com algo novo.', category: 'feliz' },
    { id: 'f8', text: 'Tive um bom dia no trabalho/escola.', category: 'feliz' },
    { id: 'f9', text: 'Me sinto conectado(a) com pessoas que amo.', category: 'feliz', therapeuticContext: 'Relacionamentos' },
    { id: 'f10', text: 'Consegui fazer algo que estava adiando.', category: 'feliz', therapeuticContext: 'Produtividade' },
  ],

  triste: [
    { id: 't1', text: 'Estou me sentindo triste hoje.', category: 'triste' },
    { id: 't2', text: 'Sinto um vazio que não sei explicar.', category: 'triste', therapeuticContext: 'Humor deprimido' },
    { id: 't3', text: 'Chorei e está tudo bem.', category: 'triste', therapeuticContext: 'Validação emocional' },
    { id: 't4', text: 'Não estou tendo energia para nada.', category: 'triste', therapeuticContext: 'Baixa energia' },
    { id: 't5', text: 'Estou com saudades de alguém.', category: 'triste', therapeuticContext: 'Luto/perda' },
    { id: 't6', text: 'Me sinto sozinho(a) mesmo rodeado(a) de pessoas.', category: 'triste', therapeuticContext: 'Solidão' },
    { id: 't7', text: 'Hoje foi um dia difícil.', category: 'triste' },
    { id: 't8', text: 'Estou me criticando muito.', category: 'triste', therapeuticContext: 'Autocrítica' },
    { id: 't9', text: 'Sinto que nada está dando certo.', category: 'triste', therapeuticContext: 'Desesperança' },
    { id: 't10', text: 'Preciso de um momento para processar meus sentimentos.', category: 'triste', therapeuticContext: 'Processamento emocional' },
  ],

  ansioso: [
    { id: 'a1', text: 'Estou me sentindo ansioso(a).', category: 'ansioso' },
    { id: 'a2', text: 'Meu coração está acelerado.', category: 'ansioso', therapeuticContext: 'Sintoma físico' },
    { id: 'a3', text: 'Estou preocupado(a) com muitas coisas.', category: 'ansioso', therapeuticContext: 'Preocupação' },
    { id: 'a4', text: 'Não consigo parar de pensar em algo.', category: 'ansioso', therapeuticContext: 'Ruminação' },
    { id: 'a5', text: 'Estou com medo de algo dar errado.', category: 'ansioso', therapeuticContext: 'Antecipação negativa' },
    { id: 'a6', text: 'Preciso de ajuda para acalmar a mente.', category: 'ansioso', therapeuticContext: 'Necessidade de regulação' },
    { id: 'a7', text: 'Estou tendo dificuldade para respirar normalmente.', category: 'ansioso', therapeuticContext: 'Sintoma físico' },
    { id: 'a8', text: 'Sinto que vou perder o controle.', category: 'ansioso', therapeuticContext: 'Pânico' },
    { id: 'a9', text: 'Estou evitando algo importante.', category: 'ansioso', therapeuticContext: 'Evitação' },
    { id: 'a10', text: 'Preciso praticar exercícios de respiração.', category: 'ansioso', therapeuticContext: 'Estratégia de regulação' },
  ],

  calmo: [
    { id: 'c1', text: 'Estou me sentindo calmo(a).', category: 'calmo' },
    { id: 'c2', text: 'Consegui meditar hoje.', category: 'calmo', therapeuticContext: 'Prática mindfulness' },
    { id: 'c3', text: 'Minha respiração está tranquila.', category: 'calmo', therapeuticContext: 'Estado fisiológico' },
    { id: 'c4', text: 'Estou presente no momento.', category: 'calmo', therapeuticContext: 'Mindfulness' },
    { id: 'c5', text: 'Sinto paz interior.', category: 'calmo' },
    { id: 'c6', text: 'Consegui desacelerar e relaxar.', category: 'calmo', therapeuticContext: 'Autorregulação' },
    { id: 'c7', text: 'Estou aceitando as coisas como são.', category: 'calmo', therapeuticContext: 'Aceitação radical' },
    { id: 'c8', text: 'Me sinto em equilíbrio.', category: 'calmo' },
    { id: 'c9', text: 'Praticando gratidão pelo agora.', category: 'calmo', therapeuticContext: 'Gratidão' },
    { id: 'c10', text: 'Minha mente está clara.', category: 'calmo' },
  ],

  frustrado: [
    { id: 'fr1', text: 'Estou me sentindo frustrado(a).', category: 'frustrado' },
    { id: 'fr2', text: 'As coisas não estão saindo como eu esperava.', category: 'frustrado', therapeuticContext: 'Expectativas não atendidas' },
    { id: 'fr3', text: 'Estou com raiva de mim mesmo(a).', category: 'frustrado', therapeuticContext: 'Raiva internalizada' },
    { id: 'fr4', text: 'Me sinto preso(a) em uma situação.', category: 'frustrado', therapeuticContext: 'Impotência' },
    { id: 'fr5', text: 'Estou irritado(a) com alguém.', category: 'frustrado', therapeuticContext: 'Conflito interpessoal' },
    { id: 'fr6', text: 'Sinto que ninguém me entende.', category: 'frustrado', therapeuticContext: 'Invalidação' },
    { id: 'fr7', text: 'Tentei muito e não consegui.', category: 'frustrado', therapeuticContext: 'Fracasso percebido' },
    { id: 'fr8', text: 'Preciso expressar essa frustração de forma saudável.', category: 'frustrado', therapeuticContext: 'Expressão emocional' },
    { id: 'fr9', text: 'Estou cansado(a) de lutar.', category: 'frustrado', therapeuticContext: 'Exaustão' },
    { id: 'fr10', text: 'Quero desistir, mas sei que não devo.', category: 'frustrado', therapeuticContext: 'Resiliência' },
  ],

  grato: [
    { id: 'g1', text: 'Estou me sentindo grato(a).', category: 'grato' },
    { id: 'g2', text: 'Agradeço pelas pessoas na minha vida.', category: 'grato', therapeuticContext: 'Gratidão relacional' },
    { id: 'g3', text: 'Reconheço as pequenas coisas boas.', category: 'grato', therapeuticContext: 'Mindfulness' },
    { id: 'g4', text: 'Sou grato(a) por estar vivo(a).', category: 'grato', therapeuticContext: 'Gratidão existencial' },
    { id: 'g5', text: 'Agradeço pelo aprendizado nas dificuldades.', category: 'grato', therapeuticContext: 'Crescimento pós-traumático' },
    { id: 'g6', text: 'Tenho sorte por ter saúde.', category: 'grato', therapeuticContext: 'Gratidão pela saúde' },
    { id: 'g7', text: 'Valorizo os momentos de paz.', category: 'grato', therapeuticContext: 'Apreciação' },
    { id: 'g8', text: 'Sou grato(a) pelo progresso que fiz.', category: 'grato', therapeuticContext: 'Autoprogresso' },
    { id: 'g9', text: 'Agradeço por esta oportunidade de crescimento.', category: 'grato', therapeuticContext: 'Reframing cognitivo' },
    { id: 'g10', text: 'Praticando gratidão diariamente.', category: 'grato', therapeuticContext: 'Hábito terapêutico' },
  ],

  confuso: [
    { id: 'co1', text: 'Estou me sentindo confuso(a).', category: 'confuso' },
    { id: 'co2', text: 'Não sei o que estou sentindo.', category: 'confuso', therapeuticContext: 'Alexitimia' },
    { id: 'co3', text: 'Meus pensamentos estão embaralhados.', category: 'confuso', therapeuticContext: 'Confusão cognitiva' },
    { id: 'co4', text: 'Preciso de ajuda para organizar minhas ideias.', category: 'confuso', therapeuticContext: 'Necessidade de estruturação' },
    { id: 'co5', text: 'Não sei qual decisão tomar.', category: 'confuso', therapeuticContext: 'Indecisão' },
    { id: 'co6', text: 'Estou recebendo mensagens contraditórias.', category: 'confuso', therapeuticContext: 'Dissonância cognitiva' },
    { id: 'co7', text: 'Sinto várias emoções ao mesmo tempo.', category: 'confuso', therapeuticContext: 'Emoções mistas' },
    { id: 'co8', text: 'Não entendo por que me sinto assim.', category: 'confuso', therapeuticContext: 'Falta de insight' },
    { id: 'co9', text: 'Preciso de clareza sobre meus valores.', category: 'confuso', therapeuticContext: 'Busca de valores' },
    { id: 'co10', text: 'Quero explorar esses sentimentos complexos.', category: 'confuso', therapeuticContext: 'Autoexploração' },
  ],
};

/**
 * Frases rápidas de início de conversa
 */
export const QUICK_STARTERS: EmotionalPhrase[] = [
  { id: 'qs1', text: 'Estou me sentindo...', category: 'confuso' },
  { id: 'qs2', text: 'Gostaria de trabalhar em...', category: 'confuso' },
  { id: 'qs3', text: 'Preciso de ajuda com...', category: 'ansioso' },
  { id: 'qs4', text: 'Estou tendo dificuldade em...', category: 'frustrado' },
  { id: 'qs5', text: 'Quero explorar...', category: 'confuso' },
  { id: 'qs6', text: 'Hoje aconteceu...', category: 'confuso' },
];

/**
 * Atalhos para exercícios terapêuticos
 */
export const EXERCISE_SHORTCUTS: EmotionalPhrase[] = [
  { id: 'ex1', text: 'Vamos fazer um exercício de respiração?', category: 'ansioso', therapeuticContext: 'Respiração' },
  { id: 'ex2', text: 'Preciso de um exercício de grounding.', category: 'ansioso', therapeuticContext: 'Grounding' },
  { id: 'ex3', text: 'Pode me guiar em uma meditação?', category: 'calmo', therapeuticContext: 'Meditação' },
  { id: 'ex4', text: 'Vamos fazer reestruturação cognitiva?', category: 'frustrado', therapeuticContext: 'TCC' },
  { id: 'ex5', text: 'Quero praticar aceitação radical.', category: 'triste', therapeuticContext: 'DBT' },
  { id: 'ex6', text: 'Vamos trabalhar com valores pessoais?', category: 'confuso', therapeuticContext: 'ACT' },
];

/**
 * Obtém todas as frases de uma categoria
 */
export function getPhrasesByCategory(category: EmotionCategory): EmotionalPhrase[] {
  return EMOTIONAL_PHRASES[category] || [];
}

/**
 * Obtém todas as categorias disponíveis
 */
export function getAllCategories(): EmotionCategory[] {
  return Object.keys(EMOTIONAL_PHRASES) as EmotionCategory[];
}

/**
 * Busca frases por texto
 */
export function searchPhrases(query: string): EmotionalPhrase[] {
  const lowerQuery = query.toLowerCase();
  const allPhrases = Object.values(EMOTIONAL_PHRASES).flat();
  
  return allPhrases.filter(phrase =>
    phrase.text.toLowerCase().includes(lowerQuery) ||
    phrase.therapeuticContext?.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Obtém frase por ID
 */
export function getPhraseById(id: string): EmotionalPhrase | undefined {
  const allPhrases = [
    ...Object.values(EMOTIONAL_PHRASES).flat(),
    ...QUICK_STARTERS,
    ...EXERCISE_SHORTCUTS,
  ];
  
  return allPhrases.find(phrase => phrase.id === id);
}
