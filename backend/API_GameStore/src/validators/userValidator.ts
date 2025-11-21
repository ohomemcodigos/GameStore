import { z } from "zod";

// Schema para REGISTRAR um novo usuário
export const registerUserSchema = z.object({
    name: z
    .string()
    .min(3, { message: "O nome deve ter no mínimo 3 caracteres." }),

    email: z
    .email({ message: "Por favor, insira um e-mail válido." }),

    password: z
    .string()
    .min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
});

// Schema para ATUALIZAR um usuário
// Usamos .partial() para tornar todos os campos opcionais
export const updateUserSchema = registerUserSchema.partial();