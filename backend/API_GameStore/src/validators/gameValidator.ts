import { z } from "zod";

export const createGameSchema = z.object({
    title: z
    .string() // O título é uma string, obrigatório
    .min(3, { message: "O título é obrigatório e deve ter no mínimo 3 caracteres." }),
    slug: z
    .string()
    .optional(),
    
    description: z
    .string() // A descrição é uma string
    .optional(), // O .optional() diz que ela não é obrigatória
    
    // O gênero é um array de strings, obrigatório
    genre: z
    .array(z.string())
    .min(1, "Selecione pelo menos um gênero"),
    platforms: z
    .array(z.string())
    .min(1, "Selecione pelo menos uma plataforma"),
    developer: z
    .array(z.string())
    .min(1, "Informe o desenvolvedor"),
    publisher: z
    .array(z.string())
    .min(1, "Informe a publicadora"),

    // Datas e Números (Vêm como string/number do JSON)
    releaseDate: z
    .string().or(z.date()).transform((val) => new Date(val)), // Aceita string ISO e converte

    price: z
    .union([z.string(), z.number()]).transform((val) => Number(val)), // Aceita "199.90" ou 199.90

coverUrl: z.string()
    .refine((val) => {
        try { return !!new URL(val); } catch { return false; }
    }, { message: "URL da imagem inválida (deve começar com http:// ou https://)" })
    .optional(),
    isFeatured: z
    .boolean().optional().default(false),
    ageRating: z
    .string().optional().default("L"),

    // JSON livre para requisitos do sistema
    systemRequirements: z.any().optional(),
});

// Para update, tudo é opcional
export const updateGameSchema = createGameSchema.partial();