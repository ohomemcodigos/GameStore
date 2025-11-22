import { Request, Response } from "express";
import { ZodError } from "zod";
import { OrderService } from "../services/OrderService"; // Lógica de Negócio e Persistência
import { UserService } from "../services/UserService"; // Usado para verificar a existência do usuário
import { createOrderSchema, payOrderSchema } from "../validators/orderValidator"; // Validação de entrada


/* -- Rotas de Pedidos/Carrinho e Pagamento -- */

// POST
// Cria um novo Pedido/Carrinho
export const createOrder = async (req: Request, res: Response) => {
    try {
        // Validação dos dados de entrada
        const validatedData = createOrderSchema.parse(req.body); 
        const { userId, items } = validatedData;

        // Verifica se o usuário existe
        const userExists = await UserService.findById(userId);
        if (!userExists) {
            return res.status(404).json({ error: "Usuário não encontrado." });
        }

        // Chamada ao Service para calcular o total e criar o pedido (PENDING)
        const newOrder = await OrderService.createOrder({ userId, items });

        res.status(201).json({ 
            message: "Pedido criado com sucesso. Aguardando pagamento.", 
            order: newOrder 
        });

    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ error: "Dados inválidos.", details: error.issues });
        }
        // Captura erros lançados pelo Service
        if (error instanceof Error) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Erro interno ao criar o pedido." });
    }
};

// POST
// Processa o Pagamento de um Pedido
export const payOrder = async (req: Request, res: Response) => {
    try {
        const orderId = parseInt(req.params.orderId);
        
        // Validação dos dados de pagamento
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
                gatewayResponse: result.gatewayMessage,
            });
        } else {
            // Se o Service lançar status 'FAILED', retorna 400 Bad Request
            return res.status(400).json({ // Falha...
                error: result.gatewayMessage,
                orderStatus: result.updatedOrder.status,
            });
        }

    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ error: "Dados inválidos.", details: error.issues }); // Falha...
        }
        // Captura erros lançados pelo Service
        if (error instanceof Error) {
            if (error.message.includes("Pedido não encontrado")) {
                 return res.status(404).json({ error: error.message }); // Falha...
            }
            return res.status(400).json({ error: error.message });// Falha...
        }
        res.status(500).json({ error: "Erro interno ao processar o pagamento." }); // Falha...
    }
};

// GET
// Lista o Histórico de Pedidos de um Usuário
export const getUserOrders = async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);

        if (isNaN(userId)) {
             return res.status(400).json({ error: "O ID do usuário deve ser um número válido." }); // Falha...
        }

        // 1. Verifica se o usuário existe
        const userExists = await UserService.findById(userId);
        if (!userExists) {
            return res.status(404).json({ error: "Usuário não encontrado." }); // Falha...
        }

        // 2. Chamada ao Service para buscar os pedidos
        const orders = await OrderService.getUserOrders(userId);

        res.status(200).json(orders); // Sucesso!

    } catch (error) {
        res.status(500).json({ error: "Erro ao buscar histórico de pedidos." }); // Falha...
    }
};