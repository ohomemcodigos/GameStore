import { z } from "zod";

export const createGameSchema = z.object({
    title: z
    .string() // O título é uma string, obrigatório
    .min(3, { message: "O título é obrigatório e deve ter no mínimo 3 caracteres." }), // O .min(3) coloca uma restrição para que tenha ao menos 3 caracteres para o título 
    
    description: z
    .string() // A descrição é uma string
    .optional(), // O .optional() diz que ela não é obrigatória
    // O gênero é uma string, obrigatório
    
    genre: z
    .string() // A descrição é uma string
    .min(1, { message: "O gênero é obrigatório." }), // O gênero é obrigatório

    price: z.coerce
    .number() // O preço é um número
    .positive({ message: "O preço deve possuir um valor positivo." }) // O preço deve possuir um valor positivo
    .refine((n) => !isNaN(n), { message: "O preço deve ser um número válido." }),
});

// O .partial() é usado para pegar todas as regras do createGameSchema e tornar todas elas opcionais
// Isso permite que o usuário atualize dados específicos 
export const updateGameSchema = createGameSchema.partial();