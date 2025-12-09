// tests/lead.test.ts
import { NextRequest } from 'next/server';
import leadHandler from './bootstrap/leadHandler';
import prismaMock from './__mocks__/prismaClient';

jest.mock('@prisma/client', () => {
  const prismaMock = require('./__mocks__/prismaClient').default; // This line remains for mocking
  return { PrismaClient: jest.fn(() => prismaMock) };
});

describe('API - Leads', () => {
  it('deve criar um lead válido', async () => {
    const body = { userId: 'test-user', psychologistId: 'test-psychologist' };
    const req = new NextRequest('http://localhost/api/lead', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' }
    });
    prismaMock.lead.create.mockResolvedValue({
      id: 'mock-id',
      userId: body.userId,
      psychologistId: body.psychologistId,
      status: 'new',
    });
    const res = await leadHandler(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data).toHaveProperty('id');
    expect(data.status).toBe('new');
  });

  it('deve retornar erro para dados inválidos', async () => {
    const body = { userId: '', psychologistId: '' };
    const req = new NextRequest('http://localhost/api/lead', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' }
    });
    const res = await leadHandler(req);
    const data = await res.json();
    expect(res.status).toBe(400);
    expect(data).toHaveProperty('error');
  });
});
