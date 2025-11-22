import { Router } from 'express';
import {
    createOrder,
    payOrder,
    getUserOrders,
} from '../controllers/orderController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gerenciamento de Carrinho de Compras, Pedidos e Transações
 */


/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Cria um novo pedido (carrinho) e calcula o total.
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderInput'
 *     responses:
 *       201:
 *         description: Pedido criado com status PENDING.
 *       400:
 *         description: Dados inválidos ou estoque insuficiente.
 */
router.post('/', createOrder);

/**
 * @swagger
 * /api/orders/{orderId}/pay:
 *   post:
 *     summary: Processa o pagamento de um pedido pendente (simulação).
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do pedido a ser pago.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PayOrderInput'
 *     responses:
 *       200:
 *         description: Pagamento Aprovado e chaves atribuídas.
 *       400:
 *         description: Pagamento rejeitado ou pedido já processado.
 *       404:
 *         description: Pedido não encontrado.
 */
router.post('/:orderId/pay', payOrder);

/**
 * @swagger
 * /api/orders/user/{userId}:
 *   get:
 *     summary: Retorna o histórico de pedidos de um usuário específico.
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do usuário.
 *     responses:
 *       200:
 *         description: Lista de pedidos.
 *       404:
 *         description: Usuário não encontrado.
 */
router.get('/user/:userId', getUserOrders);

export default router;
