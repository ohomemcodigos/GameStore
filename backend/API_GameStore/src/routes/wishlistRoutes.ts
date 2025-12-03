import { Router } from 'express';
import { wishlistController } from '../controllers/wishlistController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Wishlist
 *     description: Gerenciamento da Lista de Desejos
 */

router.use(authMiddleware);

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     summary: Adiciona ou remove um jogo da lista de desejos (Toggle)
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gameId:
 *                 type: integer
 *                 description: ID do jogo a ser alternado
 *     responses:
 *       200:
 *         description: Sucesso (retorna se foi adicionado ou removido)
 */
router.post('/', wishlistController.toggle);

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     summary: Retorna todos os jogos na lista de desejos do usuário logado
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de jogos favoritos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Wishlist'
 */
router.get('/', wishlistController.getMyWishlist);

/**
 * @swagger
 * /api/wishlist/check/{gameId}:
 *   get:
 *     summary: Verifica se um jogo específico está na lista de desejos
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retorna booleano indicando status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inWishlist:
 *                   type: boolean
 */
router.get('/check/:gameId', wishlistController.checkStatus);

export default router;
