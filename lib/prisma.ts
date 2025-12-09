// 🚀 PRISMA REMOVIDO PARA OTIMIZAÇÃO
// Mock do Prisma para compatibilidade de builds existentes

export const prisma = {
  user: {
    findUnique: () => null,
    create: () => null,
    update: () => null,
  },
  session: {
    findMany: () => [],
    create: () => null,
  }
};