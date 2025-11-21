import { z } from "zod";

export const createPurchaseSchema = z.object({
    userId: z
        .number()
        .refine((val) => typeof val === "number", {
            message: "O ID do usuário deve ser um número.",
        })
        .refine((val) => val !== undefined, {
            message: "O ID do usuário é obrigatório.",
        }),

    gameId: z
        .number()
        .refine((val) => typeof val === "number", {
            message: "O ID do jogo deve ser um número.",
        })
        .refine((val) => val !== undefined, {
            message: "O ID do jogo é obrigatório.",
        }),
});