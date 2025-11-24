import { z } from 'zod';

// Esquema de validação para um item do pedido
export const orderItemSchema = z.object({
    gameId: z.number()
        .int("O ID do jogo deve ser um número inteiro positivo.") // Garante que o ID seja inteiro
        .positive("O ID do jogo deve ser positivo."), // Garante que o ID seja positivo

    quantity: z.number()
        .int("A quantidade deve ser um número inteiro.") // Garante que a quantidade seja inteira
        .min(1, "A quantidade deve ser pelo menos 1.") // Garante que a quantidade seja pelo menos 1
});

// Validação para criação do pedido
export const createOrderSchema = z.object({
        gameIds: z.array(
        z.number()
         .int()
         .positive()
        ).min(1, "O carrinho não pode estar vazio"),
});

// Validação para Pagamento
export const payOrderSchema = z.object({
    paymentMethod: z.enum(['CREDIT_CARD', 'PIX', 'BOLETO']),
    error: "O método de pagamento deve ser 'CREDIT_CARD', 'PIX' ou 'BOLETO'.",
    
    cardNumber: z.string()
        .min(13, "Cartão inválido")
        .max(16, "Cartão inválido")
        .optional()
        .or(z.literal('')), 
});