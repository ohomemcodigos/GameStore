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
    // Se o usuário já existe, atualiza a senha para a nova hash
    update: {
      password: testUserPassword,
      role: 'ADMIN',
    },
    create: {
      email: 'teste@game.com',
      name: 'Guilherme Teste',
      password: testUserPassword,
      role: 'ADMIN', // ADMIN role para o usuário de teste
    },
  });
  console.log(`Usuário de teste criado com ID: ${user.id}`);

await prisma.game.upsert({
    where: { title: 'Pokémon Legends: Z-A' },
    update: {coverUrl: 'https://i.imgur.com/92EOcaG.png',},
    create: {
      title: 'Pokémon Legends: Z-A',
      slug: 'pokemon-legends-za', 
      description: 'Explore a espetacular cidade de Lumiose na região de Kalos nesse novo jogo da franquia Pokémon.',
      genre: ['RPG', 'Aventura'],
      ageRating: 'L',
      platforms: ['Nintendo Switch', 'Nintendo Switch 2'],
      developer: ['Game Freak'],
      publisher: ['Nintendo', 'The Pokémon Company'],
      releaseDate: new Date('2025-10-16'),
      price: new Decimal(259.90),
      coverUrl: 'https://i.imgur.com/92EOcaG.png',
      isFeatured: true
    },
  })

await prisma.game.upsert({
    where: { title: 'The Witcher 3' },
    update: {coverUrl: 'https://i.imgur.com/oa5rkS8.png',},
    create: {
      title: 'The Witcher 3',
      slug: 'the-witcher-3-wild-hunt', 
      description: 'Um RPG de mundo aberto incrível.',
      genre: ['RPG', 'Aventura', 'Fantasia'],
      ageRating: '16',
      platforms: ['PC', 'PS5', 'Xbox Series'],
      developer: ['CD Projekt Red'],
      publisher: ['CD Projekt'],
      releaseDate: new Date('2015-05-19'),
      price: new Decimal(59.90),
      coverUrl: 'https://i.imgur.com/oa5rkS8.png',
      isFeatured: true
    },
  })

  await prisma.game.upsert({
    where: { title: 'Cyberpunk 2077' },
    update: {coverUrl: 'https://i.imgur.com/d7wbV31.png',},
    create: {
      title: 'Cyberpunk 2077',
      slug: 'cyberpunk-2077',
      description: 'Futuro distópico e muita ação.',
      genre: ['Ação', 'RPG', 'Sci-Fi'],
      ageRating: '18',
      platforms: ['PC', 'PS5', 'Xbox Series'],
      developer: ['CD Projekt Red'],
      publisher: ['CD Projekt'],
      releaseDate: new Date('2020-12-10'),
      price: new Decimal(199.90),
      discountPrice: new Decimal(99.90),
      coverUrl: 'https://i.imgur.com/d7wbV31.png',
      isFeatured: false
    },
  })

  console.log('Seed executada com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })