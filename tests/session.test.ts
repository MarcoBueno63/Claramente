// tests/session.test.ts
import { NextRequest } from 'next/server';
import sessionHandler from './bootstrap/sessionHandler';
import prismaMock from './__mocks__/prismaClient';

jest.mock('@prisma/client', () => {
  const prismaMock = require('./__mocks__/prismaClient').default;
  return { PrismaClient: jest.fn(() => prismaMock) };
});

describe('API - Sessão', () => {
  it('deve criar uma sessão válida', async () => {
    const body = { userId: 'test-user', language: 'pt-BR', persona: 'woman', style: 'integrative' };
    const req = new NextRequest('http://localhost/api/session/start', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' }
    });
    prismaMock.session.create.mockResolvedValue({
      id: 'mock-session-id',
      userId: body.userId,
      language: body.language,
      persona: body.persona,
      style: body.style,
      status: 'active',
    });
    const res = await sessionHandler(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toHaveProperty('id');
    expect(data.status).toBe('active');
  });

  it('deve retornar erro para dados inválidos', async () => {
    const body = { userId: '', language: '', persona: '', style: '' };
    const req = new NextRequest('http://localhost/api/session/start', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' }
    });
    const res = await sessionHandler(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data).toHaveProperty('error');
  });
});
