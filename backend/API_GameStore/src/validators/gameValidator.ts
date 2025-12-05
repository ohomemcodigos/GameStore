import { z } from "zod";

export const createGameSchema = z.object({
    title: z
        .string()
        .min(3, { message: "O título é obrigatório e deve ter no mínimo 3 caracteres." }),
    
    slug: z
        .string()
        .optional(),
    
    description: z
        .string()
        .optional(),
    
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

    // Datas: Aceita string ISO ou Date e converte para Date
    releaseDate: z
        .string().or(z.date())
        .transform((val) => new Date(val)),

    // O preço aceita "199.90" ou 199.90 e converte para number
    price: z
        .union([z.string(), z.number()])
        .transform((val) => Number(val)),

    // Aceita string vazia, null, string de numero ou numero.
    // Transforma em null se for inválido ou zero.
    discountPrice: z
        .union([z.string(), z.number(), z.null()])
        .optional()
        .transform((val) => {
            if (val === "" || val === null || val === undefined) return null;
            const num = Number(val);
            return (isNaN(num) || num === 0) ? null : num;
        }),

    coverUrl: z.string()
        .refine((val) => {
            try { return !!new URL(val); } catch { return false; }
        }, { message: "URL da imagem inválida (deve começar com http:// ou https://)" })
        .optional(),

    // --- Galeria ---
    gallery: z.array(
        z.object({
            type: z.enum(["IMAGE", "VIDEO"]),
            url: z.string()
        })
    ).optional(),

    isFeatured: z
        .boolean().optional().default(false),
    
    ageRating: z
        .string().optional().default("L"),

    systemRequirements: z.any().optional(),
});

// Para update, tudo é opcional
export const updateGameSchema = createGameSchema.partial();