// Audio scripts for meditation and breathing exercises

export interface AudioScript {
  id: string;
  title: string;
  duration: number; // in seconds
  category: 'meditation' | 'breathing' | 'grounding' | 'sleep';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  script: AudioSegment[];
}

export interface AudioSegment {
  text: string;
  pause: number; // seconds to pause after speaking
  voice?: 'calm' | 'energetic' | 'soothing';
}

export const audioLibrary: AudioScript[] = [
  // Breathing Exercises
  {
    id: 'breathing-478',
    title: 'Respiração 4-7-8',
    duration: 300, // 5 minutes
    category: 'breathing',
    difficulty: 'beginner',
    script: [
      {
        text: 'Bem-vindo ao exercício de respiração 4-7-8. Encontre uma posição confortável.',
        pause: 3,
      },
      {
        text: 'Esta técnica ajuda a acalmar a mente e relaxar o corpo.',
        pause: 2,
      },
      {
        text: 'Vamos começar. Expire todo o ar dos pulmões.',
        pause: 4,
      },
      {
        text: 'Agora, inspire suavemente pelo nariz contando até 4.',
        pause: 5,
      },
      {
        text: 'Segure a respiração contando até 7.',
        pause: 8,
      },
      {
        text: 'Expire pela boca contando até 8.',
        pause: 9,
      },
      {
        text: 'Muito bem. Vamos repetir mais três vezes.',
        pause: 2,
      },
      // Repeat cycle
      {
        text: 'Inspire pelo nariz... 2, 3, 4.',
        pause: 5,
      },
      {
        text: 'Segure... 2, 3, 4, 5, 6, 7.',
        pause: 8,
      },
      {
        text: 'Expire pela boca... 2, 3, 4, 5, 6, 7, 8.',
        pause: 9,
      },
      {
        text: 'Continue neste ritmo. Inspire... 2, 3, 4.',
        pause: 5,
      },
      {
        text: 'Segure... 2, 3, 4, 5, 6, 7.',
        pause: 8,
      },
      {
        text: 'Expire... 2, 3, 4, 5, 6, 7, 8.',
        pause: 9,
      },
      {
        text: 'Última vez. Inspire profundamente.',
        pause: 5,
      },
      {
        text: 'Segure a respiração.',
        pause: 8,
      },
      {
        text: 'Solte completamente.',
        pause: 9,
      },
      {
        text: 'Ótimo trabalho. Respire naturalmente e observe como se sente.',
        pause: 5,
      },
    ],
  },

  {
    id: 'breathing-box',
    title: 'Respiração Quadrada',
    duration: 240, // 4 minutes
    category: 'breathing',
    difficulty: 'beginner',
    script: [
      {
        text: 'Vamos praticar a respiração quadrada, também conhecida como respiração em caixa.',
        pause: 3,
      },
      {
        text: 'Imagine desenhar um quadrado com sua respiração. Cada lado tem 4 segundos.',
        pause: 3,
      },
      {
        text: 'Inspire contando até 4.',
        pause: 5,
      },
      {
        text: 'Segure por 4 segundos.',
        pause: 5,
      },
      {
        text: 'Expire contando até 4.',
        pause: 5,
      },
      {
        text: 'Aguarde 4 segundos antes de inspirar novamente.',
        pause: 5,
      },
      {
        text: 'Continue este ciclo. Inspire... 2, 3, 4.',
        pause: 5,
      },
      {
        text: 'Segure... 2, 3, 4.',
        pause: 5,
      },
      {
        text: 'Expire... 2, 3, 4.',
        pause: 5,
      },
      {
        text: 'Pausa... 2, 3, 4.',
        pause: 5,
      },
    ],
  },

  // Meditation
  {
    id: 'meditation-body-scan',
    title: 'Body Scan - Relaxamento Corporal',
    duration: 600, // 10 minutes
    category: 'meditation',
    difficulty: 'beginner',
    script: [
      {
        text: 'Bem-vindo a esta meditação de body scan. Deite-se ou sente-se confortavelmente.',
        pause: 4,
      },
      {
        text: 'Feche os olhos suavemente e respire profundamente.',
        pause: 5,
      },
      {
        text: 'Vamos fazer uma jornada pelo seu corpo, liberando tensões.',
        pause: 3,
      },
      {
        text: 'Comece trazendo sua atenção para os dedos dos pés.',
        pause: 5,
      },
      {
        text: 'Observe qualquer sensação. Calor, frio, formigamento.',
        pause: 8,
      },
      {
        text: 'Agora, relaxe completamente os dedos dos pés.',
        pause: 5,
      },
      {
        text: 'Suba para os pés. Observe as sensações nos pés.',
        pause: 8,
      },
      {
        text: 'Relaxe os pés completamente. Solte qualquer tensão.',
        pause: 5,
      },
      {
        text: 'Traga a atenção para as panturrilhas.',
        pause: 8,
      },
      {
        text: 'Observe, e relaxe.',
        pause: 5,
      },
      {
        text: 'Agora os joelhos. Relaxe completamente.',
        pause: 5,
      },
      {
        text: 'Suba para as coxas. Observe qualquer tensão e deixe ir.',
        pause: 8,
      },
      {
        text: 'Quadril e região pélvica. Relaxe profundamente.',
        pause: 8,
      },
      {
        text: 'Abdômen. Respire e relaxe.',
        pause: 8,
      },
      {
        text: 'Peito e coração. Sinta sua respiração fluir.',
        pause: 8,
      },
      {
        text: 'Costas, desde a base até os ombros. Libere toda tensão.',
        pause: 8,
      },
      {
        text: 'Ombros. Deixe-os cair naturalmente.',
        pause: 5,
      },
      {
        text: 'Braços e mãos. Relaxe completamente.',
        pause: 8,
      },
      {
        text: 'Pescoço e garganta. Solte qualquer rigidez.',
        pause: 5,
      },
      {
        text: 'Rosto. Relaxe a mandíbula, os olhos, a testa.',
        pause: 8,
      },
      {
        text: 'Todo o couro cabeludo. Completamente relaxado.',
        pause: 5,
      },
      {
        text: 'Agora, observe seu corpo inteiro. Completamente relaxado.',
        pause: 10,
      },
      {
        text: 'Respire profundamente e aproveite este momento de paz.',
        pause: 15,
      },
      {
        text: 'Quando estiver pronto, comece a mover suavemente os dedos.',
        pause: 5,
      },
      {
        text: 'Abra os olhos devagar. Você está renovado.',
        pause: 3,
      },
    ],
  },

  {
    id: 'meditation-mindfulness',
    title: 'Mindfulness - Atenção Plena',
    duration: 420, // 7 minutes
    category: 'meditation',
    difficulty: 'beginner',
    script: [
      {
        text: 'Bem-vindo à meditação de atenção plena.',
        pause: 3,
      },
      {
        text: 'Sente-se confortavelmente com a coluna ereta.',
        pause: 4,
      },
      {
        text: 'Feche os olhos e respire naturalmente.',
        pause: 5,
      },
      {
        text: 'Traga toda sua atenção para a respiração.',
        pause: 5,
      },
      {
        text: 'Observe o ar entrando pelas narinas.',
        pause: 8,
      },
      {
        text: 'Sinta o peito expandir.',
        pause: 8,
      },
      {
        text: 'Observe o ar saindo.',
        pause: 8,
      },
      {
        text: 'Sempre que sua mente vagar, e ela vai vagar, está tudo bem.',
        pause: 5,
      },
      {
        text: 'Simplesmente note onde ela foi, sem julgamento.',
        pause: 5,
      },
      {
        text: 'E traga gentilmente de volta para a respiração.',
        pause: 8,
      },
      {
        text: 'Continue observando cada inspiração.',
        pause: 10,
      },
      {
        text: 'E cada expiração.',
        pause: 10,
      },
      {
        text: 'Se surgirem pensamentos, imagens, sensações... está tudo bem.',
        pause: 5,
      },
      {
        text: 'Apenas observe-os passar, como nuvens no céu.',
        pause: 10,
      },
      {
        text: 'Sem se apegar, sem julgar.',
        pause: 8,
      },
      {
        text: 'Sempre retornando à âncora da respiração.',
        pause: 10,
      },
      {
        text: 'Continue por mais alguns momentos.',
        pause: 30,
      },
      {
        text: 'Agora, amplie sua consciência para todo o corpo.',
        pause: 8,
      },
      {
        text: 'Para os sons ao seu redor.',
        pause: 8,
      },
      {
        text: 'Quando estiver pronto, abra os olhos suavemente.',
        pause: 5,
      },
      {
        text: 'Carregue esta atenção plena para o resto do seu dia.',
        pause: 3,
      },
    ],
  },

  // Grounding
  {
    id: 'grounding-5-4-3-2-1',
    title: 'Grounding 5-4-3-2-1 Guiado',
    duration: 480, // 8 minutes
    category: 'grounding',
    difficulty: 'beginner',
    script: [
      {
        text: 'Este é o exercício de grounding 5-4-3-2-1.',
        pause: 2,
      },
      {
        text: 'Ele ajuda a trazer você de volta ao momento presente quando estiver ansioso.',
        pause: 3,
      },
      {
        text: 'Vamos começar. Respire profundamente.',
        pause: 5,
      },
      {
        text: 'Primeiro, olhe ao seu redor e identifique 5 coisas que você pode VER.',
        pause: 3,
      },
      {
        text: 'Observe cada uma delas. Cor, forma, textura.',
        pause: 15,
      },
      {
        text: 'Agora, identifique 4 coisas que você pode TOCAR.',
        pause: 3,
      },
      {
        text: 'Toque-as fisicamente se possível. Observe a sensação.',
        pause: 15,
      },
      {
        text: 'Próximo, identifique 3 coisas que você pode OUVIR.',
        pause: 3,
      },
      {
        text: 'Sons próximos ou distantes. Apenas observe.',
        pause: 15,
      },
      {
        text: 'Agora, 2 coisas que você pode CHEIRAR.',
        pause: 3,
      },
      {
        text: 'Pode ser o ar, sua roupa, qualquer aroma ao redor.',
        pause: 15,
      },
      {
        text: 'Por fim, 1 coisa que você pode SABOREAR.',
        pause: 3,
      },
      {
        text: 'Talvez o gosto na sua boca neste momento.',
        pause: 10,
      },
      {
        text: 'Ótimo. Agora respire profundamente.',
        pause: 5,
      },
      {
        text: 'Observe como você está mais presente, mais calmo.',
        pause: 5,
      },
      {
        text: 'Você conseguiu se reconectar com o aqui e agora.',
        pause: 3,
      },
    ],
  },

  // Sleep
  {
    id: 'sleep-progressive-relaxation',
    title: 'Relaxamento Progressivo para Dormir',
    duration: 900, // 15 minutes
    category: 'sleep',
    difficulty: 'beginner',
    script: [
      {
        text: 'Bem-vindo a este relaxamento progressivo para dormir.',
        pause: 3,
      },
      {
        text: 'Deite-se confortavelmente. Ajuste seu corpo.',
        pause: 5,
      },
      {
        text: 'Feche os olhos e respire profundamente.',
        pause: 8,
      },
      {
        text: 'Vamos relaxar cada parte do corpo, de baixo para cima.',
        pause: 3,
      },
      {
        text: 'Comece com os dedos dos pés. Aperte-os por 5 segundos.',
        pause: 6,
      },
      {
        text: 'Agora solte completamente. Sinta o relaxamento.',
        pause: 8,
      },
      {
        text: 'Tencione os músculos das panturrilhas.',
        pause: 6,
      },
      {
        text: 'E relaxe. Deixe ir toda a tensão.',
        pause: 8,
      },
      {
        text: 'Coxas. Tencione.',
        pause: 6,
      },
      {
        text: 'E relaxe profundamente.',
        pause: 8,
      },
      {
        text: 'Glúteos e quadril. Aperte.',
        pause: 6,
      },
      {
        text: 'E solte.',
        pause: 8,
      },
      {
        text: 'Abdômen. Contraia.',
        pause: 6,
      },
      {
        text: 'E relaxe.',
        pause: 8,
      },
      {
        text: 'Peito. Inspire profundamente e segure.',
        pause: 8,
      },
      {
        text: 'Expire completamente. Relaxe.',
        pause: 8,
      },
      {
        text: 'Costas. Arqueie levemente.',
        pause: 6,
      },
      {
        text: 'E solte, afundando no colchão.',
        pause: 8,
      },
      {
        text: 'Braços. Aperte os punhos.',
        pause: 6,
      },
      {
        text: 'E relaxe completamente.',
        pause: 8,
      },
      {
        text: 'Ombros. Levante-os em direção às orelhas.',
        pause: 6,
      },
      {
        text: 'Deixe-os cair. Pesados e relaxados.',
        pause: 8,
      },
      {
        text: 'Pescoço. Gire suavemente.',
        pause: 6,
      },
      {
        text: 'E relaxe.',
        pause: 8,
      },
      {
        text: 'Rosto. Franza a testa.',
        pause: 6,
      },
      {
        text: 'E relaxe. Deixe o rosto suave.',
        pause: 8,
      },
      {
        text: 'Mandíbula. Aperte.',
        pause: 6,
      },
      {
        text: 'E solte. Deixe a boca entreaberta.',
        pause: 8,
      },
      {
        text: 'Todo seu corpo está completamente relaxado.',
        pause: 10,
      },
      {
        text: 'Sinta-se afundando no colchão.',
        pause: 10,
      },
      {
        text: 'Cada respiração o leva mais fundo no relaxamento.',
        pause: 15,
      },
      {
        text: 'Sua mente está calma.',
        pause: 15,
      },
      {
        text: 'Seu corpo está em paz.',
        pause: 15,
      },
      {
        text: 'Permita-se deslizar suavemente para o sono.',
        pause: 30,
      },
    ],
  },
];

// Helper to get audio by category
export function getAudioByCategory(category: AudioScript['category']): AudioScript[] {
  return audioLibrary.filter((audio) => audio.category === category);
}

// Helper to get audio by difficulty
export function getAudioByDifficulty(difficulty: AudioScript['difficulty']): AudioScript[] {
  return audioLibrary.filter((audio) => audio.difficulty === difficulty);
}

// Helper to get audio by ID
export function getAudioById(id: string): AudioScript | undefined {
  return audioLibrary.find((audio) => audio.id === id);
}

// Format duration for display
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return secs > 0 ? `${mins}min ${secs}s` : `${mins}min`;
}
