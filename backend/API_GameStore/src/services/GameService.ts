import { release } from "os";
import { prisma } from "../index";
import { Prisma } from "@prisma/client";

type CreateGameData = any; 
type UpdateGameData = any;

interface CreateGameDTO {
  title: string;
  slug: string;
  description?: string;
  genre: string[];
  platforms: string[];
  developer: string[];
  publisher: string[];
  releaseDate: string; // Vem como string do JSON
  price: number | string;
  discountPrice?: number | string | null;
  coverUrl?: string;
  isFeatured?: boolean;
  systemRequirements?: any;
}

export const GameService = {

    // Listar toodos os jogos
    async findAll() {
        return await prisma.game.findMany(); 
    },

    // Listar um jogo por ID
    async findById(id: number) {
        return await prisma.game.findUnique({
            where: { id },
            include: { gallery: true }
        });
    },

    // Criar um novo jogo
    async create(data: CreateGameData) {
        return await prisma.game.create({
            data: {
                ...data,
                releaseDate: new Date(data.releaseDate),
                price: new Prisma.Decimal(data.price),
                discountPrice: data.discountPrice ? new Prisma.Decimal(data.discountPrice) : null,
            }
        });
    },

    // Atualizar um jogo existente
    async update(id: number, data: UpdateGameData) {
        return await prisma.game.update({
            where: { id },
            data: {
                ...data,
                releaseDate: data.releaseDate ? new Date(data.releaseDate) : undefined,
                price: data.price ? new Prisma.Decimal(data.price) : undefined,
                discountPrice: data.discountPrice ? new Prisma.Decimal(data.discountPrice) : null,
            }
        });
    },

    // Deletar um jogo existente
    async delete(id: number) {
        return await prisma.game.delete({
            where: { id },
        });
    }
};