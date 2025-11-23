import { prisma } from "../index";
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Defina seus tipos reais
type UserCreateInput = any; 
type UserUpdateInput = any;
type UserLoginInput = { email: string; password: string };

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || 'minha_chave_secreta_super_segura';

export const UserService = {

    // POST: Registro
    async register(data: UserCreateInput) {
        const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
        if (existingUser) {
            throw new Error("Este email já foi cadastrado e está sendo usado."); 
        }

        const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

        const newUser = await prisma.user.create({
            data: {
                ...data,
                password: hashedPassword, 
            },
        });
        
        const { password: _, ...userWithoutPassword } = newUser;

        return userWithoutPassword;
    },

    // POST: Login
    async login({ email, password }: UserLoginInput) {
        // Encontrando o usuário
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return null; 

        // Comparaçãp da senha
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) return null; 

        // Sucesso: Prepara o usuário sem senha
        const { password: _, ...userWithoutPassword } = user;

        // Gera o Token JWT 
        const token = jwt.sign(
            { id: user.id }, // payload
            JWT_SECRET,      // A chave secreta para assinar
            { expiresIn: '1d' } // Opções do token (expiração de 1 dia)
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
        // A exclusão no prisma usa o tratamento de erro P2025 no controller
        await prisma.user.delete({
            where: { id },
        });
    }
};