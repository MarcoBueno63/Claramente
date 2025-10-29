// tests/chat.test.ts
import { NextRequest } from 'next/server';
import chatHandler from './bootstrap/chatHandler';

describe('API - Chat', () => {
  it('deve iniciar uma sessão de chat válida', async () => {
    const body = { userId: 'test-user', message: 'Olá, preciso de ajuda.' };
    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' }
    });
    const res = await chatHandler(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toHaveProperty('reply');
  });

  it('deve retornar erro para mensagem inválida', async () => {
    const body = { userId: '', message: '' };
    const req = new NextRequest('http://localhost/api/chat', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' }
    });
    const res = await chatHandler(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data).toHaveProperty('error');
  });
});
