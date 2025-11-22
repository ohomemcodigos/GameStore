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

// Esquema de validação para criação de pedido
export const createOrderSchema = z.object({
    userId: z.number()
        .int("O ID do usuário deve ser um número inteiro positivo.") // Garante que o ID do usuário seja inteiro
        .positive("O ID do usuário deve ser positivo."), // Garante que o ID do usuário seja positivo

    items: z.array(orderItemSchema)
        .min(1, "O pedido deve conter pelo menos um item.") // Garante que o pedido tenha pelo menos um item
});

// Esquema de validação para pagamento de pedido
export const payOrderSchema = z.object({
    paymentMethod: z.enum(['CREDIT_CARD', 'PIX', 'BOLETO'], {
        error: "O método de pagamento deve ser 'CREDIT_CARD', 'PIX' ou 'BOLETO'."
    }), // Garante que o método de pagamento seja válido
    
    cardNumber: z.string().optional() 
        .refine(value => !value || (value.length >= 13 && value.length <= 16), {
            message: "Se fornecido, o número do cartão deve ter entre 13 e 16 dígitos."
        }) // Valida o número do cartão se fornecido
});