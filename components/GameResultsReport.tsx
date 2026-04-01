
import React, { useEffect, useState } from 'react';
import { getUser } from '../lib/auth';

interface GameResult {
  userId: string;
  game: string;
  score: number;
  details?: {
    moves?: number;
    round?: number;
    responses?: unknown[];
  };
  timestamp: string;
}

type GroupedResults = Record<string, GameResult[]>;

export default function GameResultsReport() {
  const [results, setResults] = useState<GameResult[]>([]);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    fetch('/api/game-results')
      .then(res => res.json())
      .then((data: GameResult[]) => {
        setResults(data.filter((r) => r.userId === user.id));
        setLoading(false);
      });
  }, [user.id]);

  const exportCSV = () => {
    if (!results.length) return;
    const header = ['Jogo', 'Data', 'Pontuação', 'Movimentos', 'Rodada', 'Respostas'];
    const rows = results.map(r => [
      r.game,
      new Date(r.timestamp).toLocaleString(),
      r.score,
      r.details?.moves ?? '',
      r.details?.round ?? '',
      r.details?.responses ? r.details.responses.length : ''
    ]);
    const csv = [header, ...rows].map(row => row.map(String).join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'relatorio-jogos.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    window.print();
  };

  const shareEmail = () => {
    if (!results.length) return;
    const header = ['Jogo', 'Data', 'Pontuação', 'Movimentos', 'Rodada', 'Respostas'];
    const rows = results.map(r => [
      r.game,
      new Date(r.timestamp).toLocaleString(),
      r.score,
      r.details?.moves ?? '',
      r.details?.round ?? '',
      r.details?.responses ? r.details.responses.length : ''
    ]);
    const csv = [header, ...rows].map(row => row.map(String).join(';')).join('%0D%0A');
    const subject = encodeURIComponent('Relatório de Desempenho dos Jogos');
    const body = encodeURIComponent('Segue em anexo o relatório de desempenho dos jogos:\n\n' + csv);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (loading) return <div className="p-4">Carregando relatório...</div>;
  if (results.length === 0) return <div className="p-4">Nenhum resultado registrado ainda.</div>;

  // Agrupa por tipo de jogo
  const grouped: GroupedResults = results.reduce((acc: GroupedResults, r: GameResult) => {
    acc[r.game] = acc[r.game] || [];
    acc[r.game].push(r);
    return acc;
  }, {});

  return (
    <div className="p-4 bg-white rounded shadow mb-6">
      <div className="flex flex-wrap gap-2 justify-between items-center mb-2">
        <h3 className="text-lg font-bold text-center">📈 Relatório de Desempenho</h3>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            onClick={exportCSV}
          >
            Exportar CSV
          </button>
          <button
            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            onClick={exportPDF}
          >
            Exportar PDF
          </button>
          <button
            className="px-3 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
            onClick={shareEmail}
          >
            Compartilhar por E-mail
          </button>
        </div>
      </div>
      {Object.keys(grouped).map(game => (
        <div key={game} className="mb-4">
          <h4 className="font-semibold mb-2 capitalize">{game}</h4>
          <ul className="text-sm space-y-1">
            {grouped[game].map((r, idx: number) => (
              <li key={idx} className="border-b pb-1">
                <span className="font-medium">{new Date(r.timestamp).toLocaleString()}:</span> 
                Pontuação: <span className="text-blue-600">{r.score}</span>
                {r.details && r.details.moves && <span> | Movimentos: {r.details.moves}</span>}
                {r.details && r.details.round && <span> | Rodada: {r.details.round}</span>}
                {r.details && r.details.responses && <span> | Respostas: {r.details.responses.length}</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
