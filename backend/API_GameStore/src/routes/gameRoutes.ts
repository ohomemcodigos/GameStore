import { Router } from 'express';
import {
  getAllGames,
  getGamesById,
  createGame,
  updateGame,
  deleteGame,
} from '../controllers/gameController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: API para gerenciamento de jogos
 */

/**
 * @swagger
 * /api/games:
 *   get:
 *     summary: Retorna a lista de todos os jogos
 *     tags: [Games]
 *     responses:
 *       200:
 *         description: Lista de jogos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 */
router.get('/', getAllGames);

/**
 * @swagger
 * /api/games/{id}:
 *   get:
 *     summary: Retorna um jogo específico pelo seu ID
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do jogo
 *     responses:
 *       200:
 *         description: Jogo encontrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Jogo não encontrado
 */
router.get('/:id', getGamesById);

/**
 * @swagger
 * /api/games:
 *   post:
 *     summary: Cria um novo jogo
 *     tags: [Games]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       201:
 *         description: Jogo criado com sucesso
 *       500:
 *         description: Erro ao criar o jogo
 */
router.post('/', createGame);

/**
 * @swagger
 * /api/games/{id}:
 *   put:
 *     summary: Atualiza um jogo existente pelo ID
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do jogo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       200:
 *         description: Jogo atualizado com sucesso
 *       404:
 *         description: Jogo não encontrado
 */
router.put('/:id', updateGame);

/**
 * @swagger
 * /api/games/{id}:
 *   delete:
 *     summary: Deleta um jogo pelo ID
 *     tags: [Games]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do jogo
 *     responses:
 *       204:
 *         description: Jogo deletado com sucesso
 *       404:
 *         description: Jogo não encontrado
 */
router.delete('/:id', deleteGame);

export default router;