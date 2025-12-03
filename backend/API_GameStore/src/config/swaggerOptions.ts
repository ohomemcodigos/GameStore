export const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Loja de Jogos',
      version: '1.0.0',
      description: 'Documentação da API para a loja de jogos online, feita com Express.js e Prisma.',
    },
    servers: [
      {
        url: 'http://localhost:3000', // A URL base da API
      },
    ],
    // Criando os 'components' para definir schemas reutilizáveis
    components: {
        schemas: {
            Game: {
                type: 'object',
                required: ['title', 'genre', 'price'],
                properties: {
                    id: { type: 'integer', description: 'O ID auto-gerado do jogo' },
                    title: { type: 'string', description: 'O título do jogo' },
                    description: { type: 'string', description: 'Uma breve descrição do jogo' },
                    genre: { type: 'string', description: 'O gênero do jogo' },
                    price: { type: 'number', format: 'float', description: 'O preço do jogo' },
                    createdAt: { type: 'string', format: 'date-time', description: 'Data de criação' },
                    updatedAt: { type: 'string', format: 'date-time', description: 'Última atualização' },
                }
            }
        }
    }
  },
  // O caminho para os arquivos que contêm os comentários de documentação da API
  apis: ['./src/routes/*.ts'], 
};