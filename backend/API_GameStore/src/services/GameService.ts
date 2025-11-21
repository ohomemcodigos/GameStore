// src/services/GameService.ts
import { prisma } from "../index";

type CreateGameData = any; 
type UpdateGameData = any;

export const GameService = {

    async findAll() {
        return await prisma.game.findMany(); 
    },

    async findById(id: number) {
        return await prisma.game.findUnique({
            where: { id }
        });
    },

    async create(data: CreateGameData) {
        return await prisma.game.create({
            data,
        });
    },

    async update(id: number, data: UpdateGameData) {
        return await prisma.game.update({
            where: { id },
            data,
        });
    },

    async delete(id: number) {
        await prisma.game.delete({
            where: { id },
        });
    }
};