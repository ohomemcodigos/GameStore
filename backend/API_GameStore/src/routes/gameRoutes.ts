import { Router } from 'express';
import { gameController } from '../controllers/gameController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Games
 *     description: Gerenciamento do catálogo de jogos
 */

/**
 * @swagger
 * /api/games:
 *   get:
 *     summary: Lista todos os jogos
 *     tags:
 *       - Games
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 */
router.get('/', gameController.getAllGames);

/**
 * @swagger
 * /api/games/{id}:
 *   get:
 *     summary: Busca um jogo pelo ID
 *     tags:
 *       - Games
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes do jogo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 *       404:
 *         description: Jogo não encontrado
 */
router.get('/:id', gameController.getGamesById);

/**
 * @swagger
 * /api/games:
 *   post:
 *     summary: Cria um novo jogo (ADMIN)
 *     tags:
 *       - Games
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameInput'
 *     responses:
 *       201:
 *         description: Jogo criado com sucesso
 *       403:
 *         description: Acesso negado (apenas Admin)
 */
router.post('/', authMiddleware, adminMiddleware, gameController.create);

/**
 * @swagger
 * /api/games/{id}:
 *   put:
 *     summary: Atualiza um jogo (ADMIN)
 *     tags:
 *       - Games
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GameInput'
 *     responses:
 *       200:
 *         description: Jogo atualizado
 *       404:
 *         description: Jogo não encontrado
 */
router.put('/:id', authMiddleware, adminMiddleware, gameController.update);

/**
 * @swagger
 * /api/games/{id}:
 *   delete:
 *     summary: Remove um jogo (ADMIN)
 *     tags:
 *       - Games
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Jogo removido
 */
router.delete('/:id', authMiddleware, adminMiddleware, gameController.delete);

export default router;
