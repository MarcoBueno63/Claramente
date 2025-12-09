// tests/psychologists.test.ts
import psychologistsHandler from './bootstrap/psychologistsHandler';
import prismaMock from './__mocks__/prismaClient';

jest.mock('@prisma/client', () => {
  const prismaMock = require('./__mocks__/prismaClient').default;
  return { PrismaClient: jest.fn(() => prismaMock) };
});

describe('API - Psicólogos', () => {
  it('deve listar psicólogos', async () => {
    prismaMock.psychologist.findMany.mockResolvedValue([
      { id: 'ps1', name: 'Dra. Clara' },
      { id: 'ps2', name: 'Dr. Marco' }
    ]);
    const res = await psychologistsHandler();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data[0].name).toBe('Dra. Clara');
  });
});
