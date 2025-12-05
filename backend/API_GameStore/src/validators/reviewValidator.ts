import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z.number() 
    .int("A nota deve ser um número inteiro.")
    .min(1, "A nota mínima é 1.")
    .max(5, "A nota máxima é 5."),
  
  comment: z.string()
    .min(3, "O comentário deve ter pelo menos 3 caracteres.")
    .max(500, "O comentário não pode passar de 500 caracteres.")
});