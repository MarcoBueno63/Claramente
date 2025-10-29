// tests/report.test.ts
import reportHandler from './bootstrap/reportHandler';
import prismaMock from './__mocks__/prismaClient';

jest.mock('@prisma/client', () => {
  const prismaMock = require('./__mocks__/prismaClient').default;
  return { PrismaClient: jest.fn(() => prismaMock) };
});

describe('API - Relatório', () => {
  it('deve retornar lista de usuários e sessões', async () => {
    prismaMock.user.findMany.mockResolvedValue([
      { id: 'user1', sessions: [{ id: 'session1' }] },
      { id: 'user2', sessions: [{ id: 'session2' }] }
    ]);
    const res = await reportHandler();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);
    expect(data[0].id).toBe('user1');
    expect(data[1].id).toBe('user2');
  });
});
