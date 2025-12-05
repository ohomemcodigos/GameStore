import { release } from "os";
import { prisma } from "../config/prisma";
import { Prisma } from "@prisma/client";

interface CreateGameDTO {
  title: string;
  slug: string;
  description?: string;
  genre: string[];
  platforms: string[];
  developer: string[];
  publisher: string[];
  releaseDate: Date;
  price: number | string;
  discountPrice?: number | null;
  coverUrl?: string;
  isFeatured?: boolean;
  systemRequirements?: any;
  gallery?: any;
}

// Função auxiliar para criar slugs a partir do título
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^\w\s-]/g, "") // Remove caracteres especiais
    .replace(/\s+/g, "-"); // Troca espaços por traços
}

export const GameService = {

    // Listar todos os jogos
    async findAll() {
        return await prisma.game.findMany({
            include: { gallery: true }
        }); 
    },

    // Listar um jogo por ID
    async findById(id: number) {
        return await prisma.game.findUnique({
            where: { id },
            include: { gallery: true, reviews: true }
        });
    },

    // Listar um jogo por SLUG
    async findBySlug(slug: string) {
        return await prisma.game.findUnique({
            where: { slug }, // O campo slug deve ser @unique no schema.prisma
            include: { gallery: true, reviews: true }
        });
    },

    // Criar um novo jogo
    async create(data: CreateGameDTO) {
        // Se não mandou slug, gera a partir do título
        const finalSlug = data.slug || generateSlug(data.title);

        // Verifica se o slug já existe
        const existingSlug = await prisma.game.findUnique({ where: { slug: finalSlug } });
        if (existingSlug) {
            throw new Error("Já existe um jogo com este título/slug.");
        }

        return await prisma.game.create({
            data: {
                ...data,
                slug: finalSlug,
            }
        });
    },

    // Atualizar um jogo
    async update(id: number, data: any) {
        // Se mudou o título e não mandou slug, regera o slug
        let newSlug = data.slug;
        
        // Só gera novo slug se o título mudou E não enviaram um slug manual
        if (data.title && !newSlug) {
             // Opcional: Pode-se optar por não mudar o slug ao editar titulo para não quebrar links antigos
             newSlug = generateSlug(data.title);
        }

        return await prisma.game.update({
            where: { id },
            data: {
                ...data,
                slug: newSlug || undefined
            }
        });
    },

    // Deletar um jogo
    async delete(id: number) {
        // Apaga as dependências
        try {
             await prisma.gameMedia.deleteMany({ where: { gameId: id } });
        } catch (e) { /* Ignora se não tiver */ }
        
        return await prisma.game.delete({
            where: { id }
        });
    }
};