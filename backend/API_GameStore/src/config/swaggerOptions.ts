import { Options } from 'swagger-jsdoc';

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Game Store API',
      version: '1.0.0',
      description: 'API de loja de jogos digitais',
    },

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },

      schemas: {
        // =====================
        // GAME (resposta)
        // =====================
        Game: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string', nullable: true },
            genre: {
              type: 'array',
              items: { type: 'string' },
            },
            ageRating: { type: 'string', example: 'L' },
            platforms: {
              type: 'array',
              items: { type: 'string' },
            },
            developer: {
              type: 'array',
              items: { type: 'string' },
            },
            publisher: {
              type: 'array',
              items: { type: 'string' },
            },
            releaseDate: {
              type: 'string',
              format: 'date-time',
            },
            price: { type: 'number', format: 'float' },
            discountPrice: {
              type: 'number',
              format: 'float',
              nullable: true,
            },
            coverUrl: { type: 'string', nullable: true },
            isFeatured: { type: 'boolean' },
            systemRequirements: {
              type: 'object',
              nullable: true,
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },

        // =====================
        // GAME INPUT (POST / PUT)
        // =====================
        GameInput: {
          type: 'object',
          required: [
            'title',
            'slug',
            'genre',
            'developer',
            'publisher',
            'releaseDate',
            'price',
          ],
          properties: {
            title: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            genre: {
              type: 'array',
              items: { type: 'string' },
            },
            ageRating: { type: 'string', example: 'L' },
            platforms: {
              type: 'array',
              items: { type: 'string' },
            },
            developer: {
              type: 'array',
              items: { type: 'string' },
            },
            publisher: {
              type: 'array',
              items: { type: 'string' },
            },
            releaseDate: {
              type: 'string',
              format: 'date-time',
            },
            price: { type: 'number', format: 'float' },
            discountPrice: { type: 'number', format: 'float' },
            coverUrl: { type: 'string' },
            isFeatured: { type: 'boolean' },
            systemRequirements: { type: 'object' },
          },
        },
      },
    },

    security: [{ bearerAuth: [] }],
  },

  apis: ['src/routes/*.ts'], // ⚠️ CONFERE ESSE PATH
};
