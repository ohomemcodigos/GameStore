import { Router } from 'express';
import { createReview, getReviews } from '../controllers/reviewController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Reviews
 *     description: Avaliações e comentários dos jogos
 */

/**
 * @swagger
 * /api/reviews/games/{gameId}:
 *   get:
 *     summary: Lista todas as avaliações de um jogo
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   rating:
 *                     type: integer
 *                   comment:
 *                     type: string
 *                   user:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/games/:gameId', getReviews);

/**
 * @swagger
 * /api/reviews/games/{gameId}:
 *   post:
 *     summary: Cria uma avaliação para um jogo
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReviewInput'
 *     responses:
 *       201:
 *         description: Avaliação criada
 *       400:
 *         description: Dados inválidos
 */
router.post('/games/:gameId', authMiddleware, createReview);

export default router;