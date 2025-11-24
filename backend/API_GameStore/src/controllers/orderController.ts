import { Request, Response } from "express";
import { ZodError } from "zod";
import { OrderService } from "../services/OrderService"; 
import { createOrderSchema, payOrderSchema } from "../validators/orderValidator"; 

export const orderController = {

    // POST: Criar Pedido
    async createOrder(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id;
            
            // Valida e pega apenas gameIds (array de números)
            const validatedData = createOrderSchema.parse(req.body);
            
            // O Service faz toda a mágica (cálculo, verificação de estoque, criação)
            const newOrder = await OrderService.createOrder({ 
                userId, 
                gameIds: validatedData.gameIds
            });

            return res.status(201).json({  // Sucesso!
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
            return res.status(500).json({ error: "Erro interno ao criar o pedido." }); // Falha...
        }
    },

    // POST: Pagar Pedido
    async payOrder(req: Request, res: Response) {
        try {
            const orderId = parseInt(req.params.orderId);
            
            if (isNaN(orderId)) {
                 return res.status(400).json({ error: "ID do pedido inválido." }); // Falha...
            }

            const validatedData = payOrderSchema.parse(req.body);

            // O Service processa o pagamento
            const result = await OrderService.processPayment({ 
                orderId, 
                paymentMethod: validatedData.paymentMethod, 
                cardNumber: validatedData.cardNumber 
            });

            if (result.transaction.status === 'SUCCESS') {
                return res.status(200).json({  // Sucesso!
                    message: "Pagamento Aprovado!",
                    ...result
                });
            } else {
                return res.status(400).json({  // Falha...
                    error: result.gatewayMessage,
                    ...result
                });
            }

        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ error: "Dados inválidos.", details: error.issues }); // Falha...
            }
            if (error instanceof Error) {
                return res.status(400).json({ error: error.message }); // Falha...
            }
            return res.status(500).json({ error: "Erro ao processar pagamento." }); // Falha...
        }
    },

    // GET: Histórico
    async getUserOrders(req: Request, res: Response) {
        try {
            const userId = (req as any).user?.id; 
            const orders = await OrderService.getUserOrders(userId);
            return res.status(200).json(orders); // Sucesso!
        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar histórico." }); // Falha...
        }
    }
};