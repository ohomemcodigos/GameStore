import { Router } from 'express';
import { 
  createPurchase, 
  getPurchaseById,
  getUserPurchases,
  updatePurchase,
  deletePurchase 
} from '../controllers/purchaseController';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Purchases
 *     description: API para gerenciamento de compras
 */

/**
 * @swagger
 * /api/purchases:
 *   post:
 *     summary: Registra uma nova compra
 *     tags: [Purchases]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - gameId
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: ID do usuário que está comprando
 *               gameId:
 *                 type: integer
 *                 description: ID do jogo que está sendo comprado
 *     responses:
 *       201:
 *         description: Compra registrada com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Usuário ou Jogo não encontrado
 */
router.post('/', createPurchase);

/**
 * @swagger
 * /api/purchases/{id}:
 *   get:
 *     summary: Retorna uma compra específica pelo seu ID
 *     tags: [Purchases]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID da compra
 *     responses:
 *       200:
 *         description: Compra encontrada com sucesso
 *       404:
 *         description: Compra não encontrada
 */
router.get('/:id', getPurchaseById);

/**
 * @swagger
 * /api/purchases/user/{userId}:
 *   get:
 *     summary: Retorna o histórico de compras de um usuário
 *     tags: [Purchases]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID do usuário
 *     responses:
 *       200:
 *         description: Histórico de compras retornado com sucesso
 */
router.get('/user/:userId', getUserPurchases);

/**
 * @swagger
 * /api/purchases/{id}:
 *   put:
 *     summary: Atualiza uma compra pelo ID
 *     tags: [Purchases]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID da compra
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               gameId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Compra atualizada com sucesso
 *       404:
 *         description: Compra não encontrada
 */
router.put('/:id', updatePurchase);

/**
 * @swagger
 * /api/purchases/{id}:
 *   delete:
 *     summary: Deleta uma compra pelo ID
 *     tags: [Purchases]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: O ID da compra
 *     responses:
 *       204:
 *         description: Compra deletada com sucesso
 *       404:
 *         description: Compra não encontrada
 */
router.delete('/:id', deletePurchase);

export default router;