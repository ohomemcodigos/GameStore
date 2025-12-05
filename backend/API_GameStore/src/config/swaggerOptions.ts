// src/config/swaggerOptions.ts
import { Options } from 'swagger-jsdoc';

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Bizarre GameStore',
      version: '1.1.0',
      description: 'Documentação da API para o E-commerce de Jogos',
    },
    servers: [
      {
        url: process.env.RENDER_EXTERNAL_URL || 'http://localhost:3000',
        description: 'Servidor Principal',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // --- SCHEMA: GAME MEDIA ---
        GameMedia: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            type: { type: 'string', enum: ['IMAGE', 'VIDEO'] },
            url: { type: 'string' }
          }
        },
        // --- SCHEMA: GAME ---
        Game: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            discountPrice: { type: 'number', nullable: true },
            genre: { type: 'array', items: { type: 'string' } },
            platforms: { type: 'array', items: { type: 'string' } },
            developer: { type: 'array', items: { type: 'string' } },
            publisher: { type: 'array', items: { type: 'string' } },
            releaseDate: { type: 'string', format: 'date-time' },
            ageRating: { type: 'string' },
            coverUrl: { type: 'string' },
            isFeatured: { type: 'boolean' },
            // AQUI ESTÁ A MUDANÇA PRINCIPAL:
            gallery: { 
              type: 'array',
              items: { $ref: '#/components/schemas/GameMedia' }
            }
          },
        },
        // --- SCHEMA: GAME INPUT (Criação/Edição) ---
        GameInput: {
          type: 'object',
          required: ['title', 'price', 'releaseDate'],
          properties: {
            title: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            genre: { type: 'array', items: { type: 'string' } },
            platforms: { type: 'array', items: { type: 'string' } },
            developer: { type: 'array', items: { type: 'string' } },
            publisher: { type: 'array', items: { type: 'string' } },
            releaseDate: { type: 'string', format: 'date' },
            ageRating: { type: 'string' },
            coverUrl: { type: 'string' },
            isFeatured: { type: 'boolean' },
            // Aceita array de mídias na criação
            gallery: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: { type: 'string', enum: ['IMAGE', 'VIDEO'] },
                  url: { type: 'string' }
                }
              }
            }
          },
        },
        // --- OUTROS SCHEMAS (USER, ORDER, ETC) ---
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' },
            email: { type: 'string' },
            nickname: { type: 'string' },
            avatarUrl: { type: 'string' },
            role: { type: 'string', enum: ['USER', 'ADMIN'] },
          },
        },
        LoginInput: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string' },
            password: { type: 'string' },
          },
        },
        RegisterInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string' },
            email: { type: 'string' },
            password: { type: 'string' },
            nickname: { type: 'string' },
          },
        },
        CreateOrderInput: {
          type: 'object',
          required: ['items'],
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  gameId: { type: 'integer' },
                  quantity: { type: 'integer' }
                }
              }
            }
          }
        },
        Wishlist: {
            type: 'object',
            properties: {
                id: { type: 'integer' },
                gameId: { type: 'integer' },
                userId: { type: 'integer' },
                game: { $ref: '#/components/schemas/Game' }
            }
        },
        ReviewInput: {
            type: 'object',
            required: ['rating'],
            properties: {
                rating: { type: 'integer', minimum: 1, maximum: 5 },
                comment: { type: 'string' }
            }
        }
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};