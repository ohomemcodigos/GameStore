import { Request, Response } from 'express';
import { ZodError } from 'zod';
import { registerUserSchema, updateUserSchema } from '../validators/userValidator';
import { UserService } from '../services/UserService';

export const userController = {

    // POST: Registro
    async register(req: Request, res: Response) {
        try {
            const validatedData = registerUserSchema.parse(req.body); 
            const newUser = await UserService.register(validatedData);
            return res.status(201).json(newUser);

        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ error: "Dados inválidos", details: error.issues });
            }
            if (error instanceof Error && error.message.includes("cadastrado")) {
                return res.status(409).json({ error: error.message });
            }
            return res.status(500).json({ error: "Erro ao cadastrar usuário." });
        }
    },

    // POST: Login
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ error: "Email e senha são obrigatórios." });
            }
            
            const result = await UserService.login({ email, password });

            if (!result) {
                return res.status(401).json({ error: "Credenciais inválidas." });
            }

            return res.status(200).json(result);

        } catch (error) {
            return res.status(500).json({ error: "Erro ao realizar login." });
        }
    },

    // GET: User por ID
    async getById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const user = await UserService.findById(id);
            
            if (!user) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }
            return res.status(200).json(user);

        } catch (error) {
            return res.status(500).json({ error: "Erro ao buscar usuário." });
        }
    },

    // PUT: Update
    async update(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const validatedData = updateUserSchema.parse(req.body);

            const updatedUser = await UserService.update(id, validatedData);
            
            return res.status(200).json(updatedUser);

        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({ error: "Dados inválidos", details: error.issues });
            }
            // Erro do Prisma (P2025 = Not Found)
            if ((error as any).code === "P2025") {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }
            return res.status(500).json({ error: "Erro ao atualizar usuário." });
        }
    },

    // DELETE
    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await UserService.delete(id);
            return res.status(204).send();

        } catch (error) {
            if ((error as any).code === "P2025") {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }
            return res.status(500).json({ error: "Erro ao deletar usuário." });
        }
    }
};