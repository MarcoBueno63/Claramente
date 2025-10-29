import React, { useState, useEffect } from "react";

type Session = {
  id: string;
  status: string;
  startedAt: string;
};

type User = {
  id: string;
  locale: string;
  sessions: Session[];
};

export default function ReportPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/report");
      const data: User[] = await res.json();
      setUsers(data);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-6">Carregando relatório...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded shadow">
      <h1 className="text-2xl font-bold text-indigo-600 mb-4">Relatório de Sessões</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id} className="mb-4 border-b pb-4">
            <div className="font-bold">Usuário: {u.id} | Idioma: {u.locale}</div>
            <div className="text-sm">Sessões: {u.sessions.length}</div>
            <ul className="ml-4">
              {u.sessions.map((s) => (
                <li key={s.id} className="text-xs text-gray-600">
                  Sessão: {s.id} | Status: {s.status} | Início: {new Date(s.startedAt).toLocaleString()}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
