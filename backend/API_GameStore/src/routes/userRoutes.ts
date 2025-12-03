import { Router } from 'express';
import { userController } from '../controllers/userController';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Autenticação e gestão de usuários
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registra novo usuário
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: Usuário criado
 *       409:
 *         description: Email ou Nickname já em uso
 */
router.post('/register', userController.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Autenticação
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login realizado, retorna token
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Dados públicos de um usuário
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Dados do usuário
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/:id', userController.getById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Atualiza perfil do usuário
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Atualizado com sucesso
 */
router.put('/:id', userController.update);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Remove um usuário
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Deletado com sucesso
 */
router.delete('/:id', userController.delete);

export default router;
