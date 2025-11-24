import { z } from "zod";

// Regex simples e eficiente para e-mails
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

// Schema  para registro de usuário
export const registerUserSchema = z.object({
    name: z.string()
           .min(3, "O nome deve ter no mínimo 3 caracteres"),
    
    nickname: z.string()
        .min(2, "O apelido deve ter no mínimo 2 caracteres"),

    email: z.string()
            .regex(emailRegex, "Por favor, insira um e-mail válido"),
    
    password: z.string()
            .min(6, "A senha deve ter no mínimo 6 caracteres"),
});

// Schema de Update de usuário
export const updateUserSchema = z.object({
    name: z.string().min(3).optional(),
    email: z.string().regex(emailRegex).optional(),
    password: z.string().min(6).optional(),
    
    // Apelido e Avatar
    nickname: z.string()
               .min(2, "O apelido deve ter no mínimo 2 caracteres")
               .optional(),
               
    avatarUrl: z.string()
                .optional(), // Aceita URL normal ou Base64 (para upload de imagem)
});