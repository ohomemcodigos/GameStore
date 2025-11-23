import { Request, Response } from "express";
import { ZodError } from "zod";
import { prisma } from "../index";
import { OrderService } from "../services/OrderService"; 
import { UserService } from "../services/UserService"; 
import { payOrderSchema } from "../validators/orderValidator"; 

/* -- Rotas de Pedidos/Carrinho e Pagamento -- */

// POST
// Cria um novo Pedido (Checkout do Carrinho)
export const createOrder = async (req: Request, res: Response) => {
    try {
        // Pega o ID do usuário pelo Token
        const userId = (req as any).user?.id;
        
        // Pega os IDs dos jogos enviados pelo Frontend
        const { gameIds } = req.body;

        if (!userId) {
            return res.status(401).json({ error: "Usuário não autenticado." });
        }

        if (!gameIds || !Array.isArray(gameIds) || gameIds.length === 0) {
            return res.status(400).json({ error: "O carrinho está vazio ou inválido." });
        }

        // Busca os jogos no banco para pegar o preço real
        const gamesToBuy = await prisma.game.findMany({
            where: {
                id: { in: gameIds }
            }
        });

        // Verifica se todos os jogos foram encontrados
        if (gamesToBuy.length !== gameIds.length) {
            return res.status(400).json({ error: "Um ou mais jogos do carrinho não existem." });
        }

        // Calcular o total no Backend
        const total = gamesToBuy.reduce((acc, game) => acc + Number(game.price), 0);

        // Cria o Pedido e os Itens
        const newOrder = await prisma.order.create({
            data: {
                userId: userId,
                total: total,
                status: "PENDING", // Começa em estado pendente
                items: {
                    create: gamesToBuy.map(game => ({
                        gameId: game.id,
                        priceAtPurchase: game.price, // Grava o preço da na hora da compra
                        quantity: 1
                    }))
                }
            },
            include: {
                items: {
                    include: { game: true } // Retorna os detalhes dos jogos na resposta
                }
            }
        });

        // Sucesso!
        res.status(201).json({ 
            message: "Pedido criado com sucesso.", 
            order: newOrder 
        });

    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ error: "Dados inválidos.", details: error.issues }); // Falha...
        }
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message }); // Falha...
        }
        console.error(error);
        res.status(500).json({ error: "Erro interno ao criar o pedido." }); // Falha...
    }
};

// POST
// Processa um Pedido
export const payOrder = async (req: Request, res: Response) => {
    try {
        const orderId = parseInt(req.params.orderId);
        const validatedPaymentData = payOrderSchema.parse(req.body);
        const { paymentMethod, cardNumber } = validatedPaymentData; 
        
        if (isNaN(orderId)) {
             return res.status(400).json({ error: "O ID do pedido deve ser um número válido." });
        }

        // Chamada ao Service para processar o pagamento e atualizar o status
        const result = await OrderService.processPayment({ 
            orderId, 
            paymentMethod, 
            cardNumber 
        });

        // Resposta Baseada no Resultado da Transação
        if (result.transaction.status === 'SUCCESS') {
            return res.status(200).json({ // Sucesso!
                message: "Pagamento Aprovado. Sua compra foi confirmada.",
                orderStatus: result.updatedOrder.status,
                transactionId: result.transaction.id,
            });
        } else {
            // Se o Service lançar status 'FAILED', retorna 400 Bad Request
            return res.status(400).json({  // Falha...
                error: result.gatewayMessage,
                orderStatus: result.updatedOrder.status,
            });
        }

    } catch (error) {
        // Captura erros lançados pelo Service
        if (error instanceof ZodError) {
            return res.status(400).json({ error: "Dados inválidos.", details: error.issues }); // Falha...
        }
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message }); // Falha...
        }
        res.status(500).json({ error: "Erro ao processar pagamento." }); // Falha...
    }
};

// GET
// Lista o Histórico de Pedidos de um Usuário
export const getUserOrders = async (req: Request, res: Response) => {
    try {
        // Pega o ID do token, ignorando o que vem na URL
        const userId = (req as any).user?.id; 

        // Busca pedidos direto via Prisma
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: { game: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json(orders); // Sucesso!

    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar histórico de pedidos." }); // Falha...
    }
};