// lib/api.ts

export async function startSession({ userId, language, persona, style }: {
  userId: string;
  language: string;
  persona: string;
  style: string;
}) {
  const res = await fetch("/api/session/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, language, persona, style })
  });
  return res.json();
}

export async function sendMessage(sessionId: string, content: string, role: string) {
  const res = await fetch(`/api/session/${sessionId}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, role })
  });
  return res.json();
}

export async function endSession(sessionId: string, summary: string) {
  const res = await fetch(`/api/session/${sessionId}/end`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ summary })
  });
  return res.json();
}

export async function getPsychologists() {
  const res = await fetch("/api/psychologists");
  return res.json();
}
