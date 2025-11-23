// Importando
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerOptions } from '../config/swaggerOptions'; //Configuração do Swagger

// Importação das Rotas
import gameRoutes from './routes/gameRoutes';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';

// Inicialização do app e do Prisma
const app = express();
const port = process.env.PORT || 3000;
export const prisma = new PrismaClient();

// Middlewares
app.use(cors());
app.use(express.json()); // Middleware para interpretar JSON

// --- Configuração do Swagger ---
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.get('/', (req, res) => {
  res.send('API da Loja de Jogos está no ar!');
});


app.use('/api/games', gameRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor ligou! Ele está rodando em http://localhost:${port}`);
  console.log(`Verifique a Documentação via Swagger por aqui: http://localhost:${port}/api-docs/`)
});