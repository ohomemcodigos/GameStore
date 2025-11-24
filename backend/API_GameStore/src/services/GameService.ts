import { release } from "os";
import { prisma } from "../index";
import { Prisma } from "@prisma/client";

type CreateGameData = any; 
type UpdateGameData = any;

// Função auxiliar para criar slugs a partir do título
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/[^\w\s-]/g, "") // Remove caracteres especiais
    .replace(/\s+/g, "-"); // Troca espaços por traços
}

interface CreateGameDTO {
  title: string;
  slug: string;
  description?: string;
  genre: string[];
  platforms: string[];
  developer: string[];
  publisher: string[];
  releaseDate: Date; // Já vem convertido pelo Zod
  price: number | string;
  discountPrice?: number | null;
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
  async update(id: number, data: Partial<CreateGameDTO>) {
    // Se mudou o título e não mandou slug, regera o slug
    let newSlug = data.slug;
    if (data.title && !newSlug) {
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
    // Primeiro apaga as dependências para não dar erro de chave estrangeira
    await prisma.gameMedia.deleteMany({ where: { gameId: id } });
    
    return await prisma.game.delete({
      where: { id }
    });
  }
};