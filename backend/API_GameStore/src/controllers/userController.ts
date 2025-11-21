import { Request, Response } from 'express';
import { prisma } from '../index';
import { ZodError } from 'zod'; // Importando o type do erro do Zod
import { registerUserSchema, updateUserSchema } from '../validators/userValidator';


/* -- Montando CRUD o userRoutes -- */

// POST
// Novo usuário
export const registerUser = async (req: Request, res: Response) => {
    try {
        const validatedData = registerUserSchema.parse(req.body); // Validação
        const { name, email, password } = req.body; // Pega o nome, o email e a senha digitados pelo usuário

        if ( !name || !email || !password ) { // Diz que, caso um dos campos estejam vazios, retornará um erro
            return res.status(400).json( { error: "Todos os campos são obrigatórios." });
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) { // Caso o usuário insira um email que já está cadastrado, retornará um erro de conflito
            return res.status(409).json({ error: "Este email já foi cadastrado e está sendo usado."});
        }

        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: password, // A senha será salva como string
            },
        });

        const { password: _, ...userWithoutPassword } = newUser;
        res.status(201).json(userWithoutPassword); // Sucesso!

    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ error: "Dados de registro inválidos", details: error.issues }); // Falha...
        }
                res.status(500).json({ error: "Erro ao cadastrar o usuário." }); // Falha...
    }
};

// POST
// Login
export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validação
        if ( !email || !password ) {
            return res.status(400).json({ error: "Os Campos de E-mail e de senha são obrigatórios." }); // Falha...
        }

        // Achando usuário a partir de seu E-mail
        const user = await prisma.user.findUnique({ where: { email } });

        // Caso o usuário não exista, suas credenciais são inválidas
        if(!user) {
            return res.status(401).json({ error: "As suas credenciais são inválidas." }); // Falha... O Error 401 é de falta de autorização
        }

        // Comparar a senha enviada pelo body com a que está registrada no BD
        const isPasswordCorrect = (password === user.password);
        if(!isPasswordCorrect) {
            return res.status(401).json({ error: "As suas credenciais são inválidas." }); // Falha...
        }

        // Login bem sucedido
        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword); // Sucesso!

    }catch (error) {
        res.status(500).json({ error: "Erro ao realizar Login." }); // Falha...
    }
}
// GET
// Usuário por ID
export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
        });
        if (!user){
            return res.status(404).json({ error: "Usuário não encontrado." }); // Falha...
        }

        // Remove a senha antes de enviar a resposta
        const { password: _, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword); // Sucesso!

    }catch(error) {
        res.status(500).json({ error: "Erro ao buscar usuário." }); // Falha...
    }
};

// PUT
// Atualizar user
export const updateUser = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const validatedData = updateUserSchema.parse(req.body);

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: validatedData,
        });

        const { password: _, ...userWithoutPassword } = updatedUser;
        res.status(200).json(userWithoutPassword);

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
        const { id } = req.params;
        await prisma.user.delete({
            where: { id: parseInt(id) },
        });

        res.status(204).send(); // Sucesso, sem conteúdo

    } catch (error) {
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === "P2025") {
            return res.status(404).json({ error: "Usuário não encontrado para ser deletado." }); // Falha...
        }
        res.status(500).json({ error: "Erro ao deletar usuário." }); // Falha...
    }
};