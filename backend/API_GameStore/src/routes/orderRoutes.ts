import { Router } from 'express';
import { orderController } from '../controllers/orderController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Orders
 *     description: Carrinho, Pedidos e Pagamentos
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Cria um novo pedido (Checkout)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderInput'
 *     responses:
 *       201:
 *         description: Pedido criado (Status PENDING)
 */
router.post('/', authMiddleware, orderController.createOrder);

/**
 * @swagger
 * /api/orders/{orderId}/pay:
 *   post:
 *     summary: Simula pagamento de um pedido
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pagamento aprovado, chaves geradas
 */
router.post('/:orderId/pay', authMiddleware, orderController.payOrder);

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Histórico de pedidos do usuário logado
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get('/my-orders', authMiddleware, orderController.getUserOrders);

export default router;
