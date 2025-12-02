import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// Lista de jogos baseada no JSON fornecido
const gamesList = [
  {
    title: "Outer Wilds",
    slug: "outer-wilds",
    description: "Outer Wilds é um jogo eletrônico independente de ação-aventura e exploração em mundo aberto. No jogo, o protagonista se encontra em um sistema solar com apenas 22 minutos para explorá-lo.",
    genre: ["Aventura", "Terror"],
    ageRating: "L",
    platforms: ["PC", "Nintendo Switch"],
    developer: ["Logan ver Hoef"],
    publisher: ["Annapurna Interactive"],
    releaseDate: "2019-01-08T00:00:00.000Z",
    price: 120,
    discountPrice: null,
    coverUrl: "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/store/software/switch/70010000038712/f82902db3c1f0b19b1e00c324aba9509c0f9ebec784bcd249e21cffc39151a4e",
    isFeatured: false
  },
  {
    title: "The Witcher 3",
    slug: "the-witcher-3",
    description: "Um RPG de mundo aberto incrível.",
    genre: ["RPG", "Aventura", "Fantasia"],
    ageRating: "16",
    platforms: ["PC", "PS5", "Xbox Series"],
    developer: ["CD Projekt Red"],
    publisher: ["CD Projekt"],
    releaseDate: "2015-05-19T00:00:00.000Z",
    price: 59.9,
    discountPrice: null,
    coverUrl: "https://cdn1.epicgames.com/offer/14ee004dadc142faaaece5a6270fb628/EGS_TheWitcher3WildHuntCompleteEdition_CDPROJEKTRED_S1_2560x1440-82eb5cf8f725e329d3194920c0c0b64f",
    isFeatured: false
  },
  {
    title: "Cyberpunk 2077",
    slug: "cyberpunk-2077",
    description: "Futuro distópico e muita ação.",
    genre: ["Ação", "RPG", "Sci-Fi"],
    ageRating: "18",
    platforms: ["PC", "PS5", "Xbox Series"],
    developer: ["CD Projekt Red"],
    publisher: ["CD Projekt"],
    releaseDate: "2020-12-10T00:00:00.000Z",
    price: 199.9,
    discountPrice: 99.9,
    coverUrl: "https://cdn1.epicgames.com/offer/77f2b98e2cef40c8a7437518bf420e47/EGS_Cyberpunk2077_CDPROJEKTRED_S1_03_2560x1440-359e77d3cd0a40aebf3bbc130d14c5c7?resize=1&w=480&h=270&quality=medium",
    isFeatured: false
  },
  {
    title: "Pokémon Legends: Z-A",
    slug: "pokemon-legends-za",
    description: "Explore a espetacular cidade de Lumiose na região de Kalos nesse novo jogo da franquia Pokémon.",
    genre: ["RPG", "Aventura"],
    ageRating: "L",
    platforms: ["Nintendo Switch", "Nintendo Switch 2"],
    developer: ["Game Freak"],
    publisher: ["Nintendo", "The Pokémon Company"],
    releaseDate: "2025-10-16T00:00:00.000Z",
    price: 259.9,
    discountPrice: null,
    coverUrl: "https://i.ytimg.com/vi/wCqS7jd17ms/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBrZHpjz0lkt2EhGLr64YXN-SeTFw",
    isFeatured: true
  },
  {
    title: "God of War Ragnarök",
    slug: "god-of-war-ragnarok",
    description: "Kratos e Atreus devem viajar pelos Nove Reinos em busca de respostas.",
    genre: ["Ação", "Aventura"],
    ageRating: "L",
    platforms: ["PS5", "PS4"],
    developer: ["Santa Monica Studio"],
    publisher: ["PlayStation PC LLC"],
    releaseDate: "2022-11-09T00:00:00.000Z",
    price: 299.9,
    discountPrice: null,
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202207/1210/4xJ8XB3bi888QTLZYdl7Oi0s.png",
    isFeatured: false
  },
  {
    title: "Hollow Knight",
    slug: "hollow-knight",
    description: "Uma aventura de ação clássica em 2D por um vasto mundo interligado.",
    genre: ["Metroidvania", "Indie"],
    ageRating: "L",
    platforms: ["PC", "Switch", "PS4"],
    developer: ["Team Cherry"],
    publisher: ["Team Cherry"],
    releaseDate: "2017-02-24T00:00:00.000Z",
    price: 46.99,
    discountPrice: null,
    coverUrl: "https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/367520/capsule_616x353.jpg?t=1695270428",
    isFeatured: false
  },
  {
    title: "Red Dead Redemption 2",
    slug: "red-dead-redemption-2",
    description: "Arthur Morgan e a gangue Van der Linde tentam sobreviver no fim do velho oeste.",
    genre: ["Ação", "Aventura"],
    ageRating: "L",
    platforms: ["PC", "PS4", "Xbox"],
    developer: ["Rockstar Games"],
    publisher: ["Rockstar Games"],
    releaseDate: "2018-10-26T00:00:00.000Z",
    price: 249,
    discountPrice: null,
    coverUrl: "https://cdn1.epicgames.com/b30b6d1b4dfd4dcc93b5490be5e094e5/offer/RDR2476298253_Epic_Games_Wishlist_RDR2_2560x1440_V01-2560x1440-2a9ebe1f7ee202102555be202d5632ec.jpg",
    isFeatured: false
  },
  {
    title: "Elden Ring",
    slug: "elden-ring",
    description: "Um RPG de ação em um mundo vasto criado por Hidetaka Miyazaki e George R. R. Martin.",
    genre: ["RPG", "Ação"],
    ageRating: "L",
    platforms: ["PC", "PS5", "Xbox"],
    developer: ["FromSoftware"],
    publisher: ["Bandai Namco"],
    releaseDate: "2022-02-25T00:00:00.000Z",
    price: 229.9,
    discountPrice: null,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1245620/capsule_616x353.jpg?t=1748630546",
    isFeatured: false
  },
  {
    title: "The Last of Us Part I",
    slug: "the-last-of-us-part-i",
    description: "Em uma civilização devastada, Joel é contratado para tirar Ellie de uma zona de quarentena militar.",
    genre: ["Ação", "Aventura", "Terror"],
    ageRating: "L",
    platforms: ["PC", "PS5"],
    developer: ["Naughty Dog"],
    publisher: ["Sony Interactive Entertainment"],
    releaseDate: "2022-09-02T00:00:00.000Z",
    price: 299.9,
    discountPrice: null,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1888930/capsule_616x353.jpg?t=1750959031",
    isFeatured: false
  },
  {
    title: "Resident Evil 4 Remake",
    slug: "resident-evil-4-remake",
    description: "A sobrevivência é apenas o começo. Seis anos se passaram desde o desastre biológico em Raccoon City.",
    genre: ["Terror", "Ação", "Sobrevivência"],
    ageRating: "L",
    platforms: ["PC", "PS5", "PS4", "Xbox Series"],
    developer: ["Capcom"],
    publisher: ["Capcom"],
    releaseDate: "2023-03-24T00:00:00.000Z",
    price: 249,
    discountPrice: null,
    coverUrl: "https://img.odcdn.com.br/wp-content/uploads/2023/08/resident-evil-4-remake-capa-poster.jpg",
    isFeatured: false
  },
  {
    title: "Minecraft",
    slug: "minecraft",
    description: "Prepare-se para uma aventura de possibilidades ilimitadas enquanto você constrói, minera, combate criaturas e explora.",
    genre: ["Sobrevivência", "Sandbox", "Aventura"],
    ageRating: "L",
    platforms: ["PC", "Switch", "PS4", "Xbox"],
    developer: ["Mojang Studios"],
    publisher: ["Xbox Game Studios"],
    releaseDate: "2011-11-18T00:00:00.000Z",
    price: 149,
    discountPrice: null,
    coverUrl: "https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/store/software/switch/70010000000964/a28a81253e919298beab2295e39a56b7a5140ef15abdb56135655e5c221b2a3a",
    isFeatured: false
  },
  {
    title: "EA SPORTS FC 24",
    slug: "ea-sports-fc-24",
    description: "Sinta o jogo de perto com as tecnologias mais avançadas que proporcionam um realismo inigualável em cada partida.",
    genre: ["Esportes", "Simulação"],
    ageRating: "L",
    platforms: ["PC", "PS5", "PS4", "Xbox", "Switch"],
    developer: ["EA Canada"],
    publisher: ["Electronic Arts"],
    releaseDate: "2023-09-29T00:00:00.000Z",
    price: 359,
    discountPrice: null,
    coverUrl: "https://image.api.playstation.com/vulcan/ap/rnd/202406/1122/bdc404f202503fe8a6046e26fa38626bd2f893e517ad0997.png",
    isFeatured: false
  },
  {
    title: "Grand Theft Auto V",
    slug: "grand-theft-auto-v",
    description: "Um malandro de rua, um ladrão de bancos aposentado e um psicopata aterrorizante se envolvem com o submundo do crime.",
    genre: ["Ação", "Mundo Aberto"],
    ageRating: "L",
    platforms: ["PC", "PS5", "Xbox Series", "PS4"],
    developer: ["Rockstar North"],
    publisher: ["Rockstar Games"],
    releaseDate: "2013-09-17T00:00:00.000Z",
    price: 159.9,
    discountPrice: null,
    coverUrl: "https://ogimg.infoglobo.com.br/in/9991682-12c-b99/FT1086A/760/GTA-V-big.jpg",
    isFeatured: false
  },
  {
    title: "Marvel's Spider-Man 2",
    slug: "marvels-spider-man-2",
    description: "Os Spiders Peter Parker e Miles Morales retornam para uma nova e emocionante aventura.",
    genre: ["Ação", "Aventura", "Super-herói"],
    ageRating: "L",
    platforms: ["PS5"],
    developer: ["Insomniac Games"],
    publisher: ["Sony Interactive Entertainment"],
    releaseDate: "2023-10-20T00:00:00.000Z",
    price: 349.9,
    discountPrice: null,
    coverUrl: "https://gmedia.playstation.com/is/image/SIEPDC/spider-man-2-keyart-01-en-7june24?$facebook$",
    isFeatured: false
  },
  {
    title: "Sekiro: Shadows Die Twice",
    slug: "sekiro-shadows-die-twice",
    description: "Trilhe seu próprio caminho de vingança nessa aventura premiada da FromSoftware.",
    genre: ["Ação", "Aventura", "Souls-like"],
    ageRating: "L",
    platforms: ["PC", "PS4", "Xbox One"],
    developer: ["FromSoftware"],
    publisher: ["Activision"],
    releaseDate: "2019-03-22T00:00:00.000Z",
    price: 199.9,
    discountPrice: null,
    coverUrl: "https://i.ytimg.com/vi/XA74YQB7X-0/maxresdefault.jpg",
    isFeatured: false
  },
  {
    title: "Forza Horizon 5",
    slug: "forza-horizon-5",
    description: "Sua maior aventura Horizon te espera! Explore as paisagens vibrantes e em constante evolução do mundo aberto no México.",
    genre: ["Corrida", "Esportes", "Mundo Aberto"],
    ageRating: "L",
    platforms: ["PC", "Xbox Series", "Xbox One"],
    developer: ["Playground Games"],
    publisher: ["Xbox Game Studios"],
    releaseDate: "2021-11-09T00:00:00.000Z",
    price: 249,
    discountPrice: null,
    coverUrl: "https://www.global-esports.news/wp-content/uploads/2025/02/forza-horizon-5-ps5-3.png",
    isFeatured: false
  },
  {
    title: "Stardew Valley",
    slug: "stardew-valley",
    description: "Você herdou a antiga fazenda do seu avô em Stardew Valley.",
    genre: ["Simulação", "RPG", "Indie"],
    ageRating: "L",
    platforms: ["PC", "Switch", "PS4", "Xbox", "Mobile"],
    developer: ["ConcernedApe"],
    publisher: ["ConcernedApe"],
    releaseDate: "2016-02-26T00:00:00.000Z",
    price: 24.99,
    discountPrice: null,
    coverUrl: "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/413150/capsule_616x353.jpg?t=1754692865",
    isFeatured: false
  },
  {
    title: "DOOM Eternal",
    slug: "doom-eternal",
    description: "Os exércitos do inferno invadiram a Terra. Torne-se o Slayer em uma campanha épica.",
    genre: ["FPS", "Ação", "Terror"],
    ageRating: "L",
    platforms: ["PC", "PS5", "PS4", "Xbox", "Switch"],
    developer: ["id Software"],
    publisher: ["Bethesda Softworks"],
    releaseDate: "2020-03-20T00:00:00.000Z",
    price: 149,
    discountPrice: null,
    coverUrl: "https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_1.5/c_scale,w_400/store/software/switch/70070000011025/09fde58766118f7aec9f6ff30f3a8d6e7ba37ace336e79097643431c911d99c1",
    isFeatured: false
  },
  {
    title: "The Legend of Zelda: Breath of the Wild",
    slug: "the-legend-of-zelda-breath-of-the-wild",
    description: "Esqueça tudo o que você sabe sobre os jogos da série The Legend of Zelda.",
    genre: ["Aventura", "Ação", "RPG"],
    ageRating: "L",
    platforms: ["Switch", "Wii U"],
    developer: ["Nintendo EPD"],
    publisher: ["Nintendo"],
    releaseDate: "2017-03-03T00:00:00.000Z",
    price: 299,
    discountPrice: null,
    coverUrl: "https://www.nintendo.com/eu/media/images/10_share_images/games_15/wiiu_14/SI_WiiU_TheLegendOfZeldaBreathOfTheWild_image1600w.jpg",
    isFeatured: false
  },
  {
    title: "Baldur's Gate 3",
    slug: "baldurs-gate-3",
    description: "Reúna seu grupo e volte aos Reinos Esquecidos em uma história de amizade, traição e o atrativo do poder absoluto.",
    genre: ["RPG", "Estratégia", "Aventura"],
    ageRating: "L",
    platforms: ["PC", "PS5", "Xbox Series"],
    developer: ["Larian Studios"],
    publisher: ["Larian Studios"],
    releaseDate: "2023-08-03T00:00:00.000Z",
    price: 199.9,
    discountPrice: null,
    coverUrl: "https://cdn.awsli.com.br/2500x2500/2391/2391623/produto/232708794/baldur-s-gate-3-ps5-c-digo-digital-a6ac8djm3p.png",
    isFeatured: false
  }
];

