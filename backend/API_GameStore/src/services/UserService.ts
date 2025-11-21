import { prisma } from "../index";
import * as bcrypt from 'bcrypt';

// Defina seus tipos reais (Use 'any' ou importe os tipos do Zod/Prisma)
type UserCreateInput = any; 
type UserUpdateInput = any;
type UserLoginInput = { email: string; password: string };

const SALT_ROUNDS = 10; // Custo do hashing. 10 é um bom padrão.

export const UserService = {

    // POST: Registro de Novo Usuário
    async register(data: UserCreateInput) {
        // 1. Verifica se o usuário já existe (Lógica de Negócio)
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            // Lança um erro que será capturado pelo Controller
            throw new Error("Este email já foi cadastrado e está sendo usado."); 
        }

        // 2. Criptografa a senha antes de salvar (Segurança)
        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

        // 3. Cria o usuário no DB com a senha criptografada
        const newUser = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword, 
            },
        });
        
        // Retorna o objeto sem a senha
        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    },

    // POST: Login
    async login({ email, password }: UserLoginInput) {
        // 1. Encontrar o usuário
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return null; // Usuário não encontrado
        }

        // 2. Compara a senha fornecida com o hash armazenado
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return null; // Senha incorreta
        }

        // Sucesso: Remove a senha e retorna os dados do usuário
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },

    // GET: Usuário por ID
    async findById(id: number) {
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return null;
        }

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },
    
    // PUT: Atualizar Usuário
    async update(id: number, data: UserUpdateInput) {
        // Lógica para hashing de nova senha (se a senha for fornecida)
        if (data.password) {
            data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: data,
        });

        const { password: _, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    },

    // DELETE: Deletar Usuário
    async delete(id: number) {
        // A exclusão no prisma usa o tratamento de erro P2025 no controller
        await prisma.user.delete({
            where: { id },
        });
    }
};