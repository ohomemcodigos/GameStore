import { Request, Response } from 'express';
import { ZodError } from 'zod'; // Importando o type do erro do Zod
import { registerUserSchema, updateUserSchema } from '../validators/userValidator';
import { UserService } from '../services/UserService';


/* -- Montando CRUD o userRoutes -- */

// POST
// Novo usuário
export const registerUser = async (req: Request, res: Response) => {
    try {
        // Validação (Zod garante que os campos obrigatórios estão presentes)
        const validatedData = registerUserSchema.parse(req.body); 
        
        // Chamando o Service para verificar existência e criptografar a senha
        const newUser = await UserService.register(validatedData);

        res.status(201).json(newUser); // Sucesso!

    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ error: "Dados de registro inválidos", details: error.issues }); // Falha...
        }
        // Tratamento do erro lançado pelo Service (email já existe)
        if (error instanceof Error && error.message.includes("email já foi cadastrado")) {
            return res.status(409).json({ error: error.message }); // Falha...
        }
        res.status(500).json({ error: "Erro ao cadastrar o usuário." }); // Falha...
    }
};

// POST
// Login
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if ( !email || !password ) {
            return res.status(400).json({ error: "Os Campos de E-mail e de senha são obrigatórios." }); // Falha...
        }
        
        // Chamando o Service para encontrar usuário e comparar a senha criptografada
        const user = await UserService.login({ email, password });

        // Se o Service retornar null, as credenciais são inválidas
        if(!user) {
            return res.status(401).json({ error: "As suas credenciais são inválidas." }); // Falha...
        }

        res.status(200).json(user); // Sucesso!

    }catch (error) {
        res.status(500).json({ error: "Erro ao realizar Login." }); // Falha...
    }
};

// GET
// Usuário por ID
export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        
        // Chamando o Service para buscar e remover a senha
        const user = await UserService.findById(id);
        
        if (!user){
            return res.status(404).json({ error: "Usuário não encontrado." }); // Falha...
        }

        res.status(200).json(user); // Sucesso!

    }catch(error) {
        res.status(500).json({ error: "Erro ao buscar usuário." }); // Falha...
    }
};

// PUT
// Atualizar user
export const updateUser = async (req: Request, res: Response) => {
    try{
        const id = parseInt(req.params.id);
        const validatedData = updateUserSchema.parse(req.body);

        // Chamando o Service para atualizar (e criptografar nova senha, se houver)
        const updatedUser = await UserService.update(id, validatedData);
        
        res.status(200).json(updatedUser);

    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ error: "Dados de atualização inválidos", details: error.issues }); // Falha...
        }
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === "P2025") {
            return res.status(404).json({ error: "Usuário não encontrado para ser atualizado." }); // Falha...
        }
        res.status(500).json({ error: "Erro ao atualizar usuário." }); // Falha...
    }
};

// DELETE
// Usuário
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        
        // Chamando o Service para deletar
        await UserService.delete(id);

        res.status(204).send(); // Sucesso, sem conteúdo

    } catch (error) {
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === "P2025") {
            return res.status(404).json({ error: "Usuário não encontrado para ser deletado." }); // Falha...
        }
        res.status(500).json({ error: "Erro ao deletar usuário." }); // Falha...
    }
};