async function main() {
  console.log('Iniciando o Seeding do banco de dados...');

  // 1. Criação do Usuário
  const testUserPassword = await bcrypt.hash('senha123', SALT_ROUNDS);
  const user = await prisma.user.upsert({
    where: { email: 'teste@game.com' },
    update: {
      password: testUserPassword,
      role: 'ADMIN',
    },
    create: {
      email: 'teste@game.com',
      name: 'Guilherme Teste',
      password: testUserPassword,
      role: 'ADMIN',
    },
  });
  console.log(`Usuário de teste criado com ID: ${user.id}`);

  // 2. Loop para criar/atualizar todos os jogos
  console.log('Criando/Atualizando jogos...');
  
  for (const game of gamesList) {
    await prisma.game.upsert({
      where: { title: game.title }, // Usa o título como chave única
      update: {
        // Se o jogo já existe, atualizamos os dados para garantir que está tudo novo
        coverUrl: game.coverUrl,
        price: new Decimal(game.price),
        discountPrice: game.discountPrice ? new Decimal(game.discountPrice) : null,
        description: game.description,
        isFeatured: game.isFeatured,
      },
      create: {
        title: game.title,
        slug: game.slug,
        description: game.description,
        genre: game.genre,
        ageRating: game.ageRating,
        platforms: game.platforms,
        developer: game.developer,
        publisher: game.publisher,
        releaseDate: new Date(game.releaseDate), // Converte string para Date
        price: new Decimal(game.price),          // Converte number para Decimal
        discountPrice: game.discountPrice ? new Decimal(game.discountPrice) : null,
        coverUrl: game.coverUrl,
        isFeatured: game.isFeatured,
      },
    });
    console.log(`Jogo processado: ${game.title}`);
  }

  console.log('Seed executada com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });