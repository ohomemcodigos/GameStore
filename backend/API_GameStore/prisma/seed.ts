// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  console.log('Iniciando o Seeding do banco de dados...');

    // Usuário de teste
  const testUserPassword = await bcrypt.hash('senha123', SALT_ROUNDS);
  const user = await prisma.user.upsert({
    where: { email: 'teste@game.com' },
    update: {}, // Não faz nada se já existir
    create: {
      email: 'teste@game.com',
      name: 'Guilherme Teste',
      password: testUserPassword,
    },
  });
  console.log(`Usuário de teste criado com ID: ${user.id}`);

  // 2. CRIAR JOGO DE TESTE
  const game = await prisma.game.upsert({
    where: { title: 'Pokémon Legends: Z-A' },
    update: {},
    create: {
      title: 'Pokémon Legends: Z-A',
      description: 'Explore a espetacular cidade de Lumiose na região de Kalos nesse novo jogo da franquia Pokémon.',
      genre: 'RPG',
      price: new Decimal(29.99),
    },
  });
  console.log(`Jogo de teste criado com ID: ${game.id}`);

  // CRIANDO AS KEYS DE JOGO (Estoque Digital)
  // Criaremos 4 chaves para simular o estoque
  const licenseKeysData = [
    { gameId: game.id, keyString: 'AAAA-1111-BBBB-2222-XXXX' },
    { gameId: game.id, keyString: 'CCCC-3333-DDDD-4444-YYYY' },
    { gameId: game.id, keyString: 'EEEE-5555-FFFF-6666-ZZZZ' },
    { gameId: game.id, keyString: 'GGGG-7777-HHHH-8888-QQQQ' },
  ];

  await prisma.licenseKey.createMany({
    data: licenseKeysData,
    skipDuplicates: true, // Garante que chaves duplicadas não gerem erro
  });
  console.log(`Criadas ${licenseKeysData.length} chaves de licença para o jogo.`);
}

main() // Verifica se tudo ocorreu bem
  .catch((e) => {
    console.error('Erro durante o Seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });