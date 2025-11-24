import { prisma } from "../index";
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface UserCreateInput {
    name: string;
    email: string;
    password: string;
    nickname: string; 
    avatarUrl?: string; 
}

interface UserUpdateInput {
    name?: string;
    email?: string;
    password?: string;
    nickname?: string;
    avatarUrl?: string;
}

interface UserLoginInput {
    email: string;
    password: string;
}

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'minha_chave_secreta_super_segura';

export const UserService = {

    // POST: Registro
    async register(data: UserCreateInput) {
        // Verifica E-mail
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            throw new Error("Este email já foi cadastrado e está sendo usado."); 
        }

        // Verifica Apelidp
        const existingNick = await prisma.user.findUnique({ where: { nickname: data.nickname } });
        if (existingNick) {
            throw new Error("Este apelido já está em uso. Por favor, escolha outro.");
        }

        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

        const newUser = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                nickname: data.nickname,
                password: hashedPassword, 
                avatarUrl: data.avatarUrl,
            },
        });
        
        const { password: _, ...userWithoutPassword } = newUser;
        return userWithoutPassword;
    },

    // POST: Login
    async login({ email, password }: UserLoginInput) {
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return null; 

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) return null; 

        const { password: _, ...userWithoutPassword } = user;

        // Gera Token JWT incluindo a ROLE e o ID
        const token = jwt.sign(
            { id: user.id, role: user.role }, 
            JWT_SECRET,      
            { expiresIn: '1d' } 
        );

        return {
            user: userWithoutPassword,
            token: token
        };
    },

    // GET: ID
    async findById(id: number) {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return null;
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    },
    
    // PUT: Update
    async update(id: number, data: UserUpdateInput) {
        // Se estiver mudando o apelido, verifica se já existe
        if (data.nickname) {
            const existingNick = await prisma.user.findUnique({ 
                where: { nickname: data.nickname } 
            });
            // Garante que não é o próprio usuário
            if (existingNick && existingNick.id !== id) {
                throw new Error("Este apelido já está em uso.");
            }
        }

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

    // DELETE
    async delete(id: number) {
        await prisma.user.delete({ where: { id } });
    }
};