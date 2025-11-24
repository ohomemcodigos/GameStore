import { Router } from 'express';
import { gameController } from '../controllers/gameController'; // <--- Importação atualizada
import { authMiddleware } from '../middlewares/authMiddleware'; // <--- Proteção de Login
import { adminMiddleware } from '../middlewares/adminMiddleware'; // <--- Proteção de Admin

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
 */
router.get('/', gameController.getAllGames);

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
 *       404:
 *         description: Jogo não encontrado
 */
router.get('/:id', gameController.getGamesById);



/**
 * @swagger
 * /api/games:
 *   post:
 *     summary: Cria um novo jogo (Requer Admin)
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Game'
 *     responses:
 *       201:
 *         description: Jogo criado com sucesso
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso proibido
 *       500:
 *         description: Erro ao criar o jogo
 */
router.post('/', authMiddleware, adminMiddleware, gameController.create);

/**
 * @swagger
 * /api/games/{id}:
 *   put:
 *     summary: Atualiza um jogo existente pelo ID (Requer Admin)
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *         type: integer
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
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso proibido
 *       404:
 *         description: Jogo não encontrado
 */
router.put('/:id', authMiddleware, adminMiddleware, gameController.update);

/**
 * @swagger
 * /api/games/{id}:
 *   delete:
 *     summary: Deleta um jogo pelo ID (Requer Admin)
 *     tags: [Games]
 *     security:
 *      - bearerAuth: []
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
 *       401:
 *         description: Não autorizado
 *       403:
 *         description: Acesso proibido
 *       404:
 *         description: Jogo não encontrado
 */
router.delete('/:id', authMiddleware, adminMiddleware, gameController.delete);

export default router;