import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Cria um psicólogo de teste se não existir
  const exists = await prisma.psychologist.findFirst({
    where: { name: 'Dra. Teste Cypress' }
  });
  if (!exists) {
    await prisma.psychologist.create({
      data: {
        name: 'Dra. Teste Cypress',
        crp: '12345/AB',
        specialty: 'TCC',
        approach: 'Cognitivo-Comportamental',
        gender: 'Feminino',
        location: 'Online',
        price: 120,
        whatsapp: '11999999999',
        rating: 5,
        experience: 8
      }
    });
    console.log('Psicólogo de teste criado!');
  } else {
    console.log('Psicólogo de teste já existe.');
  }
}

main().finally(() => prisma.$disconnect());
