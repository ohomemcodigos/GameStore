import { z } from "zod";

// Regex simples e eficiente para e-mails
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

export const registerUserSchema = z.object({
    name: z.string()
           .min(3, "O nome deve ter no mínimo 3 caracteres"),
    
    email: z.string()
            .regex(emailRegex, "Por favor, insira um e-mail válido"),
    
    password: z.string()
               .min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export const updateUserSchema = registerUserSchema.partial();